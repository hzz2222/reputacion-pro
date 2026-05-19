'use client';

import { useState } from 'react';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { analyzeReview } from '@/lib/fraudDetection';
import type { ReviewForAnalysis } from '@/lib/fraudDetection';
import type { Review } from '@/components/dashboard/ReviewCard';

interface Props {
  allReviews: Review[];
}

function formatDate(val: string) {
  return new Date(val).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

const avatarColors = ['bg-brand-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500'];

export function DashboardRecentReviews({ allReviews }: Props) {
  const [reviews, setReviews] = useState(allReviews);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [generatedReply, setGeneratedReply] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [aiError, setAiError] = useState('');

  const recentReviews = reviews.slice(0, 5);
  const reviewsForAnalysis = reviews as unknown as ReviewForAnalysis[];

  const generateAI = async (review: Review) => {
    setLoadingAI(true);
    setAiError('');
    try {
      const res = await fetch('/api/ai/generar-respuesta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewId: review.id,
          authorName: review.authorName,
          rating: review.rating,
          text: review.text,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al generar respuesta');
      setGeneratedReply(data.reply);
    } catch (err: unknown) {
      setAiError(err instanceof Error ? err.message : 'Error al generar respuesta');
    } finally {
      setLoadingAI(false);
    }
  };

  const openModal = (review: Review) => {
    setSelectedReview(review);
    setGeneratedReply('');
    setAiError('');
    generateAI(review);
  };

  const handleSubmit = async () => {
    if (!selectedReview || !generatedReply.trim()) return;
    setSubmitting(true);
    try {
      await fetch(`/api/resenas/${selectedReview.id}/responder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replyText: generatedReply }),
      });
    } catch {
      // best-effort
    } finally {
      setSubmitting(false);
    }
    setReviews((prev) =>
      prev.map((r) =>
        r.id === selectedReview.id
          ? { ...r, isReplied: true, replyText: generatedReply, isNew: false }
          : r,
      ),
    );
    setSelectedReview(null);
  };

  const avatarColor = selectedReview
    ? avatarColors[selectedReview.authorName.charCodeAt(0) % avatarColors.length]
    : '';

  return (
    <>
      <div className="divide-y divide-gray-50">
        {recentReviews.map((review) => {
          const colorIndex = review.authorName.charCodeAt(0) % avatarColors.length;
          const fa = analyzeReview(review as unknown as ReviewForAnalysis, reviewsForAnalysis);
          return (
            <div
              key={review.id}
              className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors"
            >
              <div
                className={`w-9 h-9 rounded-full ${avatarColors[colorIndex]} text-white flex items-center justify-center text-sm font-bold flex-shrink-0`}
              >
                {review.authorInitials}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold text-sm text-gray-900">{review.authorName}</span>
                  <StarRating rating={review.rating} size="sm" />
                  <span className="text-xs text-gray-400">{formatDate(review.publishedAt)}</span>
                  {review.isNew && <Badge variant="new">Nueva</Badge>}
                  {fa.isSuspicious && (
                    <span
                      title={`Sospechosa: ${fa.signals.map((s) => s.label).join(', ')}`}
                      className="inline-flex items-center gap-0.5 text-orange-500 bg-orange-50 border border-orange-200 rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Sospechosa
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate max-w-md">{review.text}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {review.isReplied ? (
                  <Badge variant="success">Respondida</Badge>
                ) : review.rating <= 2 ? (
                  <button
                    onClick={() => openModal(review)}
                    className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors"
                  >
                    Urgente →
                  </button>
                ) : (
                  <button
                    onClick={() => openModal(review)}
                    className="text-xs bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
                  >
                    Responder →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        title="Responder a la reseña"
        size="lg"
      >
        {selectedReview && (
          <div className="space-y-5">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-7 h-7 rounded-full ${avatarColor} text-white flex items-center justify-center text-xs font-bold`}
                >
                  {selectedReview.authorInitials}
                </div>
                <span className="font-semibold text-sm text-gray-800">{selectedReview.authorName}</span>
                <StarRating rating={selectedReview.rating} size="sm" />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">"{selectedReview.text}"</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <label className="block text-sm font-medium text-gray-700">Tu respuesta</label>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-xs font-medium">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Redactada por IA
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => generateAI(selectedReview)}
                  loading={loadingAI}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Nueva versión
                </Button>
              </div>

              {loadingAI ? (
                <div className="rounded-xl border border-brand-100 bg-brand-50/30 p-4 min-h-[120px] flex items-center justify-center gap-2 text-brand-500 text-sm">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  La IA está redactando tu respuesta...
                </div>
              ) : aiError ? (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
                  {aiError}
                </div>
              ) : (
                <Textarea
                  rows={5}
                  value={generatedReply}
                  onChange={(e) => setGeneratedReply(e.target.value)}
                  placeholder="La IA generará una respuesta personalizada..."
                  hint="Revisa y edita el texto si lo necesitas. Cuando estés listo, pulsa Publicar."
                />
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedReview(null)}>
                Cancelar
              </Button>
              <Button
                className="flex-1"
                disabled={!generatedReply.trim() || loadingAI}
                loading={submitting}
                onClick={handleSubmit}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Publicar respuesta
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
