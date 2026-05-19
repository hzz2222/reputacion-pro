import { Fragment } from 'react';
import Link from 'next/link';

const features = [
  { icon: '⭐', text: 'Panel de reseñas de Google centralizado' },
  { icon: '✨', text: 'Respuestas con IA ilimitadas y personalizadas' },
  { icon: '🔔', text: 'Alertas instantáneas de nuevas reseñas' },
  { icon: '📧', text: 'Solicitudes de reseña por email y WhatsApp' },
  { icon: '📊', text: 'Métricas y estadísticas mensuales' },
  { icon: '🎨', text: 'Personalización del tono de la IA' },
  { icon: '📁', text: 'Historial completo de respuestas' },
  { icon: '🇪🇸', text: 'Soporte en español incluido' },
];

const comparison = [
  {
    metric: 'Tiempo de respuesta',
    without: { label: '5+ días o nunca', bar: 12 },
    with: { label: 'Menos de 2 horas', bar: 96 },
  },
  {
    metric: 'Reseñas respondidas',
    without: { label: '~20% del total', bar: 20 },
    with: { label: '100% respondidas', bar: 100 },
  },
  {
    metric: 'Nuevas reseñas al mes',
    without: { label: 'Las que llegan solas', bar: 18 },
    with: { label: 'Hasta 3× más con campañas', bar: 80 },
  },
  {
    metric: 'Reseñas falsas detectadas',
    without: { label: 'No las ves venir', bar: 0 },
    with: { label: 'IA detecta patrones sospechosos', bar: 90 },
  },
  {
    metric: 'Tiempo gestionando reseñas',
    without: { label: '3-4 horas por semana', bar: 85 },
    with: { label: '15 minutos por semana', bar: 10 },
    invertBars: true,
  },
  {
    metric: 'Visibilidad en Google Maps',
    without: { label: 'Sin diferenciación', bar: 15 },
    with: { label: 'Más reseñas + respuestas = mejor posición', bar: 88 },
  },
];

