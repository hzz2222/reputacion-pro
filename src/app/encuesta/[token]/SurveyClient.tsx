'use client';

import { useState, useEffect } from 'react';

type Status = 'loading' | 'choice' | 'positive' | 'negative_form' | 'negative_done' | 'already_responded' | 'error';

interface SurveyData {
  clientName: string;
  businessName: string;
  googleReviewUrl: string | null;
  status: string;
}

export function SurveyClient({ token, initialResponse }: { token: string; initialResponse?: 'positive' | 'negative' }) {
  const [status, setStatus] = useState<Status>('loading');
  const [survey, setSurvey] = useState<SurveyData | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleUrl, setGoogleUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/encuesta/${token}`)
      .then((r) => r.json())
      .then((data: SurveyData) => {
        setSurvey(data);
        if (data.status !== 'pending') {
          setStatus('already_responded');
        } else if (initialResponse === 'positive') {
          submitResponse('positive');
        } else if (initialResponse === 'negative') {
          setStatus('negative_form');
        } else {
          setStatus('choice');
        }
      })
      .catch(() => setStatus('error'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function submitResponse(response: 'positive' | 'negative', text?: string) {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/encuesta/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response, feedbackText: text }),
      });
      const data = await res.json();
      if (response === 'positive') {
        setGoogleUrl(data.googleReviewUrl || null);
        setStatus('positive');
      } else {
        setStatus('negative_done');
      }
    } catch {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  }

  function handleNegativeSubmit() {
    submitResponse('negative', feedbackText);
  }

  const businessInitial = survey?.businessName?.charAt(0).toUpperCase() ?? '?';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 px-8 pt-8 pb-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
              {businessInitial}
            </div>
            <p className="text-indigo-200 text-sm font-medium mb-1">{survey?.businessName}</p>
            <h1 className="text-white text-xl font-bold leading-tight">
              {status === 'loading' ? 'Cargando…' : '¿Cómo fue tu experiencia?'}
            </h1>
          </div>

          {/* Body */}
          <div className="px-8 py-8">

            {/* Loading */}
            {status === 'loading' && (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 rounded-full border-4 border-indigo-400 border-t-transparent animate-spin" />
              </div>
            )}

            {/* Choice */}
            {status === 'choice' && (
              <div className="space-y-4">
                <p className="text-center text-gray-500 text-sm mb-6">
                  Hola{survey?.clientName ? `, ${survey.clientName}` : ''}. Tu opinión nos ayuda a mejorar. Solo tarda 10 segundos:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => submitResponse('positive')}
                    disabled={submitting}
                    className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-100 transition-all group disabled:opacity-60"
                  >
                    <span className="text-4xl group-hover:scale-110 transition-transform">😊</span>
                    <span className="font-bold text-emerald-700 text-sm">¡Fue genial!</span>
                  </button>
                  <button
                    onClick={() => setStatus('negative_form')}
                    disabled={submitting}
                    className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gray-50 border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-100 transition-all group disabled:opacity-60"
                  >
                    <span className="text-4xl group-hover:scale-110 transition-transform">😕</span>
                    <span className="font-bold text-gray-600 text-sm">Puede mejorar</span>
                  </button>
                </div>
              </div>
            )}

            {/* Positive — redirect to Google */}
            {status === 'positive' && (
              <div className="text-center space-y-5 py-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-3xl">😊</div>
                <div>
                  <p className="font-bold text-gray-900 text-lg mb-1">¡Nos alegra mucho, {survey?.clientName?.split(' ')[0] ?? 'gracias'}!</p>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    ¿Podrías contárselo al mundo dejando una reseña en Google?<br />
                    Tu opinión ayuda a otros clientes a encontrarnos.
                  </p>
                </div>
                {googleUrl ? (
                  <a
                    href={googleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-indigo-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    Dejar mi reseña en Google
                  </a>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                    <p className="text-emerald-700 text-sm font-medium">¡Gracias por tu valoración positiva! 🎉</p>
                    <p className="text-emerald-600 text-xs mt-1">El negocio no ha configurado aún el enlace de Google.</p>
                  </div>
                )}
              </div>
            )}

            {/* Negative — feedback form */}
            {status === 'negative_form' && (
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-4xl">😕</span>
                  <p className="font-bold text-gray-900 mt-3 mb-1">Lo sentimos, {survey?.clientName?.split(' ')[0] ?? ''}.</p>
                  <p className="text-gray-500 text-sm">¿Qué podríamos haber hecho mejor? Tu comentario llega directamente al equipo.</p>
                </div>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={4}
                  placeholder="Cuéntanos qué ocurrió…"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                />
                <button
                  onClick={handleNegativeSubmit}
                  disabled={submitting}
                  className="w-full bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  {submitting ? 'Enviando…' : 'Enviar comentario'}
                </button>
                <button
                  onClick={() => setStatus('choice')}
                  className="w-full text-gray-400 hover:text-gray-600 text-sm py-1 transition-colors"
                >
                  ← Volver
                </button>
              </div>
            )}

            {/* Negative done */}
            {status === 'negative_done' && (
              <div className="text-center space-y-4 py-2">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg mb-1">¡Gracias por tu honestidad!</p>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Hemos recibido tu comentario. El equipo de {survey?.businessName} lo revisará y trabajará para mejorar tu próxima visita.
                  </p>
                </div>
              </div>
            )}

            {/* Already responded */}
            {status === 'already_responded' && (
              <div className="text-center space-y-3 py-2">
                <div className="text-4xl">✅</div>
                <p className="font-bold text-gray-900">Ya respondiste esta encuesta</p>
                <p className="text-gray-400 text-sm">Tu opinión ya ha sido registrada. ¡Gracias!</p>
              </div>
            )}

            {/* Error */}
            {status === 'error' && (
              <div className="text-center space-y-3 py-2">
                <div className="text-4xl">⚠️</div>
                <p className="font-bold text-gray-900">Encuesta no encontrada</p>
                <p className="text-gray-400 text-sm">Este enlace no es válido o ha caducado.</p>
              </div>
            )}

          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">Powered by ReputaciónPro</p>
      </div>
    </div>
  );
}
