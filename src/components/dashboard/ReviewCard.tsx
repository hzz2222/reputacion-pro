'use client';

import { useState } from 'react';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { FraudBadge } from '@/components/dashboard/FraudBadge';
import { analyzeReview } from '@/lib/fraudDetection';
import type { ReviewForAnalysis } from '@/lib/fraudDetection';

export interface Review {
  id: string;
  authorName: string;
  authorInitials: string;
  rating: number;
  text: string;
  publishedAt: string;
  isReplied: boolean;
  replyText: string | null;
  isNew: boolean;
  authorReviewCount?: number;
  authorAccountAgeDays?: number;
}

interface ReviewCardProps {
  review: Review;
  allReviews?: Review[];
  onReplySuccess?: (reviewId: string, replyText: string) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

const avatarColors = ['bg-brand-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500'];

export function ReviewCard({ review, allReviews, onReplySuccess }: ReviewCardProps) {
  const fraudAnalysis = allReviews
    ? analyzeReview(review as ReviewForAnalysis, allReviews as ReviewForAnalysis[])
    : null;
  const [modalOpen, setModalOpen] = useState(false);
  const [generatedReply, setGeneratedReply] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [aiError, setAiError] = useState('');
  const [expanded, setExpanded] = useState(false);

  const colorIndex = review.authorName.charCodeAt(0) % avatarColors.length;
  const avatarColor = avatarColors[colorIndex];

  const handleGenerateAI = async () => {
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

  const handleSubmitReply = async () => {
    if (!generatedReply.trim()) return;
    setSubmitting(true);
    try {
      await fetch(`/api/resenas/${review.id}/responder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replyText: generatedReply }),
      });
    } catch {
      // best-effort: persist in DB if possible, but always update UI
    } finally {
      setSubmitting(false);
    }
    onReplySuccess?.(review.id, generatedReply);
    setModalOpen(false);
  };

  const isLong = review.text.length > 150;
  const displayText = isLong && !expanded ? review.text.slice(0, 150) + '...' : review.text;

  return (
    <>
      <div className={`bg-white rounded-2xl border shadow-sm p-5 transition-all ${review.isNew ? 'border-brand-200 ring-1 ring-brand-100' : 'border-gray-100'}`}>
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className={`w-10 h-10 rounded-full ${avatarColor} text-white flex items-center justify-center text-sm font-bold flex-shrink-0`}>
            {review.authorInitials}
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div>
                <span className="font-semibold text-gray-900 text-sm">{review.authorName}</span>
                <span className="text-gray-400 text-xs ml-2">{formatDate(review.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">
                {fraudAnalysis?.isSuspicious && (
                  <FraudBadge analysis={fraudAnalysis} />
                )}
                {review.isNew && <Badge variant="new">Nueva</Badge>}
                {review.isReplied ? (
                  <Badge variant="success">Respondida</Badge>
                ) : review.rating <= 2 ? (
                  <Badge variant="danger">Urgente</Badge>
                ) : (
                  <Badge variant="warning">Sin responder</Badge>
                )}
              </div>
            </div>

            {/* Stars */}
            <div className="mb-2">
              <StarRating rating={review.rating} size="sm" />
            </div>

            {/* Review text */}
            <p className="text-gray-600 text-sm leading-relaxed">
              {displayText}
              {isLong && (
                <button onClick={() => setExpanded(!expanded)} className="ml-1 text-brand-600 font-medium hover:underline text-xs">
                  {expanded ? 'Ver menos' : 'Ver más'}
                </button>
              )}
            </p>

            {/* Reply preview */}
            {review.isReplied && review.replyText && (
              <div className="mt-3 pl-3 border-l-2 border-brand-200 bg-brand-50/50 rounded-r-lg p-2">
                <p className="text-xs text-brand-600 font-semibold mb-0.5">Tu respuesta:</p>
                <p className="text-xs text-gray-600 leading-relaxed">{review.replyText}</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {!review.isReplied && (
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end">
            <Button
              size="sm"
              onClick={() => { setModalOpen(true); if (!generatedReply) handleGenerateAI(); }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Responder
            </Button>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Responder a la reseña"
        size="lg"
      >
        <div className="space-y-5">
          {/* Review summary */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-7 h-7 rounded-full ${avatarColor} text-white flex items-center justify-center text-xs font-bold`}>
                {review.authorInitials}
              </div>
              <span className="font-semibold text-sm text-gray-800">{review.authorName}</span>
              <StarRating rating={review.rating} size="sm" />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">"{review.text}"</p>
          </div>

          {/* AI Reply */}
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
              <Button variant="ghost" size="sm" onClick={handleGenerateAI} loading={loadingAI}>
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
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">{aiError}</div>
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
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="flex-1"
              disabled={!generatedReply.trim() || loadingAI}
              loading={submitting}
              onClick={handleSubmitReply}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Publicar respuesta
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
