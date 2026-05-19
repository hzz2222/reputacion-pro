'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import { FraudBadge } from '@/components/dashboard/FraudBadge';
import type { FraudAnalysis } from '@/lib/fraudDetection';

export interface DemoReview {
  id: string;
  authorName: string;
  authorInitials: string;
  rating: number;
  text: string;
  publishedAt: string;
  isReplied: boolean;
  replyText: string | null;
  isNew?: boolean;
  fraudAnalysis?: FraudAnalysis;
}

interface Props {
  review: DemoReview;
  aiResponse: string;
}

const AVATAR_COLORS = [
  'bg-brand-500', 'bg-violet-500', 'bg-emerald-500',
  'bg-amber-500', 'bg-rose-500', 'bg-cyan-500',
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function DemoReviewCard({ review, aiResponse }: Props) {
  const [isReplied, setIsReplied] = useState(review.isReplied);
  const [localReplyText, setLocalReplyText] = useState(review.replyText);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [animDone, setAnimDone] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [published, setPublished] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const avatarColor = AVATAR_COLORS[review.authorName.charCodeAt(0) % AVATAR_COLORS.length];
  const isLong = review.text.length > 150;
  const displayText = isLong && !expanded ? review.text.slice(0, 150) + '…' : review.text;

  function handleOpen() {
    setModalOpen(true);
    setLoadingAI(true);
    setTypedText('');
    setAnimDone(false);
    setEditedText('');
    setPublished(false);
  }

  function handlePublish() {
    setIsReplied(true);
    setLocalReplyText(editedText);
    setPublished(true);
  }

  // Simulate AI loading
  useEffect(() => {
    if (!loadingAI) return;
    const t = setTimeout(() => setLoadingAI(false), 1700);
    return () => clearTimeout(t);
  }, [loadingAI]);

  // Word-by-word typewriter after loading
  useEffect(() => {
    if (loadingAI || !modalOpen || animDone || !aiResponse) return;
    const words = aiResponse.split(' ');
    let i = 0;
    const iv = setInterval(() => {
      i++;
      const current = words.slice(0, i).join(' ');
      setTypedText(current);
      if (i >= words.length) {
        clearInterval(iv);
        setAnimDone(true);
        setEditedText(current);
      }
    }, 42);
    return () => clearInterval(iv);
  }, [loadingAI, modalOpen, aiResponse, animDone]);

  return (
    <>
      <div
        className={`bg-white rounded-2xl border shadow-sm p-5 transition-all ${
          review.isNew ? 'border-brand-200 ring-1 ring-brand-100' : 'border-gray-100'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-full ${avatarColor} text-white flex items-center justify-center text-sm font-bold flex-shrink-0`}>
            {review.authorInitials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div>
                <span className="font-semibold text-gray-900 text-sm">{review.authorName}</span>
                <span className="text-gray-400 text-xs ml-2">{formatDate(review.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">
                {review.fraudAnalysis?.isSuspicious && <FraudBadge analysis={review.fraudAnalysis} />}
                {review.isNew && <Badge variant="new">Nueva</Badge>}
                {isReplied ? (
                  <Badge variant="success">Respondida</Badge>
                ) : review.rating <= 2 ? (
                  <Badge variant="danger">Urgente</Badge>
                ) : (
                  <Badge variant="warning">Sin responder</Badge>
                )}
              </div>
            </div>

            <div className="mb-2">
              <StarRating rating={review.rating} size="sm" />
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              {displayText}
              {isLong && (
                <button onClick={() => setExpanded(!expanded)} className="ml-1 text-brand-600 font-medium hover:underline text-xs">
                  {expanded ? 'Ver menos' : 'Ver más'}
                </button>
              )}
            </p>

            {isReplied && localReplyText && (
              <div className="mt-3 pl-3 border-l-2 border-brand-200 bg-brand-50/50 rounded-r-lg p-2">
                <p className="text-xs text-brand-600 font-semibold mb-0.5">Tu respuesta:</p>
                <p className="text-xs text-gray-600 leading-relaxed">{localReplyText}</p>
              </div>
            )}
          </div>
        </div>

        {!isReplied && (
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end">
            <Button size="sm" onClick={handleOpen}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Responder
            </Button>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Responder a la reseña" size="lg">
        <div className="space-y-5">
          {/* Review recap */}
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

          {/* AI response area */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="block text-sm font-medium text-gray-700">Tu respuesta</label>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-xs font-medium">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Redactada por IA
              </span>
            </div>

            {loadingAI ? (
              <div className="rounded-xl border border-brand-100 bg-brand-50/30 p-4 min-h-[120px] flex flex-col items-center justify-center gap-2 text-brand-500 text-sm">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>La IA está redactando tu respuesta...</span>
              </div>
            ) : !animDone ? (
              <div className="rounded-xl border border-brand-200 bg-brand-50/20 p-4 min-h-[120px]">
                <p className="text-sm text-gray-800 leading-relaxed">
                  {typedText}
                  <span className="inline-block w-0.5 h-4 bg-brand-500 ml-0.5 animate-pulse align-middle" />
                </p>
              </div>
            ) : (
              <div>
                <textarea
                  rows={5}
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-400 mt-1.5">Revisa y edita el texto si lo necesitas. Cuando estés listo, pulsa Publicar.</p>
              </div>
            )}
          </div>

          {/* Actions */}
          {published ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col items-center gap-3 text-center">
              <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-emerald-800 mb-1">¡Así de fácil sería publicarla!</p>
                <p className="text-emerald-600 text-sm">Con tu cuenta, la respuesta se publicaría directamente en Google My Business.</p>
              </div>
              <Link
                href="/registro"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors shadow-md shadow-emerald-200"
              >
                Crear mi cuenta gratis →
              </Link>
            </div>
          ) : (
            <div className="flex gap-3 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                className="flex-1"
                disabled={!animDone || !editedText.trim()}
                onClick={handlePublish}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Publicar respuesta
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