export function Pricing() {
  return (
    <section id="precios" className="py-24 bg-gray-50 hex-bg-light">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14 animate-slide-up">
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3">Precio</p>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Sin riesgo. Sin letra pequeña.<br />
            <span className="gradient-text-dark">Sin sorpresas.</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-xl mx-auto leading-relaxed">
            Pruébalo un mes completo sin pagar nada. Si te convence, continúa por solo €39 al mes.
          </p>
        </div>

        {/* ── Comparison ─────────────────────────────────────── */}
        <div className="animate-slide-up delay-100 mb-12">
          <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">
            ¿Qué cambia cuando lo usas?
          </p>

          {/* Column headers */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center mb-3 px-1 gap-2">
            <div className="flex items-center gap-2 justify-start">
              <span className="w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xs font-bold flex-shrink-0">✕</span>
              <span className="text-xs font-bold text-red-500 uppercase tracking-wide">Sin ReputaciónPro</span>
            </div>
            <div className="w-px" />
            <div className="flex items-center gap-2 justify-end">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Con ReputaciónPro</span>
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
            </div>
          </div>

          {/* Rows */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden divide-y divide-gray-100">
            {comparison.map(({ metric, without: wo, with: wi, invertBars }) => (
              <div key={metric} className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-stretch group hover:bg-gray-50/70 transition-colors">

                {/* Without */}
                <div className="px-5 py-4 flex flex-col gap-2">
                  <p className="text-xs text-red-400 font-medium leading-snug">{wo.label}</p>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${invertBars ? 'bg-red-300' : 'bg-red-200'}`}
                      style={{ width: `${wo.bar}%` }}
                    />
                  </div>
                </div>

                {/* Center label */}
                <div className="hidden sm:flex flex-col items-center justify-center px-4 py-4 border-x border-gray-100">
                  <span className="text-[11px] font-semibold text-gray-400 text-center leading-tight whitespace-nowrap">{metric}</span>
                </div>

                {/* Mobile metric label */}
                <div className="sm:hidden px-5 pt-2 pb-0">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">{metric}</span>
                </div>

                {/* With */}
                <div className="px-5 py-4 flex flex-col gap-2">
                  <p className="text-xs text-emerald-700 font-semibold leading-snug text-right sm:text-right">{wi.label}</p>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ml-auto ${invertBars ? 'bg-red-200' : 'bg-emerald-400'}`}
                      style={{ width: `${wi.bar}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Impact summary strip */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: '3×', label: 'más reseñas nuevas', color: 'text-brand-600' },
              { value: '100%', label: 'reseñas respondidas', color: 'text-emerald-600' },
              { value: '−95%', label: 'tiempo de gestión', color: 'text-violet-600' },
              { value: '↑ Top 3', label: 'en Google Maps', color: 'text-amber-600' },
            ].map(({ value, label, color }) => (
              <div key={label} className="bg-white border border-gray-100 rounded-xl px-4 py-3 text-center shadow-sm">
                <p className={`text-xl font-extrabold ${color}`}>{value}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

          {/* Month 1 — FREE */}
          <div className="animate-scale-in relative bg-white rounded-3xl border-2 border-emerald-300 shadow-xl shadow-emerald-100/60 p-8 overflow-hidden hover:-translate-y-1 transition-transform duration-300">
            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl tracking-wide">
              AHORA
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-extrabold text-lg">1</div>
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Primer mes</span>
            </div>
            <div className="mb-5">
              <span className="text-6xl font-extrabold text-emerald-600">Gratis</span>
              <p className="text-gray-400 text-sm mt-1">30 días completos · Sin tarjeta de crédito</p>
            </div>
            <ul className="space-y-2.5 mb-7">
              {[
                'Acceso completo a todas las funcionalidades',
                'Sin límites de uso',
                'Sin compromiso',
                'Cancela antes de que acabe y no pagas nada',
              ].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/registro"
              className="group block w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base py-3.5 rounded-xl transition-all duration-300 shadow-md shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5"
            >
              Empezar gratis ahora
              <span className="inline-block ml-1 transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {/* Month 2+ */}
          <div className="animate-scale-in delay-100 relative bg-[#060B18] rounded-3xl border-2 border-brand-700/50 shadow-2xl shadow-brand-950/50 p-8 overflow-hidden hover:-translate-y-1 transition-transform duration-300">
            <div className="absolute inset-0 hex-bg-dark pointer-events-none opacity-80" />
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-700/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-800/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-brand-600 to-brand-700 text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl tracking-wide">
                DESDE EL MES 2
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-900/60 border border-brand-700/40 text-brand-300 flex items-center justify-center font-extrabold text-lg">2</div>
                <span className="text-sm font-semibold text-white/40 uppercase tracking-wider">Suscripción mensual</span>
              </div>
              <div className="mb-5">
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-extrabold text-white">€39</span>
                  <span className="text-white/40 text-xl">/mes</span>
                </div>
                <p className="text-white/30 text-sm mt-1">IVA no incluido · Cancela cuando quieras</p>
              </div>
              <ul className="space-y-2.5 mb-7">
                {features.map(({ icon, text }) => (
                  <li key={text} className="flex items-center gap-2.5 text-sm text-white/60">
                    <span className="text-base leading-none flex-shrink-0">{icon}</span>
                    {text}
                  </li>
                ))}
              </ul>
              <Link
                href="/registro"
                className="group block w-full text-center bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white font-bold text-base py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-brand-950/60 hover:shadow-brand-700/40 hover:-translate-y-0.5 btn-glow"
              >
                Suscribirse — primer mes gratis
                <span className="inline-block ml-1 transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
              <p className="relative text-center text-white/25 text-xs mt-3">
                Sin tarjeta hasta que decidas continuar
              </p>
            </div>
          </div>
        </div>

        {/* Flow indicator */}
        <div className="animate-fade-in delay-300 flex items-center justify-center gap-4 mb-10 flex-wrap">
          {[
            { color: 'bg-emerald-500', label: 'Te registras hoy — gratis' },
            { color: 'bg-amber-500', label: '30 días probando sin límites' },
            { color: 'bg-brand-600', label: 'Decides si continuar por €39/mes' },
          ].map(({ color, label }, i) => (
            <Fragment key={label}>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200">
                <span className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-sm text-gray-600 font-medium">{label}</span>
              </div>
              {i < 2 && (
                <svg className="w-5 h-5 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              )}
            </Fragment>
          ))}
        </div>

        {/* Reassurance box */}
        <div className="animate-slide-up delay-400 bg-white border border-blue-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center flex-shrink-0 text-2xl">💡</div>
          <div>
            <p className="font-semibold text-gray-900 mb-0.5">Piénsalo así</p>
            <p className="text-gray-500 text-sm leading-relaxed">
              Si gracias a una mejor reputación online consigues un cliente nuevo al mes, ReputaciónPro ya se ha pagado sola — y sobra.
              A €39/mes, es la inversión de marketing más barata que puedes hacer para tu negocio.
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6 animate-fade-in delay-500">
          ¿Gestionas varios locales?{' '}
          <a href="mailto:hola@reputacionpro.app" className="text-brand-600 hover:text-brand-700 hover:underline font-medium transition-colors">
            Escríbenos para un plan personalizado
          </a>
        </p>

      </div>
    </section>
  );
}
