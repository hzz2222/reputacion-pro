'use client';

import Link from 'next/link';
import { useState } from 'react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ReviewsEvolutionChart } from '@/components/dashboard/ReviewsEvolutionChart';
import { RatingDistribution } from '@/components/dashboard/RatingDistribution';
import { DemoReviewCard, type DemoReview } from '@/components/demo/DemoReviewCard';
import { Modal } from '@/components/ui/Modal';
import { analyzeReview } from '@/lib/fraudDetection';
import type { FraudAnalysis } from '@/lib/fraudDetection';

// ─── Demo data ────────────────────────────────────────────────────────────────

const d = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();

const RAW_REVIEWS = [
  // Suspicious cluster (same day, 2 days ago)
  { id: 'd-1',  authorName: 'R. Anónimo',      authorInitials: 'RA', rating: 1, text: 'Horrible.', publishedAt: d(2),  isReplied: false, replyText: null, isNew: true,  authorReviewCount: 1, authorAccountAgeDays: 2 },
  { id: 'd-2',  authorName: 'Usuario Google',   authorInitials: 'UG', rating: 1, text: 'Pésimo servicio.', publishedAt: d(2),  isReplied: false, replyText: null, isNew: true,  authorReviewCount: 1 },
  // Suspicious positive
  { id: 'd-3',  authorName: 'NuevoCliente123',  authorInitials: 'NC', rating: 5, text: 'Muy bueno.', publishedAt: d(4),  isReplied: false, replyText: null, isNew: false, authorReviewCount: 1, authorAccountAgeDays: 4 },
  // Real reviews
  { id: 'd-4',  authorName: 'María Rodríguez',  authorInitials: 'MR', rating: 5, text: 'La mejor paella que he probado en años. El ambiente es precioso y el servicio, impecable. El camarero Javi nos atendió de maravilla desde el primer momento. Volveremos sin ninguna duda este verano.', publishedAt: d(1), isReplied: false, replyText: null, isNew: true },
  { id: 'd-5',  authorName: 'Carlos Jiménez',   authorInitials: 'CJ', rating: 5, text: 'Celebramos nuestro aniversario aquí y fue una experiencia 10/10. La atención fue extraordinaria — el chef salió personalmente a saludarnos. El menú degustación, una auténtica delicia de principio a fin.', publishedAt: d(5), isReplied: true, replyText: '¡Muchas gracias Carlos! Nos alegra enormemente que vuestra celebración fuera tan especial. El chef se acordará de vosotros. ¡Feliz aniversario y esperamos veros muy pronto!', isNew: false },
  { id: 'd-6',  authorName: 'Laura Moreno',     authorInitials: 'LM', rating: 5, text: 'Sitio muy acogedor, trato familiar y cercano. Las croquetas de jamón son espectaculares — las mejores que he probado en mucho tiempo. Precio muy razonable para la calidad. Sin duda repetiré.', publishedAt: d(8), isReplied: true, replyText: '¡Gracias Laura! Las croquetas las hacemos cada mañana con receta casera heredada de tres generaciones. Nos alegra que te hayan gustado tanto. ¡Te esperamos pronto!', isNew: false },
  { id: 'd-7',  authorName: 'Pablo García',     authorInitials: 'PG', rating: 4, text: 'Muy buen restaurante. La espera al pedir fue un poco larga, unos 20 minutos, pero el resultado mereció la pena. El arroz con bogavante estaba exquisito y la sangría, deliciosa. Repetiremos seguro.', publishedAt: d(12), isReplied: true, replyText: '¡Gracias Pablo! Tomamos nota de los tiempos de espera, tienes toda la razón. El arroz con bogavante es nuestra especialidad de la casa. ¡Hasta muy pronto!', isNew: false },
  { id: 'd-8',  authorName: 'Sofía Martínez',   authorInitials: 'SM', rating: 4, text: 'Buena comida casera a precio muy justo. Pedimos el menú del mediodía y la relación calidad-precio es inmejorable. El tiramisú de postre fue sobresaliente. Volveremos.', publishedAt: d(16), isReplied: true, replyText: '¡Muchas gracias Sofía! El menú del mediodía es nuestra apuesta por hacer accesible la cocina de calidad. El tiramisú es casero, nos alegramos de que lo hayas disfrutado. ¡Hasta pronto!', isNew: false },
  { id: 'd-9',  authorName: 'Antonio López',    authorInitials: 'AL', rating: 3, text: 'Correcto pero sin más. La comida estaba buena pero el servicio tardó bastante — más de 30 minutos para que tomaran nota. Para el precio que tienen, esperaba algo más de atención al cliente.', publishedAt: d(19), isReplied: false, replyText: null, isNew: false },
  { id: 'd-10', authorName: 'Elena Ruiz',       authorInitials: 'ER', rating: 2, text: 'Pedimos el menú del día y tardaron 45 minutos en traer el primer plato. La sopa llegó completamente fría. El personal parecía desbordado. No sé si les daré una segunda oportunidad.', publishedAt: d(21), isReplied: false, replyText: null, isNew: false },
  { id: 'd-11', authorName: 'Javier Sánchez',   authorInitials: 'JS', rating: 5, text: 'Reservamos para una comida de empresa de 15 personas y todo salió perfecto. Los entrantes variados, el cordero asado espectacular y el equipo fue muy profesional y atento en todo momento. Totalmente recomendable para grupos y eventos.', publishedAt: d(25), isReplied: true, replyText: '¡Gracias Javier! Es un placer organizar eventos para empresas. Vuestros comentarios motivan a todo el equipo. Cuando queráis repetir, aquí estaremos con los brazos abiertos.', isNew: false },
  { id: 'd-12', authorName: 'Rosa Fernández',   authorInitials: 'RF', rating: 1, text: 'Muy decepcionante. El pescado no estaba fresco, la atención fue descuidada y tuvimos que esperar más de una hora para que nos sirvieran. Para ese precio, esperaba mucho más.', publishedAt: d(29), isReplied: true, replyText: 'Rosa, sentimos profundamente que tu experiencia no estuviera a la altura. Lo del pescado no tiene excusa y lo hemos corregido de inmediato. Nos gustaría invitarte a una nueva visita para compensarte. Escríbenos a contacto@barelrincon.es y lo gestionamos enseguida.', isNew: false },
];

