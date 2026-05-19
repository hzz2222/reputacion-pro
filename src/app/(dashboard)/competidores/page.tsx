import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { MOCK_REVIEWS } from '@/lib/mockReviews';
import { CompetitorAnalysis } from '@/components/dashboard/CompetitorAnalysis';

function buildMonthly(reviews: Array<{ publishedAt: Date }>): number[] {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const start = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const end   = new Date(now.getFullYear(), now.getMonth() - (5 - i) + 1, 1);
    return reviews.filter((r) => r.publishedAt >= start && r.publishedAt < end).length;
  });
}

export default async function CompetidoresPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const dbReviews = await prisma.review.findMany({
    where: { userId: session.user.id },
    select: { rating: true, publishedAt: true },
  });

  const isMock = dbReviews.length === 0;
  const reviews = isMock ? MOCK_REVIEWS : dbReviews;

  const avgRating = reviews.length > 0
    ? parseFloat((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1))
    : 4.3;

  const ownMonthly = isMock
    ? [3, 5, 4, 7, 6, 9]
    : buildMonthly(dbReviews as Array<{ publishedAt: Date }>);

  return (
    <CompetitorAnalysis
      businessName={session.user.businessName}
      userId={session.user.id}
      ownRating={avgRating}
      ownReviewCount={reviews.length}
      ownMonthly={ownMonthly}
      isMockData={isMock}
    />
  );
}
