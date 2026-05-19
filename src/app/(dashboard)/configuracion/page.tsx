'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const toneOptions = [
  { value: 'profesional y formal', label: 'Formal y Profesional', desc: 'Ideal para clínicas, despachos, consultorías' },
  { value: 'profesional y amigable', label: 'Profesional y Amigable', desc: 'El equilibrio perfecto para la mayoría de negocios' },
  { value: 'cercano y entusiasta', label: 'Cercano y Entusiasta', desc: 'Ideal para restaurantes, tiendas, comercio local' },
];

export default function ConfiguracionPage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [stripeLoading, setStripeLoading] = useState(false);

  const [form, setForm] = useState({
    businessName: '',
    businessType: '',
    googleReviewUrl: '',
    notificationEmail: '',
    aiTone: 'profesional y amigable',
    whatsappNumber: '',
    whatsappEnabled: false,
  });
  const [testWa, setTestWa] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [testWaError, setTestWaError] = useState('');
  const [testWaIsMissingConfig, setTestWaIsMissingConfig] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetch('/api/usuario')
        .then((r) => r.json())
        .then((data) => {
          setForm({
            businessName: data.businessName || '',
            businessType: data.businessType || '',
            googleReviewUrl: data.googleReviewUrl || '',
            notificationEmail: data.notificationEmail || data.email || '',
            aiTone: data.aiTone || 'profesional y amigable',
            whatsappNumber: data.whatsappNumber || '',
            whatsappEnabled: data.whatsappEnabled ?? false,
          });
        })
        .catch(() => {
          setForm((f) => ({ ...f, businessName: session.user.businessName || '' }));
        });
    }
  }, [session]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/usuario', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          whatsappNumber: form.whatsappNumber.trim() || null,
        }),
      });
      if (res.ok) {
        setSuccess('Configuración guardada correctamente');
        setTimeout(() => setSuccess(''), 5000);
        await update({ businessName: form.businessName });
      } else {
        const d = await res.json();
        setError(d.error || 'Error al guardar');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleTestWhatsApp = async () => {
    setTestWa('loading');
    setTestWaError('');
    setTestWaIsMissingConfig(false);
    try {
      const res = await fetch('/api/notificaciones/test-whatsapp', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setTestWa('ok');
        setTimeout(() => setTestWa('idle'), 4000);
      } else {
        setTestWa('error');
        const isMissingConfig = data.code === 'TWILIO_NOT_CONFIGURED';
        setTestWaIsMissingConfig(isMissingConfig);
        setTestWaError(
          isMissingConfig
            ? 'Para activar WhatsApp necesitas configurar tus credenciales de Twilio en el archivo .env. De momento puedes continuar sin esta función.'
            : data.error || 'Error desconocido',
        );
      }
    } catch {
      setTestWa('error');
      setTestWaError('Error de conexión');
    }
  };

  const handleStripePortal = async () => {
    setStripeLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setError('Error al acceder al portal de pagos');
    } finally {
      setStripeLoading(false);
    }
  };

  const handleStripeCheckout = async () => {
    setStripeLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setError('Error al iniciar el pago');
    } finally {
      setStripeLoading(false);
    }
  };

  const subscriptionStatus = session?.user.subscriptionStatus || 'trialing';

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500 mt-1">Personaliza tu cuenta y gestiona tu suscripción</p>
      </div>

      {/* Subscription card */}
      <div className="bg-gradient-to-br from-brand-950 to-violet-900 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-bold text-lg">Plan ReputaciónPro</h2>
              <Badge variant={subscriptionStatus === 'active' ? 'success' : subscriptionStatus === 'trialing' ? 'info' : 'warning'}>
                {subscriptionStatus === 'active' ? 'Activo' : subscriptionStatus === 'trialing' ? 'Prueba gratuita' : 'Requiere atención'}
              </Badge>
            </div>
            <p className="text-white/60 text-sm">
              {subscriptionStatus === 'trialing'
                ? 'Estás en el período de prueba gratuito de 30 días'
                : subscriptionStatus === 'active'
                ? '€39/mes · Todo incluido · Sin límites'
                : 'Tu suscripción requiere atención'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold">€39</div>
            <div className="text-white/40 text-xs">/mes</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10 flex gap-3">
          {subscriptionStatus === 'trialing' ? (
            <Button
              variant="secondary"
              onClick={handleStripeCheckout}
              loading={stripeLoading}
              className="bg-white text-brand-700 hover:bg-gray-100"
            >
              Activar suscripción
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={handleStripePortal}
              loading={stripeLoading}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              Gestionar suscripción
            </Button>
          )}
        </div>
      </div>

      {/* Settings form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">
        {/* Business info */}
        <div className="p-6 space-y-4">
          <h3 className="font-bold text-gray-900">Datos del negocio</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nombre del negocio"
              value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
            />
            <Input
              label="Tipo de negocio"
              value={form.businessType}
              onChange={(e) => setForm({ ...form, businessType: e.target.value })}
              placeholder="Ej: Restaurante, Clínica..."
            />
          </div>
          <Input
            label="URL de tu perfil de Google Reviews"
            value={form.googleReviewUrl}
            onChange={(e) => setForm({ ...form, googleReviewUrl: e.target.value })}
            placeholder="https://g.page/r/... o https://maps.google.com/..."
            hint="Los clientes serán redirigidos aquí cuando reciban la solicitud de reseña"
          />
        </div>

        {/* AI Tone */}
        <div className="p-6 space-y-4">
          <h3 className="font-bold text-gray-900">Tono de las respuestas IA</h3>
          <p className="text-sm text-gray-500">Elige cómo quieres que la IA suene al responder reseñas</p>
          <div className="space-y-2">
            {toneOptions.map(({ value, label, desc }) => (
              <label key={value} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.aiTone === value ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input
                  type="radio"
                  name="aiTone"
                  value={value}
                  checked={form.aiTone === value}
                  onChange={() => setForm({ ...form, aiTone: value })}
                  className="mt-0.5 accent-brand-600"
                />
                <div>
                  <div className="font-semibold text-sm text-gray-900">{label}</div>
                  <div className="text-xs text-gray-500">{desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="p-6 space-y-4">
          <h3 className="font-bold text-gray-900">Notificaciones</h3>
          <Input
            label="Email para alertas de nuevas reseñas"
            type="email"
            value={form.notificationEmail}
            onChange={(e) => setForm({ ...form, notificationEmail: e.target.value })}
            hint="Recibirás una notificación cada vez que llegue una nueva reseña"
          />
        </div>

        {/* WhatsApp */}
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Notificaciones por WhatsApp</h3>
              <p className="text-xs text-gray-500">Recibe un mensaje instantáneo cuando llegue una nueva reseña</p>
            </div>
          </div>

          {/* Toggle + number */}
          <div className="rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {/* Toggle row */}
            <div className="flex items-center justify-between px-4 py-3.5">
              <div>
                <p className="text-sm font-medium text-gray-800">Activar notificaciones WhatsApp</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {form.whatsappEnabled ? 'Recibirás alertas en WhatsApp' : 'Las alertas WhatsApp están desactivadas'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, whatsappEnabled: !form.whatsappEnabled })}
                className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366] ${
                  form.whatsappEnabled ? 'bg-[#25D366]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                    form.whatsappEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Phone input */}
            <div className="px-4 py-4 space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Número de WhatsApp
              </label>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-500 flex-shrink-0">
                  <span className="text-base">🇪🇸</span>
                  <span>+34</span>
                </div>
                <input
                  type="tel"
                  value={form.whatsappNumber.replace(/^\+34/, '')}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 9);
                    setForm({ ...form, whatsappNumber: digits ? `+34${digits}` : '' });
                  }}
                  placeholder="612 345 678"
                  className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-400">
                El número debe tener activa la app de WhatsApp. Guarda los cambios antes de probar.
              </p>
            </div>

            {/* Test button */}
            <div className="px-4 py-3.5 bg-gray-50 flex items-center justify-between gap-3 flex-wrap">
              <p className="text-xs text-gray-500">
                Comprueba que el número es correcto enviando un mensaje de prueba
              </p>
              <button
                type="button"
                disabled={!form.whatsappNumber || testWa === 'loading'}
                onClick={handleTestWhatsApp}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all disabled:opacity-40 disabled:cursor-not-allowed
                  bg-white border-[#25D366] text-[#25D366] hover:bg-[#25D366]/5"
              >
                {testWa === 'loading' ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Enviando…
                  </>
                ) : testWa === 'ok' ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    ¡Enviado!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Enviar mensaje de prueba
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error from test */}
          {testWa === 'error' && (
            <div className={`flex items-start gap-2 rounded-xl p-3 text-sm ${
              testWaIsMissingConfig
                ? 'bg-amber-50 border border-amber-200 text-amber-700'
                : 'bg-red-50 border border-red-200 text-red-600'
            }`}>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                  testWaIsMissingConfig
                    ? 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    : 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                } />
              </svg>
              <span>{testWaError || 'Error al enviar. Revisa las credenciales de Twilio.'}</span>
            </div>
          )}

          {/* Info box */}
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold mb-0.5">¿Cómo funciona?</p>
              <p className="text-blue-600 leading-relaxed">
                Cada vez que llegue una nueva reseña recibirás un mensaje de WhatsApp con el autor, la puntuación y un extracto del texto. Requiere configurar Twilio en el panel de administración.
              </p>
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="p-6">
          {success && (
            <div className="mb-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg p-3 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
              <span className="flex-1">{error}</span>
              <button onClick={() => setError('')} className="flex-shrink-0 text-red-400 hover:text-red-600">×</button>
            </div>
          )}
          <Button type="submit" loading={loading}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