const AI_RESPONSES: Record<string, string> = {
  // 1-2 estrellas: tono empático, disculpas y solución concreta
  'd-1': 'R. Anónimo, lamentamos profundamente que tu experiencia en Bar El Rincón haya sido tan negativa. Esto no es el nivel que queremos ofrecer y nos duele leerlo. Por favor, escríbenos directamente a contacto@barelrincon.es para que podamos escucharte, entender qué ocurrió y compensarte como mereces. Queremos tener la oportunidad de demostrarle que podemos hacerlo mucho mejor.',
  'd-2': 'Sentimos mucho que el servicio que recibiste en Bar El Rincón estuviera lejos de lo que mereces. No hay excusa que valga cuando un cliente sale con esa experiencia. Nos gustaría escucharte personalmente: escríbenos a contacto@barelrincon.es o pásate por el local y pediremos hablar contigo. Queremos solucionar lo ocurrido y darte la atención que merecías desde el primer momento.',
  'd-10': 'Elena, lo sentimos muchísimo. Una sopa fría después de 45 minutos de espera es inaceptable — no tiene ninguna excusa. Ese día el servicio falló y es nuestra responsabilidad. Nos gustaría invitarte a volver como nuestra invitada para que compruebes que lo que describes no refleja cómo somos habitualmente. Escríbenos a contacto@barelrincon.es y lo organizamos. Gracias por darnos la oportunidad de mejorar.',
  // 3 estrellas: agradecido pero reconoce la espera
  'd-9': 'Antonio, gracias por tu comentario y por la honestidad. Tienes razón, los tiempos de espera en horas punta son algo en lo que seguimos trabajando activamente. Hemos incorporado nuevo personal y ajustado los turnos para mejorar precisamente esto. Te invitamos a volver para comprobar la diferencia. ¡Hasta pronto!',
  // 4-5 estrellas: cálido y personalizado
  'd-3': '¡Muchas gracias por tu valoración! Nos alegra saber que disfrutaste de tu visita a Bar El Rincón. Es un placer tenerte entre nuestros clientes. ¡Te esperamos de nuevo muy pronto!',
  'd-4': '¡Muchas gracias María! Tu comentario nos llena de alegría. La paella es nuestra receta familiar de toda la vida, elaborada con ingredientes frescos cada día. Javi y todo el equipo están encantados con tu valoración. ¡Hasta muy pronto!',
};

