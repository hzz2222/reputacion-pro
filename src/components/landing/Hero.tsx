import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#060B18] pt-28 pb-24">
      {/* Background layers */}
      <div className="absolute inset-0 hex-bg-dark pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-900/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-64 h-64 bg-indigo-900/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">

          {/* Eyebrow */}
          <div className="animate-slide-up inline-flex items-center gap-2 bg-brand-900/40 border border-brand-700/30 rounded-full px-4 py-1.5 text-sm text-brand-300 mb-8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse-slow" />
            Tu competencia ya cuida su reputación en Google. ¿Y tú?
          </div>

          {/* Headline */}
          <h1
            className="animate-slide-up delay-100 text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold text-white leading-[1.08] tracking-tight mb-6"
          >
            Cada reseña sin responder<br />
            <span className="gradient-text">es un cliente que se pierde</span>
          </h1>

          {/* Subheadline */}
          <p className="animate-slide-up delay-200 text-xl text-white/55 leading-relaxed mb-10 max-w-2xl mx-auto">
            ReputaciónPro responde a tus reseñas de Google con IA en segundos, envía solicitudes automáticas a tus clientes y mantiene tu negocio en el top de Google Maps — sin que tengas que hacer casi nada.
          </p>

          {/* CTAs */}
          <div className="animate-slide-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              href="/registro"
              className="group w-full sm:w-auto bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-2xl shadow-brand-900/50 hover:shadow-brand-600/40 transition-all duration-300 hover:-translate-y-1 btn-glow"
            >
              Probar gratis 30 días
              <span className="inline-block ml-1.5 transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
            <a
              href="#como-funciona"
              className="w-full sm:w-auto glass-dark text-white/65 hover:text-white font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:bg-white/8"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Ver cómo funciona
            </a>
          </div>

          {/* Trust pills */}
          <div className="animate-fade-in delay-400 flex flex-wrap items-center justify-center gap-3 mb-16">
            {[
              { icon: '✅', text: 'Sin tarjeta de crédito' },
              { icon: '⚡', text: 'En marcha en 2 minutos' },
              { icon: '🔒', text: 'Sin permanencia' },
              { icon: '🇪🇸', text: 'Soporte en español' },
            ].map(({ icon, text }) => (
              <span
                key={text}
                className="inline-flex items-center gap-1.5 bg-white/4 border border-white/8 hover:bg-white/8 hover:border-white/15 rounded-full px-4 py-1.5 text-sm text-white/55 transition-all duration-200"
              >
                <span>{icon}</span>{text}
              </span>
            ))}
          </div>

          {/* Visual flow diagram */}
          <div className="animate-scale-in delay-500 relative max-w-3xl mx-auto">
            <div className="grid grid-cols-3 gap-4 items-center">

              {/* Review arrives */}
              <div className="glass-dark rounded-2xl p-5 text-left hover:-translate-y-1 transition-transform duration-300">
                <div className="text-xs font-semibold text-brand-400 uppercase tracking-widest mb-3">Reseña recibida</div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-900/60 border border-blue-700/30 flex items-center justify-center text-xs font-bold text-brand-300">C</div>
                  <div>
                    <div className="text-xs text-white/80 font-medium">Un cliente</div>
                    <div className="text-amber-400 text-xs">★★★★★</div>
                  </div>
                </div>
                <p className="text-xs text-white/35 leading-relaxed">"Todo perfecto, muy atentos y profesionales..."</p>
              </div>

              {/* AI */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-xl shadow-brand-900/50 animate-float animate-glow-pulse">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="text-xs text-brand-400 font-semibold text-center leading-relaxed">IA redacta<br />la respuesta</div>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse-slow"
                      style={{ animationDelay: `${i * 250}ms` }}
                    />
                  ))}
                </div>
              </div>

              {/* Ready to publish */}
              <div className="glass-dark rounded-2xl p-5 ring-1 ring-brand-500/20 border border-brand-700/20 text-left hover:-translate-y-1 transition-transform duration-300">
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">Lista para publicar</div>
                <p className="text-xs text-white/50 leading-relaxed mb-3">
                  "¡Muchas gracias por visitarnos! Es un placer saber que quedaste satisfecho..."
                </p>
                <div className="inline-flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Aprobada con 1 clic
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
