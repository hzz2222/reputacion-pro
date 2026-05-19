import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { MOCK_REVIEWS } from '@/lib/mockReviews';

const STOPWORDS = new Set([
  'de','la','el','en','y','a','que','con','los','las','un','una','es','se','no','al','del',
  'lo','por','su','me','si','muy','pero','más','este','como','para','son','fue','ha','he',
  'te','tu','mi','todo','bien','mal','era','hay','vez','nos','le','les','ya','sin','sur',
  'ser','vez','tan','así','tanto','solo','también','cuando','donde','esta','este','esto',
  'ni','o','e','u','aquí','allí','ahora','siempre','nunca','algo','nada','todo','cada',
  'cual','quien','qué','cómo','dónde','cuándo','porque','aunque','mientras','desde','hasta',
  'este','esa','ese','esas','estos','esos','tuve','tiene','tenía','tiene','había','han',
  'hemos','tener','hacer','ir','venir','estar','sido','sea','sean','fui','fueron',
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

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { businessName: true },
  });

  const dbReviews = await prisma.review.findMany({
    where: { userId: session.user.id },
    orderBy: { publishedAt: 'desc' },
    select: { rating: true, text: true, publishedAt: true, isReplied: true, authorName: true },
  });

  const rawReviews = dbReviews.length > 0
    ? dbReviews.map((r) => ({ ...r, publishedAt: new Date(r.publishedAt) }))
    : MOCK_REVIEWS.map((r) => ({ ...r, publishedAt: new Date(r.publishedAt) }));

  const now = new Date();
  const thisMonthKey = getMonthKey(now);
  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthKey = getMonthKey(prevMonthDate);

  const thisMonth = rawReviews.filter((r) => getMonthKey(r.publishedAt) === thisMonthKey);
  const prevMonth = rawReviews.filter((r) => getMonthKey(r.publishedAt) === prevMonthKey);

  const avg = (arr: typeof rawReviews) =>
    arr.length > 0 ? arr.reduce((s, r) => s + r.rating, 0) / arr.length : null;

  const responseRate = rawReviews.length > 0
    ? Math.round((rawReviews.filter((r) => r.isReplied).length / rawReviews.length) * 100)
    : 0;

  const prevResponseRate = rawReviews.filter((r) => getMonthKey(r.publishedAt) <= prevMonthKey).length > 0
    ? Math.round(
        rawReviews.filter((r) => getMonthKey(r.publishedAt) <= prevMonthKey && r.isReplied).length /
        rawReviews.filter((r) => getMonthKey(r.publishedAt) <= prevMonthKey).length * 100,
      )
    : 0;

  // Word frequency across all reviews
  const wordCount: Record<string, number> = {};
  for (const r of rawReviews) {
    for (const w of extractWords(r.text)) {
      wordCount[w] = (wordCount[w] ?? 0) + 1;
    }
  }
  const topWords = Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word, count]) => ({ word, count }));

  // Last 6 months evolution
  const monthly = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const key = getMonthKey(d);
    const bucket = rawReviews.filter((r) => getMonthKey(r.publishedAt) === key);
    return {
      month: d.toLocaleDateString('es-ES', { month: 'short' }),
      count: bucket.length,
      avgRating: avg(bucket) ?? 0,
    };
  });

  // Top 3 reviews (highest rated, with text)
  const topReviews = [...rawReviews]
    .filter((r) => r.text.length > 20)
    .sort((a, b) => b.rating - a.rating || b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, 3)
    .map((r) => ({
      author: r.authorName,
      rating: r.rating,
      text: r.text.length > 120 ? r.text.slice(0, 120) + '…' : r.text,
      date: r.publishedAt.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
    }));

  const monthLabel = now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const prevMonthLabel = prevMonthDate.toLocaleDateString('es-ES', { month: 'long' });

  return NextResponse.json({
    businessName: user?.businessName ?? session.user.businessName,
    month: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
    prevMonthLabel: prevMonthLabel.charAt(0).toUpperCase() + prevMonthLabel.slice(1),
    stats: {
      totalReviews: rawReviews.length,
      avgRating: parseFloat((avg(rawReviews) ?? 0).toFixed(2)),
      responseRate,
      newThisMonth: thisMonth.length,
      newLastMonth: prevMonth.length,
      avgRatingThisMonth: thisMonth.length > 0 ? parseFloat((avg(thisMonth)!).toFixed(2)) : null,
      avgRatingLastMonth: prevMonth.length > 0 ? parseFloat((avg(prevMonth)!).toFixed(2)) : null,
      responseRateLastMonth: prevResponseRate,
    },
    topWords,
    monthly,
    topReviews,
    generatedAt: now.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
  });
}