const DEMO_REVIEWS: DemoReview[] = RAW_REVIEWS.map((r) => ({
  ...r,
  fraudAnalysis: analyzeReview(r, RAW_REVIEWS) as FraudAnalysis,
}));

const DEMO_MONTHLY = (() => {
  const now = new Date();
  const counts = [2, 3, 4, 5, 5, 7];
  const resps  = [1, 2, 2, 3, 4, 5];
  return Array.from({ length: 6 }, (_, i) => {
    const d2 = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { month: d2.toLocaleDateString('es-ES', { month: 'short' }), nuevas: counts[i], respondidas: resps[i] };
  });
})();

const DEMO_REQUESTS = [
  { name: 'María García',  initials: 'MG', channel: 'email',    sent: 'Hace 2 horas', status: 'sent',      label: 'Enviada' },
  { name: 'Pedro Alonso',  initials: 'PA', channel: 'whatsapp', sent: 'Hace 1 día',   status: 'opened',    label: 'Abierta' },
  { name: 'Carmen López',  initials: 'CL', channel: 'email',    sent: 'Hace 3 días',  status: 'completed', label: 'Completada' },
  { name: 'Marcos Ruiz',   initials: 'MR', channel: 'whatsapp', sent: 'Hace 5 días',  status: 'completed', label: 'Completada' },
  { name: 'Lucía Romero',  initials: 'LR', channel: 'email',    sent: 'Hace 8 días',  status: 'completed', label: 'Completada' },
];

const COMPETITORS = [
  { name: 'Bar El Rincón',      rating: 3.9, reviews: 12, responseRate: 58, isUs: true },
  { name: 'Bar La Tasca',       rating: 4.2, reviews: 38, responseRate: 82, isUs: false },
  { name: 'Cafetería Central',  rating: 4.0, reviews: 27, responseRate: 44, isUs: false },
  { name: 'Bar El Puerto',      rating: 3.7, reviews: 15, responseRate: 27, isUs: false },
  { name: 'Restaurante Miramar',rating: 4.5, reviews: 94, responseRate: 91, isUs: false },
];

// ─── Stats ────────────────────────────────────────────────────────────────────

const totalReviews    = DEMO_REVIEWS.length;
const avgRating       = parseFloat((DEMO_REVIEWS.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1));
const repliedCount    = DEMO_REVIEWS.filter((r) => r.isReplied).length;
const pendingCount    = totalReviews - repliedCount;
const responseRate    = Math.round((repliedCount / totalReviews) * 100);
const urgentCount     = DEMO_REVIEWS.filter((r) => !r.isReplied && r.rating <= 2).length;
const suspiciousCount = DEMO_REVIEWS.filter((r) => r.fraudAnalysis?.isSuspicious).length;

const ratingDist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
DEMO_REVIEWS.forEach((r) => { ratingDist[r.rating] = (ratingDist[r.rating] ?? 0) + 1; });

