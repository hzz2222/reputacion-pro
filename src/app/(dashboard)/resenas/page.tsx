'use client';

import { useState, useEffect } from 'react';
import { ReviewCard, type Review } from '@/components/dashboard/ReviewCard';
import { StarRating } from '@/components/ui/StarRating';
import { MOCK_REVIEWS } from '@/lib/mockReviews';
import { analyzeReview } from '@/lib/fraudDetection';
import type { ReviewForAnalysis } from '@/lib/fraudDetection';

type Filter = 'all' | 'pending' | 'replied' | 'suspicious' | '5' | '4' | '3' | '2' | '1';

export default function ResenasPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/resenas');
        if (res.ok) {
          const data = await res.json();
          setReviews(data.length > 0 ? data : MOCK_REVIEWS as Review[]);
        } else {
          setReviews(MOCK_REVIEWS as Review[]);
        }
      } catch {
        setReviews(MOCK_REVIEWS as Review[]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleReplySuccess = (reviewId: string, replyText: string) => {
    setReviews((prev) =>
      prev.map((r) => r.id === reviewId ? { ...r, isReplied: true, replyText, isNew: false } : r)
    );
  };

  const reviewsForAnalysis = reviews as ReviewForAnalysis[];
  const fraudMap = new Map(
    reviews.map((r) => [r.id, analyzeReview(r as ReviewForAnalysis, reviewsForAnalysis)]),
  );
  const suspiciousCount = Array.from(fraudMap.values()).filter((a) => a.isSuspicious).length;

  const filtered = reviews.filter((r) => {
    if (filter === 'pending') return !r.isReplied;
    if (filter === 'replied') return r.isReplied;
    if (filter === 'suspicious') return fraudMap.get(r.id)?.isSuspicious ?? false;
    if (['1', '2', '3', '4', '5'].includes(filter)) return r.rating === Number(filter);
    return true;
  });

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length)
    : 0;
  const pendingCount = reviews.filter((r) => !r.isReplied).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex items-center gap-2 text-gray-400">
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Cargando reseñas...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reseñas de Google</h1>
        <p className="text-gray-500 mt-1">Gestiona y responde todas tus reseñas desde aquí</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">Total</div>
          <div className="text-2xl font-extrabold text-gray-900">{reviews.length}</div>
          <div className="text-xs text-gray-400">reseñas</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">Media</div>
          <div className="text-2xl font-extrabold text-gray-900 flex items-center justify-center gap-1">
            {avgRating.toFixed(1)} <StarRating rating={Math.round(avgRating)} size="sm" />
          </div>
          <div className="text-xs text-gray-400">puntuación</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">Pendientes</div>
          <div className="text-2xl font-extrabold text-gray-900">{pendingCount}</div>
          <div className="text-xs text-gray-400">sin responder</div>
        </div>
        <button
          onClick={() => setFilter('suspicious')}
          className={`rounded-xl border p-4 text-center transition-all ${
            suspiciousCount > 0
              ? 'bg-orange-50 border-orange-200 hover:bg-orange-100 cursor-pointer'
              : 'bg-white border-gray-100'
          } ${filter === 'suspicious' ? 'ring-2 ring-orange-400' : ''}`}
        >
          <div className="text-xs text-gray-500 mb-1 flex items-center justify-center gap-1">
            {suspiciousCount > 0 && (
              <svg className="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            Sospechosas
          </div>
          <div className={`text-2xl font-extrabold ${suspiciousCount > 0 ? 'text-orange-600' : 'text-gray-900'}`}>
            {suspiciousCount}
          </div>
          <div className="text-xs text-gray-400">detectadas</div>
        </button>
      </div>

      {/* Suspicious alert banner */}
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
                  ? '1 reseña con patrones sospechosos detectada'
                  : `${suspiciousCount} reseñas con patrones sospechosos detectadas`}
              </p>
              <p className="text-orange-600 text-xs mt-0.5">
                Podrían ser falsas. Revísalas y repórtalas a Google si lo confirmas.
              </p>
            </div>
          </div>
          <button
            onClick={() => setFilter('suspicious')}
            className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Ver ahora
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {([
          ['all', 'Todas'],
          ['pending', `Sin responder (${pendingCount})`],
          ['replied', 'Respondidas'],
          ['5', '⭐⭐⭐⭐⭐'],
          ['4', '⭐⭐⭐⭐'],
          ['3', '⭐⭐⭐'],
          ['2', '⭐⭐'],
          ['1', '⭐'],
        ] as [Filter, string][]).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === val
                ? 'bg-brand-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
        {suspiciousCount > 0 && (
          <button
            onClick={() => setFilter('suspicious')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'suspicious'
                ? 'bg-orange-500 text-white'
                : 'bg-orange-50 border border-orange-200 text-orange-600 hover:bg-orange-100'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Sospechosas ({suspiciousCount})
          </button>
        )}
      </div>

      {/* Reviews list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-4xl mb-3">⭐</div>
          <p className="font-semibold text-gray-700 mb-1">No hay reseñas en este filtro</p>
          <p className="text-gray-400 text-sm">Cambia el filtro o envía solicitudes para conseguir más reseñas</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              allReviews={reviews}
              onReplySuccess={handleReplySuccess}
            />
          ))}
        </div>
      )}
    </div>
  );
}
