import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ReviewsEvolutionChart } from '@/components/dashboard/ReviewsEvolutionChart';
import { RatingDistribution } from '@/components/dashboard/RatingDistribution';
import Link from 'next/link';
import { MOCK_REVIEWS } from '@/lib/mockReviews';
import { getMockMonthlyData, type MonthlyDataPoint } from '@/lib/mockChartData';
import { analyzeReview } from '@/lib/fraudDetection';
import type { ReviewForAnalysis } from '@/lib/fraudDetection';
import { GenerarInformeButton } from '@/components/dashboard/GenerarInformeButton';
import { DashboardRecentReviews } from '@/components/dashboard/DashboardRecentReviews';
import { OnboardingTutorial } from '@/components/dashboard/OnboardingTutorial';
import { WordAnalysis } from '@/components/dashboard/WordAnalysis';
import type { Review } from '@/components/dashboard/ReviewCard';

const STOPWORDS = new Set([
  'de','la','el','en','y','a','que','con','los','las','un','una','es','se','no','al','del',
  'lo','por','su','me','si','muy','pero','más','este','como','para','son','fue','ha','he',
  'te','tu','mi','todo','bien','mal','era','hay','vez','nos','le','les','ya','sin','sur',
  'ser','tan','así','tanto','solo','también','cuando','donde','esta','esto','ni','o','e',
  'aquí','allí','ahora','siempre','nunca','algo','nada','cada','cual','quien','qué','cómo',
  'dónde','cuándo','porque','aunque','mientras','desde','hasta','esa','ese','esas','estos',
  'esos','tuve','tiene','tenía','había','han','hemos','tener','hacer','venir','estar','sido',
  'sea','sean','fui','fueron','sobre','entre','ante','bajo','tras','hacia','poco','mucho',
]);

// Nouns that are semantically neutral regardless of rating context — never show in either column.
const NEUTRAL_NOUNS = new Set([
  'servicio','servicios','producto','productos','cliente','clientes','negocio','negocios',
  'precio','precios','lugar','local','locales','sitio','zona','espacio','tienda',
  'tiempo','cosa','cosas','gente','persona','personas','equipo','trabajo','resultado',
  'resultados','experiencia','experiencias','visita','visitas','trato','atencion',
  'proceso','dias','horas','veces','duda','dudas','problema','problemas','caso','casos',
  'momento','momentos','parte','partes','forma','tipo','tipos','nivel','tema','aspecto',
  'aspectos','punto','puntos','calidad','opinion','opiniones','comentario','comentarios',
]);

function extractWords(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOPWORDS.has(w));
}

function computeSentimentWords(
  reviews: Array<{ rating: number; text: string }>,
  topN = 15,
): { positiveWords: { word: string; count: number }[]; negativeWords: { word: string; count: number }[] } {
  const allFreq: Record<string, number> = {};
  const posFreq: Record<string, number> = {};
  const negFreq: Record<string, number> = {};

  for (const r of reviews) {
    const words = extractWords(r.text);
    for (const w of words) allFreq[w] = (allFreq[w] ?? 0) + 1;
    if (r.rating >= 4) for (const w of words) posFreq[w] = (posFreq[w] ?? 0) + 1;
    if (r.rating <= 2) for (const w of words) negFreq[w] = (negFreq[w] ?? 0) + 1;
  }

  // A word is distinctly positive/negative only if ≥65% of its total occurrences
  // come from that sentiment group — otherwise it's too shared across contexts.
  const sentimentRatio = (partial: number, total: number) => total > 0 ? partial / total : 0;

  const positiveWords = Object.entries(posFreq)
    .filter(([w, pos]) => !NEUTRAL_NOUNS.has(w) && sentimentRatio(pos, allFreq[w] ?? pos) >= 0.65)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word, count]) => ({ word, count }));

  const negativeWords = Object.entries(negFreq)
    .filter(([w, neg]) => !NEUTRAL_NOUNS.has(w) && sentimentRatio(neg, allFreq[w] ?? neg) >= 0.65)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word, count]) => ({ word, count }));

  return { positiveWords, negativeWords };
}

function computeMonthlyData(
  reviews: Array<{ publishedAt: string | Date; isReplied: boolean }>,
): MonthlyDataPoint[] {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() - (5 - i) + 1, 1);
    const monthReviews = reviews.filter((r) => {
      const pub = new Date(r.publishedAt);
      return pub >= d && pub < nextMonth;
    });
    return {
      month: d.toLocaleDateString('es-ES', { month: 'short' }),
      nuevas: monthReviews.length,
      respondidas: monthReviews.filter((r) => r.isReplied).length,
    };
  });
}