type Filter = 'all' | 'pending' | 'suspicious';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DemoPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [solicitudModalOpen, setSolicitudModalOpen] = useState(false);
  const [solicitudSent, setSolicitudSent] = useState(false);
  const [solicitudName, setSolicitudName] = useState('');
  const [solicitudEmail, setSolicitudEmail] = useState('');
  const [solicitudChannel, setSolicitudChannel] = useState<'email' | 'whatsapp'>('email');

  const filtered = DEMO_REVIEWS.filter((r) => {
    if (filter === 'pending')    return !r.isReplied;
    if (filter === 'suspicious') return r.fraudAnalysis?.isSuspicious ?? false;
    return true;
  });

  function handleSolicitudSend() {
    setSolicitudSent(true);
  }

  function handleSolicitudClose() {
    setSolicitudModalOpen(false);
    setSolicitudSent(false);
    setSolicitudName('');
    setSolicitudEmail('');
    setSolicitudChannel('email');
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Sticky demo banner ──────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 bg-amber-400 border-b border-amber-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-amber-900 text-sm font-medium">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.87V15.13a1 1 0 01-1.447.9L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>
              <span className="font-bold">Panel de demostración</span> — Bar El Rincón.
              Pruébalo con tu propio negocio sin tarjeta de crédito.
            </span>
          </div>
          <Link href="/registro" className="flex-shrink-0 bg-amber-900 hover:bg-amber-800 text-amber-50 text-xs font-bold px-4 py-1.5 rounded-lg transition-colors whitespace-nowrap">
            Empezar gratis →
          </Link>
        </div>
      </div>

      {/* ── Top nav ─────────────────────────────────────────────────────── */}
      <header className="bg-[#060B18] border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div>
              <span className="text-white font-bold text-sm">Bar El Rincón</span>
              <span className="ml-2 text-white/30 text-xs">· demo</span>
            </div>
          </div>
          <Link href="/registro" className="bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-md">
            Usar con mi negocio →
          </Link>
        </div>
      </header>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">¡Hola, Carlos! 👋</h1>
            <p className="text-gray-500 mt-1">Panel de reputación de <span className="font-semibold text-gray-700">Bar El Rincón</span></p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Datos de demostración
            </span>
            <span className="inline-flex items-center gap-1.5 bg-brand-50 border border-brand-200 text-brand-700 text-xs font-medium px-3 py-1.5 rounded-full">
              Prueba gratuita · 29 días restantes
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <StatsCard title="Total reseñas" value={totalReviews} description="En Google My Business" color="brand"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
          />
          <StatsCard title="Puntuación media" value={`${avgRating} / 5`} description="Mejorable" color="amber" progress={Math.round((avgRating / 5) * 100)}
            icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>}
          />
          <StatsCard title="Tasa de respuesta" value={`${repliedCount} / ${totalReviews}`} description="Puedes mejorar" color="amber" progress={responseRate}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
          />
          <StatsCard title="Sin responder" value={pendingCount} description={`${pendingCount} esperando respuesta`} color="red" highlight
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}
          />
        </div>

        {/* Alerts */}
        <div className="space-y-3">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div>
                <p className="font-semibold text-orange-800 text-sm">{suspiciousCount} posibles reseñas falsas detectadas</p>
                <p className="text-orange-600 text-xs mt-0.5">La IA ha detectado patrones sospechosos. Revísalas y repórtalas a Google si lo confirmas.</p>
              </div>
            </div>
            <button onClick={() => setFilter('suspicious')} className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              Ver ahora
            </button>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div>
                <p className="font-semibold text-red-800 text-sm">{urgentCount} reseñas negativas sin responder</p>
                <p className="text-red-600 text-xs mt-0.5">Las reseñas de 1-2 estrellas sin respuesta dañan tu posición en Google Maps.</p>
              </div>
            </div>
            <button onClick={() => setFilter('pending')} className="flex-shrink-0 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              Responder ahora
            </button>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2"><ReviewsEvolutionChart data={DEMO_MONTHLY} /></div>
          <div><RatingDistribution distribution={ratingDist} total={totalReviews} avgRating={avgRating} /></div>
        </div>

        {/* ── Reviews section ───────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="font-bold text-gray-900 text-lg">
              Reseñas de Google
              <span className="ml-2 text-sm font-normal text-gray-400">({filtered.length} de {totalReviews})</span>
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {([
                ['all',        'Todas'],
                ['pending',    `Sin responder (${pendingCount})`],
                ['suspicious', `Sospechosas (${suspiciousCount})`],
              ] as [Filter, string][]).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setFilter(val)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filter === val
                      ? val === 'suspicious' ? 'bg-orange-500 text-white' : 'bg-brand-600 text-white'
                      : val === 'suspicious' ? 'bg-orange-50 border border-orange-200 text-orange-600 hover:bg-orange-100' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {val === 'suspicious' && (
                    <svg className="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                  {label}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-400">No hay reseñas en este filtro</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((review) => (
                <DemoReviewCard
                  key={review.id}
                  review={review}
                  aiResponse={AI_RESPONSES[review.id] ?? '¡Muchas gracias por tu reseña! Es un placer tenerte entre nuestros clientes de Bar El Rincón. ¡Esperamos verte de nuevo pronto!'}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Solicitudes section ───────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Solicitar reseñas</h2>
              <p className="text-sm text-gray-500 mt-0.5">Envía invitaciones a tus clientes por email o WhatsApp con un clic</p>
            </div>
            <button
              onClick={() => setSolicitudModalOpen(true)}
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nueva solicitud
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Enviadas', value: '24', color: 'text-gray-900' },
              { label: 'Completadas', value: '9',  color: 'text-emerald-600' },
              { label: 'Conversión', value: '37%', color: 'text-brand-600' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 grid grid-cols-[auto_1fr_auto_auto] gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <span />
              <span>Cliente</span>
              <span className="text-right hidden sm:block">Canal</span>
              <span className="text-right">Estado</span>
            </div>
            {DEMO_REQUESTS.map((req, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {req.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900">{req.name}</p>
                  <p className="text-xs text-gray-400">{req.sent}</p>
                </div>
                <span className="text-xs text-gray-500 hidden sm:block">
                  {req.channel === 'email' ? '📧 Email' : '💬 WhatsApp'}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                  req.status === 'completed' ? 'bg-emerald-50 text-emerald-700'
                  : req.status === 'opened'  ? 'bg-brand-50 text-brand-700'
                  : 'bg-gray-50 text-gray-500'
                }`}>
                  {req.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Competidores section ──────────────────────────────────────── */}
        <div className="space-y-4">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Análisis de competidores</h2>
            <p className="text-sm text-gray-500 mt-0.5">Compara tu reputación con los bares y restaurantes de tu zona</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="hidden sm:grid sm:grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <span>Negocio</span>
              <span className="text-right">Nota</span>
              <span className="text-right">Reseñas</span>
              <span className="text-right">Tasa respuesta</span>
            </div>
            {COMPETITORS.map((c, i) => (
              <div
                key={i}
                className={`flex sm:grid sm:grid-cols-[1fr_auto_auto_auto] items-center gap-3 sm:gap-4 px-5 py-3.5 border-b border-gray-50 last:border-0 ${c.isUs ? 'bg-brand-50/50' : ''}`}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {c.isUs && <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />}
                  <span className={`text-sm truncate ${c.isUs ? 'font-bold text-brand-700' : 'font-medium text-gray-700'}`}>{c.name}</span>
                  {c.isUs && <span className="text-xs text-brand-400 flex-shrink-0">(tú)</span>}
                </div>
                <span className={`text-sm font-semibold text-right ${c.rating >= 4.2 ? 'text-emerald-600' : c.rating >= 4.0 ? 'text-amber-600' : 'text-red-500'}`}>
                  ⭐ {c.rating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-600 text-right">{c.reviews}</span>
                <span className={`text-sm font-medium text-right ${c.responseRate >= 80 ? 'text-emerald-600' : c.responseRate >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                  {c.responseRate}%
                </span>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
            <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-amber-800">
              <span className="font-semibold">Bar La Tasca</span> te supera en nota media y tasa de respuesta.
              Respondiendo más reseñas podrías alcanzar su nivel en 30 días.
            </p>
          </div>
        </div>

        {/* ── Bottom CTA ────────────────────────────────────────────────── */}
        <div className="relative bg-gradient-to-br from-[#060B18] to-brand-900 rounded-3xl p-8 sm:p-12 text-center overflow-hidden">
          <div className="absolute inset-0 hex-bg-dark pointer-events-none opacity-60" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-brand-700/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <p className="text-brand-400 font-semibold text-sm uppercase tracking-widest mb-4">¿Listo para probarlo con tu negocio?</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
              Empieza gratis con tus<br />reseñas reales de Google
            </h2>
            <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              Sin tarjeta de crédito. En menos de 2 minutos tu panel estará listo con tus reseñas reales.
              Si en 30 días no ves el valor, simplemente no activas la suscripción.
            </p>
            <Link
              href="/registro"
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white font-bold text-lg px-10 py-4 rounded-xl shadow-2xl shadow-brand-950/60 hover:shadow-brand-700/50 transition-all duration-300 hover:-translate-y-1 btn-glow"
            >
              Crear mi cuenta gratis ahora
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <p className="mt-4 text-white/25 text-sm">30 días gratis · Sin tarjeta · Cancela cuando quieras</p>
          </div>
        </div>

      </main>

      {/* ── Solicitud demo modal ─────────────────────────────────────────── */}
      <Modal isOpen={solicitudModalOpen} onClose={handleSolicitudClose} title="Enviar solicitud de reseña" size="lg">
        {solicitudSent ? (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg mb-1">¡Solicitud enviada!</p>
              <p className="text-gray-500 text-sm">
                {solicitudName || 'Tu cliente'} recibirá un {solicitudChannel === 'email' ? 'email' : 'mensaje de WhatsApp'} con el enlace para dejar su reseña.
              </p>
            </div>
            <div className="bg-brand-50 border border-brand-100 rounded-xl px-5 py-4 text-sm text-brand-700 max-w-sm">
              En la versión real, la solicitud se envía automáticamente y puedes ver el estado (enviada → abierta → completada) en tiempo real.
            </div>
            <Link href="/registro" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors">
              Crear mi cuenta gratis →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre del cliente</label>
              <input
                type="text"
                value={solicitudName}
                onChange={(e) => setSolicitudName(e.target.value)}
                placeholder="Ej: María García"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Canal de envío</label>
              <div className="grid grid-cols-2 gap-3">
                {(['email', 'whatsapp'] as const).map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setSolicitudChannel(ch)}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                      solicitudChannel === ch
                        ? 'border-brand-400 bg-brand-50 text-brand-700 ring-1 ring-brand-300'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-base">{ch === 'email' ? '📧' : '💬'}</span>
                    {ch === 'email' ? 'Email' : 'WhatsApp'}
                  </button>
                ))}
              </div>
            </div>
            {solicitudChannel === 'email' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email del cliente</label>
                <input
                  type="email"
                  value={solicitudEmail}
                  onChange={(e) => setSolicitudEmail(e.target.value)}
                  placeholder="cliente@ejemplo.com"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                />
              </div>
            )}
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1.5">Vista previa del mensaje</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Hola {solicitudName || '[nombre]'}, gracias por visitarnos en <strong>Bar El Rincón</strong>. ¿Podrías dejarnos una reseña en Google? Tu opinión nos ayuda a seguir mejorando. [enlace directo a Google]
              </p>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={handleSolicitudClose} className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
                Cancelar
              </button>
              <button
                onClick={handleSolicitudSend}
                disabled={!solicitudName.trim() || (solicitudChannel === 'email' && !solicitudEmail.trim())}
                className="flex-1 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Enviar solicitud
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
