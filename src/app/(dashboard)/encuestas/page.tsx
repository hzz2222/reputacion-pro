'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

interface Survey {
  id: string;
  clientName: string;
  clientEmail: string | null;
  clientPhone: string | null;
  channel: string;
  status: string;
  feedbackText: string | null;
  respondedAt: string | null;
  sentAt: string;
}

const statusConfig: Record<string, { label: string; variant: 'success' | 'danger' | 'neutral'; icon: string }> = {
  pending:  { label: 'Pendiente',  variant: 'neutral',  icon: '⏳' },
  positive: { label: 'Positiva',   variant: 'success',  icon: '😊' },
  negative: { label: 'Negativa',   variant: 'danger',   icon: '😕' },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

export default function EncuestasPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [whatsappModal, setWhatsappModal] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null);

  const [form, setForm] = useState({
    clientName:  '',
    clientEmail: '',
    clientPhone: '',
    channel:     'email' as 'email' | 'whatsapp',
  });

  useEffect(() => {
    fetch('/api/encuestas')
      .then((r) => r.json())
      .then(setSurveys)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total    = surveys.length;
  const positive = surveys.filter((s) => s.status === 'positive').length;
  const negative = surveys.filter((s) => s.status === 'negative').length;
  const pending  = surveys.filter((s) => s.status === 'pending').length;
  const satRate  = total - pending > 0 ? Math.round((positive / (positive + negative)) * 100) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/encuestas', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Error al enviar'); return; }

      setSurveys((prev) => [data.survey, ...prev]);
      setModalOpen(false);
      setForm({ clientName: '', clientEmail: '', clientPhone: '', channel: 'email' });

      if (form.channel === 'whatsapp' && data.whatsappLink) {
        setWhatsappLink(data.whatsappLink);
        setWhatsappModal(true);
      } else {
        setSuccess(`Encuesta enviada a ${form.clientName}.`);
        setTimeout(() => setSuccess(''), 5000);
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Identity banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-violet-700 to-purple-800 p-6 text-white shadow-lg shadow-violet-900/30">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-12 -left-6 w-52 h-52 rounded-full bg-white/5" />
          <div className="absolute top-1/2 right-1/3 w-24 h-24 rounded-full bg-white/3" />
        </div>

        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            {/* Shield icon */}
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0 shadow-inner">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                <h1 className="text-xl font-bold">Encuestas de satisfacción</h1>
                <span className="bg-white/15 border border-white/20 rounded-full px-3 py-0.5 text-xs font-medium text-violet-100">
                  Úsala cuando no estás seguro de cómo quedó el cliente, o tras servicios delicados
                </span>
              </div>
              <p className="text-violet-200 text-sm leading-relaxed max-w-xl">
                Filtra el feedback <strong className="text-white">antes</strong> de que llegue a Google — las experiencias positivas se convierten en reseñas, las negativas las capturas aquí.
              </p>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-white text-violet-700 font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-violet-50 transition-colors shadow-sm flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva encuesta
          </button>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-700 rounded-xl p-4 text-sm">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="flex-1">{success}</span>
          <button onClick={() => setSuccess('')} className="text-violet-400 hover:text-violet-600">×</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Enviadas',     value: total,    sub: 'Total', dotColor: 'bg-violet-400' },
          { label: 'Positivas',    value: positive, sub: '→ Google', dotColor: 'bg-emerald-400' },
          { label: 'Negativas',    value: negative, sub: '→ Panel',  dotColor: 'bg-red-400' },
          { label: 'Satisfacción', value: satRate !== null ? `${satRate}%` : '—', sub: 'de respuestas', dotColor: satRate !== null && satRate >= 80 ? 'bg-emerald-400' : satRate !== null && satRate >= 60 ? 'bg-amber-400' : 'bg-red-400' },
        ].map(({ label, value, sub, dotColor }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${dotColor}`} />
              <span className="text-xs text-gray-400 font-medium">{label}</span>
            </div>
            <div className="text-2xl font-extrabold text-gray-900">{value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {/* Visual funnel diagram */}
      <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 rounded-2xl p-5">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Cómo filtra el feedback
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0">
          {/* Sent */}
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <div className="w-12 h-12 rounded-2xl bg-violet-100 border-2 border-violet-200 flex items-center justify-center text-xl">📩</div>
            <p className="text-xs font-semibold text-violet-700 text-center">Encuesta enviada</p>
            <p className="text-xs text-gray-400 text-center">al cliente</p>
          </div>

          {/* Arrow */}
          <div className="text-violet-300 text-xl hidden sm:block">→</div>
          <div className="text-violet-300 text-xl sm:hidden">↓</div>

          {/* Split */}
          <div className="flex flex-col sm:flex-row gap-3 flex-[2]">
            {/* Positive path */}
            <div className="flex-1 bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3 flex flex-col items-center gap-1.5">
              <span className="text-2xl">😊</span>
              <p className="text-xs font-bold text-emerald-700 text-center">¡Fue genial!</p>
              <div className="w-full border-t border-emerald-200 my-0.5" />
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded bg-emerald-600 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-emerald-700">→ Reseña en Google</p>
              </div>
            </div>

            {/* Negative path */}
            <div className="flex-1 bg-violet-50 border-2 border-violet-200 rounded-2xl p-3 flex flex-col items-center gap-1.5">
              <span className="text-2xl">😕</span>
              <p className="text-xs font-bold text-violet-700 text-center">Puede mejorar</p>
              <div className="w-full border-t border-violet-200 my-0.5" />
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded bg-violet-600 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-violet-700">→ Queda aquí</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Survey list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Historial de encuestas</h2>
          {negative > 0 && (
            <span className="text-xs text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full font-medium">
              {negative} {negative === 1 ? 'feedback negativo' : 'feedbacks negativos'} recibido{negative > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Cargando…</div>
        ) : surveys.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <p className="font-semibold text-gray-700 mb-1">Aún no has enviado encuestas</p>
            <p className="text-sm text-gray-400 mb-4">Envía tu primera encuesta de satisfacción después del próximo servicio</p>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Enviar primera encuesta
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {surveys.map((s) => {
              const cfg = statusConfig[s.status] ?? statusConfig.pending;
              const isExpanded = expandedFeedback === s.id;
              return (
                <div key={s.id} className={`px-6 py-4 space-y-2 ${s.status === 'negative' ? 'bg-red-50/40' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${s.channel === 'whatsapp' ? 'bg-green-100' : 'bg-violet-100'}`}>
                      {s.channel === 'whatsapp' ? '💬' : '✉️'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900">{s.clientName}</p>
                      <p className="text-xs text-gray-400">{s.clientEmail || s.clientPhone}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-base">{cfg.icon}</span>
                      <Badge variant={cfg.variant}>{cfg.label}</Badge>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0 hidden sm:block">{formatDate(s.sentAt)}</span>
                  </div>

                  {/* Negative feedback */}
                  {s.status === 'negative' && (
                    <div className="ml-[52px] bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-semibold text-red-700 uppercase tracking-wide">Feedback interno</p>
                        {s.feedbackText && s.feedbackText.length > 120 && (
                          <button onClick={() => setExpandedFeedback(isExpanded ? null : s.id)} className="text-xs text-red-500 hover:text-red-700">
                            {isExpanded ? 'Ver menos' : 'Ver más'}
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {s.feedbackText
                          ? (isExpanded || s.feedbackText.length <= 120 ? s.feedbackText : s.feedbackText.slice(0, 120) + '…')
                          : <span className="text-gray-400 italic">El cliente no dejó comentario</span>}
                      </p>
                      {s.respondedAt && (
                        <p className="text-xs text-gray-400 mt-1.5">Respondido el {formatDate(s.respondedAt)}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Send survey modal */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setError(''); }} title="Nueva encuesta de satisfacción" size="md">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Violet chip */}
          <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-xl px-3 py-2">
            <svg className="w-4 h-4 text-violet-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p className="text-xs text-violet-700">Cuando el cliente responda, las experiencias <strong>positivas</strong> irán a Google y las <strong>negativas</strong> quedarán aquí en tu panel.</p>
          </div>

          <Input
            label="Nombre del cliente"
            placeholder="María García"
            value={form.clientName}
            onChange={(e) => setForm({ ...form, clientName: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Canal de envío</label>
            <div className="grid grid-cols-2 gap-3">
              {(['email', 'whatsapp'] as const).map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => setForm({ ...form, channel: ch })}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                    form.channel === ch
                      ? 'border-violet-400 bg-violet-50 text-violet-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {ch === 'email' ? '✉️ Email' : '💬 WhatsApp'}
                </button>
              ))}
            </div>
          </div>

          {form.channel === 'email' && (
            <Input
              label="Email del cliente"
              type="email"
              placeholder="cliente@email.com"
              value={form.clientEmail}
              onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
              required
            />
          )}

          {form.channel === 'whatsapp' && (
            <Input
              label="Número de WhatsApp (con prefijo país)"
              placeholder="+34 612 345 678"
              value={form.clientPhone}
              onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
              required
              hint="Incluye el prefijo del país, ej: +34 para España"
            />
          )}

          {/* Two-path preview */}
          <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-violet-600 uppercase tracking-wide">El cliente verá dos opciones</p>
            <div className="flex gap-3">
              <div className="flex-1 bg-emerald-100 border border-emerald-200 rounded-xl py-2.5 text-center text-xs font-bold text-emerald-700">😊 ¡Fue genial! → Google</div>
              <div className="flex-1 bg-violet-100 border border-violet-200 rounded-xl py-2.5 text-center text-xs font-bold text-violet-700">😕 Puede mejorar → aquí</div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
              <span className="flex-1">{error}</span>
              <button type="button" onClick={() => setError('')} className="text-red-400 hover:text-red-600">×</button>
            </div>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => { setModalOpen(false); setError(''); }}>Cancelar</Button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm"
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Enviando…
                </>
              ) : (
                form.channel === 'email' ? 'Enviar encuesta' : 'Generar enlace'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* WhatsApp modal */}
      <Modal isOpen={whatsappModal} onClose={() => setWhatsappModal(false)} title="Enlace de encuesta generado" size="sm">
        <div className="space-y-4 text-center">
          <div className="text-5xl">💬</div>
          <p className="text-gray-600 text-sm">El enlace incluye la encuesta personalizada. Ábrelo en WhatsApp y envíaselo al cliente.</p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Abrir en WhatsApp
          </a>
          <Button variant="outline" className="w-full" onClick={() => setWhatsappModal(false)}>Cerrar</Button>
        </div>
      </Modal>
    </div>
  );
}