function formatDaysLeft(date: Date | null): string | null {
  if (!date) return null;
  const diff = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff <= 0) return null;
  return diff === 1 ? '1 día restante' : `${diff} días restantes`;
}

function formatDate(val: string | Date) {
  return new Date(val).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const userId = session.user.id;

  const [dbReviews, requestCount, dbUser] = await Promise.all([
    prisma.review.findMany({ where: { userId }, orderBy: { publishedAt: 'desc' } }),
    prisma.reviewRequest.count({ where: { userId } }),
    prisma.user.findUnique({ where: { id: userId }, select: { trialEndsAt: true, businessType: true, aiTone: true, onboardingCompleted: true } }),
  ]);

  const reviews = dbReviews.length > 0 ? dbReviews : MOCK_REVIEWS;
  const isMockData = dbReviews.length === 0;

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / totalReviews
    : 0;
  const pendingCount = reviews.filter((r) => !r.isReplied).length;
  const repliedCount = totalReviews - pendingCount;
  const responseRate = totalReviews > 0
    ? Math.round((repliedCount / totalReviews) * 100)
    : 0;

  const ratingDist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => { ratingDist[r.rating] = (ratingDist[r.rating] ?? 0) + 1; });

  const monthlyData = isMockData ? getMockMonthlyData() : computeMonthlyData(dbReviews);
  const daysLeft = formatDaysLeft(dbUser?.trialEndsAt ?? null);
  const firstName = session.user.name?.split(' ')[0] ?? 'amigo';

  const urgentCount = reviews.filter((r) => !r.isReplied && r.rating <= 2).length;

  const reviewsForAnalysis = reviews as unknown as ReviewForAnalysis[];

  const serializedReviews: Review[] = reviews.map((r) => ({
    id: r.id,
    authorName: r.authorName,
    authorInitials: r.authorInitials,
    rating: r.rating,
    text: r.text,
    publishedAt: r.publishedAt instanceof Date ? r.publishedAt.toISOString() : String(r.publishedAt),
    isReplied: r.isReplied,
    replyText: r.replyText ?? null,
    isNew: r.isNew,
  }));
  const suspiciousCount = reviewsForAnalysis.filter(
    (r) => analyzeReview(r, reviewsForAnalysis).isSuspicious,
  ).length;

  const { positiveWords, negativeWords } = computeSentimentWords(reviews);
  const totalPositive = reviews.filter((r) => r.rating >= 4).length;
  const totalNegative = reviews.filter((r) => r.rating <= 2).length;

  return (
    <div className="space-y-7 animate-fade-in">
      <OnboardingTutorial show={!dbUser?.onboardingCompleted} />

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            ¡Hola, {firstName}! 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Panel de reputación de{' '}
            <span className="font-semibold text-gray-700">{session.user.businessName}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <GenerarInformeButton />
          {isMockData && (
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Datos de demostración
            </div>
          )}
          {daysLeft && (
            <div className="flex items-center gap-1.5 bg-brand-50 border border-brand-200 text-brand-700 text-xs font-medium px-3 py-1.5 rounded-full">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Prueba gratuita · {daysLeft}
            </div>
          )}
        </div>
      </div>

      {/* ── Urgent alert ───────────────────────────────────── */}
      {urgentCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-red-800 text-sm">
                {urgentCount === 1 ? '1 reseña negativa sin responder' : `${urgentCount} reseñas negativas sin responder`}
              </p>
              <p className="text-red-600 text-xs mt-0.5">Las reseñas de 1-2 estrellas sin respuesta dañan tu reputación. Respóndelas ahora.</p>
            </div>
          </div>
          <Link
            href="/resenas?filter=pending"
            className="flex-shrink-0 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Responder ahora
          </Link>
        </div>
      )}

      {/* ── Suspicious reviews alert ────────────────────────── */}
      {suspiciousCount > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-orange-800 text-sm">
                {suspiciousCount === 1
                  ? '1 posible reseña falsa detectada'
                  : `${suspiciousCount} posibles reseñas falsas detectadas`}
              </p>
              <p className="text-orange-600 text-xs mt-0.5">
                La IA ha detectado patrones sospechosos. Revísalas y repórtalas a Google si lo confirmas.
              </p>
            </div>
          </div>
          <Link
            href="/resenas"
            className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            Revisar ahora
          </Link>
        </div>
      )}

      {/* ── Stats ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total reseñas"
          value={totalReviews}
          description="En Google My Business"
          color="brand"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          }
        />
        <StatsCard
          title="Puntuación media"
          value={`${avgRating.toFixed(1)} / 5`}
          description={avgRating >= 4 ? 'Muy buena reputación ✓' : avgRating >= 3 ? 'Mejorable' : 'Requiere atención'}
          color="amber"
          icon={
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          }
          progress={Math.round((avgRating / 5) * 100)}
        />
        <StatsCard
          title="Tasa de respuesta"
          value={`${repliedCount} / ${totalReviews}`}
          description={responseRate >= 80 ? 'Excelente — sigue así' : responseRate >= 50 ? 'Puedes mejorar' : 'Responde más reseñas'}
          color={responseRate >= 80 ? 'emerald' : responseRate >= 50 ? 'amber' : 'red'}
          progress={responseRate}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          }
        />
        <StatsCard
          title="Sin responder"
          value={pendingCount}
          description={pendingCount === 0 ? '¡Todo al día! Sigue así 🎉' : `${pendingCount} esperando tu respuesta`}
          color={pendingCount > 0 ? 'red' : 'emerald'}
          highlight={pendingCount > 0}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          }
        />
      </div>

      {/* ── Charts row ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ReviewsEvolutionChart data={monthlyData} />
        </div>
        <div>
          <RatingDistribution
            distribution={ratingDist}
            total={totalReviews}
            avgRating={avgRating}
          />
        </div>
      </div>

      {/* ── Word Analysis ──────────────────────────────────── */}
      <WordAnalysis
        positiveWords={positiveWords}
        negativeWords={negativeWords}
        totalPositive={totalPositive}
        totalNegative={totalNegative}
      />

      {/* ── Recent Reviews ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-gray-900">Reseñas recientes</h2>
            {pendingCount > 0 && (
              <span className="bg-brand-100 text-brand-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {pendingCount} pendientes
              </span>
            )}
          </div>
          <Link href="/resenas" className="text-sm font-medium text-brand-600 hover:underline flex items-center gap-1">
            Ver todas
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <DashboardRecentReviews allReviews={serializedReviews} />
      </div>

      {/* ── Quick actions ──────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* AI reply CTA */}
        <div className="relative bg-gradient-to-br from-[#060B18] to-brand-900 rounded-2xl p-6 text-white overflow-hidden">
          <div className="absolute inset-0 hex-bg-dark pointer-events-none opacity-60" />
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-brand-600/20 rounded-full blur-2xl pointer-events-none" />
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-brand-800/60 border border-brand-700/40 flex items-center justify-center mb-4 text-xl">✨</div>
            <h3 className="font-bold text-lg mb-1">Responder con IA</h3>
            <p className="text-white/60 text-sm mb-5 leading-relaxed">
              {pendingCount > 0
                ? `Tienes ${pendingCount} reseña${pendingCount > 1 ? 's' : ''} esperando respuesta. La IA redacta, tú apruebas.`
                : 'Todas las reseñas están respondidas. ¡Buen trabajo!'}
            </p>
            <Link
              href="/resenas"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all border border-white/10"
            >
              Gestionar reseñas
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Review requests CTA */}
        <div className="relative bg-gradient-to-br from-emerald-700 to-teal-700 rounded-2xl p-6 text-white overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/60 border border-emerald-500/40 flex items-center justify-center mb-4 text-xl">📧</div>
            <h3 className="font-bold text-lg mb-1">Consigue más reseñas</h3>
            <p className="text-white/60 text-sm mb-5 leading-relaxed">
              {requestCount > 0
                ? `Has enviado ${requestCount} solicitud${requestCount > 1 ? 'es' : ''}. Sigue pidiendo reseñas a tus clientes.`
                : 'Envía solicitudes de reseña por email o WhatsApp con un solo clic.'}
            </p>
            <Link
              href="/solicitudes"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all border border-white/10"
            >
              Enviar solicitudes
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Tip bar (only during trial) ────────────────────── */}
      {session.user.subscriptionStatus === 'trialing' && (
        <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0 text-base">💡</div>
          <p className="text-sm text-gray-500 flex-1">
            <span className="font-semibold text-gray-700">Consejo:</span>{' '}
            Conecta tu perfil de Google My Business en{' '}
            <Link href="/configuracion" className="text-brand-600 hover:underline font-medium">Configuración</Link>{' '}
            para ver tus reseñas reales aquí y responderlas con IA.
          </p>
          <Link
            href="/configuracion"
            className="flex-shrink-0 text-xs font-semibold text-brand-600 border border-brand-200 px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-colors"
          >
            Configurar →
          </Link>
        </div>
      )}
    </div>
  );
}
