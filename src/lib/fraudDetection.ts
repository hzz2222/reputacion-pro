export interface ReviewForAnalysis {
  id: string;
  rating: number;
  text: string;
  publishedAt: string | Date;
  authorReviewCount?: number;
  authorAccountAgeDays?: number;
}

export type SuspicionLevel = 'medium' | 'high';

export interface SuspicionSignal {
  key: string;
  label: string;
}

export interface FraudAnalysis {
  isSuspicious: boolean;
  level: SuspicionLevel;
  score: number;
  signals: SuspicionSignal[];
}

const GENERIC_PATTERNS = [
  /^(muy |super )?(bien|malo|bueno|mala|regular|ok|okay|fatal)\.?!?$/i,
  /^no recomend/i,
  /^(horrible|terrible|pésimo|genial|increíble|fantástico)\.?!?$/i,
  /^no (volver|volvería|volvere (nunca|jamás))\.?$/i,
  /^(mal|bien|ok)\.?$/i,
];

export function analyzeReview(
  review: ReviewForAnalysis,
  allReviews: ReviewForAnalysis[],
): FraudAnalysis {
  const signals: SuspicionSignal[] = [];
  let score = 0;

  const text = review.text.trim();
  const textLen = text.length;
  const lowerText = text.toLowerCase();

  // 1. Very short text
  if (textLen < 15) {
    signals.push({ key: 'very_short', label: 'Texto extremadamente corto' });
    score += 25;
  } else if (textLen < 40) {
    signals.push({ key: 'short', label: 'Texto muy corto y sin detalles' });
    score += 15;
  }

  // 2. Generic text
  if (GENERIC_PATTERNS.some((p) => p.test(lowerText))) {
    signals.push({ key: 'generic', label: 'Texto genérico sin información concreta' });
    score += 25;
  }

  // 3. New Google account
  if (review.authorAccountAgeDays !== undefined && review.authorAccountAgeDays < 30) {
    signals.push({ key: 'new_account', label: `Cuenta de Google de solo ${review.authorAccountAgeDays} días` });
    score += 25;
  }

  // 4. Author has only one review ever
  if (review.authorReviewCount !== undefined && review.authorReviewCount <= 1) {
    signals.push({ key: 'single_review', label: 'El autor solo tiene 1 reseña en Google' });
    score += 20;
  }

  // 5. Negative cluster: multiple low-rating reviews on same calendar day
  if (review.rating <= 2) {
    const dayStr = new Date(review.publishedAt).toDateString();
    const sameDayNegatives = allReviews.filter(
      (r) =>
        r.id !== review.id &&
        r.rating <= 2 &&
        new Date(r.publishedAt).toDateString() === dayStr,
    );
    if (sameDayNegatives.length >= 1) {
      signals.push({
        key: 'cluster',
        label: `Avalancha de negativas: ${sameDayNegatives.length + 1} reseñas de 1-2★ el mismo día`,
      });
      score += 30;
    }
  }

  // 6. Excessive punctuation
  const excMarks = (text.match(/!/g) ?? []).length;
  const qMarks = (text.match(/\?/g) ?? []).length;
  if (excMarks + qMarks >= 4) {
    signals.push({ key: 'punctuation', label: 'Puntuación excesiva (!!!, ???)' });
    score += 10;
  }

  const isSuspicious = score >= 35;
  const level: SuspicionLevel = score >= 60 ? 'high' : 'medium';

  return { isSuspicious, level, score, signals };
}
