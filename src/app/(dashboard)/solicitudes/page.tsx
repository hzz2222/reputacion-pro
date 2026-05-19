'use client';

import { useState, useEffect } from 'react';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';

interface ReviewRequest {
  id: string;
  clientName: string;
  clientEmail: string | null;
  clientPhone: string | null;
  channel: string;
  status: string;
  sentAt: string;
}

const statusMap: Record<string, { label: string; variant: 'success' | 'info' | 'neutral' | 'danger' }> = {
  sent:      { label: 'Enviado',   variant: 'info' },
  opened:    { label: 'Abierto',   variant: 'success' },
  completed: { label: 'Reseñado',  variant: 'success' },
  failed:    { label: 'Error',     variant: 'danger' },
};

export default function SolicitudesPage() {
  const [requests, setRequests]     = useState<ReviewRequest[]>([]);
  const [loading, setLoading]       = useState(true);
  const [modalOpen, setModalOpen]   = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('');
  const [whatsappModal, setWhatsappModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState('');
  const [error, setError]           = useState('');

  const [form, setForm] = useState({
    clientName: '', clientEmail: '', clientPhone: '',
    channel: 'email' as 'email' | 'whatsapp',
    customMessage: '',
  });

  useEffect(() => {
    fetch('/api/solicitudes')
      .then((r) => r.json())
      .then(setRequests)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const converted = requests.filter((r) => r.status === 'completed').length;
  const opened    = requests.filter((r) => r.status === 'opened').length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res  = await fetch('/api/solicitudes', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al enviar la solicitud');
      } else {
        if (form.channel === 'whatsapp' && data.whatsappLink) {
          setWhatsappLink(data.whatsappLink);
          setWhatsappModal(true);
        } else {
          setSuccess(`Solicitud enviada a ${form.clientName} por email.`);
          setTimeout(() => setSuccess(''), 5000);
        }
        setRequests((prev) => [data.request, ...prev]);
        setModalOpen(false);
        setForm({ clientName: '', clientEmail: '', clientPhone: '', channel: 'email', customMessage: '' });
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Identity banner ─ amber/yellow ─── */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 p-6 shadow-lg shadow-amber-200/60">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Solicitudes de reseña</h1>
              <p className="text-amber-100 text-sm mt-0.5 leading-relaxed">
                Envía una petición directa para que el cliente deje una reseña en Google.<br className="hidden sm:block" />
                Sin filtros, sin pasos intermedios — directo al objetivo.
              </p>
            </div>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-white hover:bg-amber-50 text-amber-700 font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors flex-shrink-0 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva solicitud
          </button>
        </div>
        <div className="mt-4 pt-4 border-t border-white/20">
          <span className="inline-flex items-center gap-1.5 text-xs bg-white/20 text-white px-3 py-1 rounded-full font-medium">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Úsala cuando estás seguro de que el cliente quedó satisfecho
          </span>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 text-sm">
          <svg className="w-4 h-4 flex-shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="flex-1">{success}</span>
          <button onClick={() => setSuccess('')} className="text-amber-400 hover:text-amber-600">×</button>
        </div>
      )}

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Enviadas',          value: requests.length, accent: 'text-gray-900' },
          { label: 'Abiertas',          value: opened,          accent: 'text-amber-600' },
          { label: 'Reseñas obtenidas', value: converted,       accent: 'text-amber-600' },
        ].map(({ label, value, accent }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
            <div className={`text-2xl font-extrabold ${accent}`}>{value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* ── Guide — amber ── */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          3 claves para conseguir más reseñas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon: '⚡', title: 'Envíala en 24 h', body: 'La satisfacción se enfría rápido. Actúa mientras la experiencia está fresca.' },
            { icon: '💬', title: 'WhatsApp convierte 3×', body: 'Mayor tasa de apertura que el email. El cliente llega al enlace en segundos.' },
            { icon: '✅', title: 'Solo clientes felices', body: 'Úsala cuando sabes que quedaron contentos. Para el resto, usa las Encuestas.' },
          ].map(({ icon, title, body }) => (
            <div key={title} className="flex items-start gap-3 bg-white rounded-xl p-3.5 border border-amber-100">
              <span className="text-xl flex-shrink-0">{icon}</span>
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-0.5">{title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── List ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Historial de solicitudes</h2>
          {converted > 0 && (
            <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full font-medium">
              ⭐ {converted} {converted === 1 ? 'reseña obtenida' : 'reseñas obtenidas'}
            </span>
          )}
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Cargando...</div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3 text-2xl">⭐</div>
            <p className="font-semibold text-gray-700 mb-1">Aún no has enviado solicitudes</p>
            <p className="text-sm text-gray-400 mb-4">Empieza enviando una solicitud a tu primer cliente satisfecho</p>
            <Button onClick={() => setModalOpen(true)} size="sm" className="bg-amber-500 hover:bg-amber-600 text-white border-0">
              Enviar primera solicitud
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {requests.map((req) => {
              const s = statusMap[req.status] ?? statusMap.sent;
              return (
                <div key={req.id} className={`flex items-center gap-4 px-6 py-4 transition-colors ${req.status === 'completed' ? 'bg-amber-50/40' : ''}`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${req.channel === 'whatsapp' ? 'bg-green-100' : 'bg-amber-100'}`}>
                    {req.channel === 'whatsapp' ? '💬' : '✉️'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900">{req.clientName}</p>
                    <p className="text-xs text-gray-400">{req.clientEmail || req.clientPhone}</p>
                  </div>
                  {req.status === 'completed' && <span className="text-amber-400 text-base flex-shrink-0">⭐</span>}
                  <Badge variant={s.variant}>{s.label}</Badge>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {new Date(req.sentAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Send modal ── */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nueva solicitud de reseña" size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Purpose chip */}
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
            <span className="text-base">⭐</span>
            <p className="text-xs text-amber-800 font-medium">El cliente recibirá un enlace directo para dejar su reseña en Google.</p>
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
                      ? 'border-amber-400 bg-amber-50 text-amber-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {ch === 'email' ? '✉️ Email' : '💬 WhatsApp'}
                </button>
              ))}
            </div>
          </div>

          {form.channel === 'email' && (
            <Input label="Email del cliente" type="email" placeholder="cliente@email.com"
              value={form.clientEmail} onChange={(e) => setForm({ ...form, clientEmail: e.target.value })} required />
          )}
          {form.channel === 'whatsapp' && (
            <Input label="Número de WhatsApp (con prefijo país)" placeholder="+34 612 345 678"
              value={form.clientPhone} onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
              required hint="Incluye el prefijo del país, ej: +34 para España" />
          )}

          <Textarea label="Mensaje personalizado (opcional)" rows={3}
            placeholder="Deja en blanco para usar el mensaje predeterminado..."
            value={form.customMessage} onChange={(e) => setForm({ ...form, customMessage: e.target.value })} />

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
              <span className="flex-1">{error}</span>
              <button type="button" onClick={() => setError('')} className="text-red-400 hover:text-red-600">×</button>
            </div>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-white border-0" loading={submitting}>
              {form.channel === 'email' ? 'Enviar solicitud' : 'Generar enlace WhatsApp'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── WhatsApp modal ── */}
      <Modal isOpen={whatsappModal} onClose={() => setWhatsappModal(false)} title="Enlace de WhatsApp generado" size="sm">
        <div className="space-y-4 text-center">
          <div className="text-5xl">💬</div>
          <p className="text-gray-600 text-sm">El enlace lleva al cliente directamente a dejar su reseña en Google. Ábrelo en WhatsApp y envíaselo.</p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors">
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
