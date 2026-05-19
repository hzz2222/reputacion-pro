const steps = [
  {
    number: '01',
    emoji: '🚀',
    title: 'Crea tu cuenta en 2 minutos',
    description: 'Introduce el nombre de tu negocio y el enlace a tu perfil de Google. Sin formularios complicados, sin instalar nada. Estás dentro de inmediato.',
    delay: 0,
  },
  {
    number: '02',
    emoji: '✨',
    title: 'Responde a reseñas con IA',
    description: 'Cuando llegue una reseña te avisamos. Un solo clic y la IA propone una respuesta profesional a tu estilo. Tú la apruebas. Todo en menos de un minuto.',
    delay: 150,
  },
  {
    number: '03',
    emoji: '📈',
    title: 'Consigue reseñas de 5 estrellas',
    description: 'Añade el contacto de tus clientes y envíales una solicitud por email o WhatsApp. Los clientes satisfechos necesitan ese empujoncito para escribir.',
    delay: 300,
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16 animate-slide-up">
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3">Cómo funciona</p>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Más sencillo de lo que crees.<br />
            <span className="gradient-text-dark">Más efectivo de lo que esperas.</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Diseñado para dueños de negocio que no tienen tiempo que perder, no para expertos en tecnología.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative">

          {/* Connector line */}
          <div className="hidden lg:block absolute top-14 left-[calc(33.33%+20px)] right-[calc(33.33%+20px)] h-px">
            <div className="h-full bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200 rounded-full" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-brand-400 rounded-full" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-brand-400 rounded-full" />
          </div>

          {steps.map(({ number, emoji, title, description, delay }, i) => (
            <div
              key={number}
              className="flex flex-col items-center text-center animate-scale-in"
              style={{ animationDelay: `${delay}ms` }}
            >
              {/* Icon */}
              <div className="relative mb-6 group">
                <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center shadow-2xl shadow-brand-900/25 text-5xl transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1">
                  {emoji}
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border-2 border-brand-200 shadow-md flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <span className="text-xs font-extrabold text-brand-700">{i + 1}</span>
                </div>
              </div>

              <div className="text-[10px] font-bold text-brand-400/50 tracking-[0.25em] mb-2">{number}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-500 leading-relaxed max-w-xs">{description}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center animate-fade-in delay-500">
          <p className="text-gray-400 text-sm mb-4">¿Sigues perdiendo clientes por reseñas sin responder?</p>
          <a
            href="/registro"
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-brand-900/25 hover:shadow-brand-600/35 hover:-translate-y-0.5 btn-glow"
          >
            Empieza ahora — es gratis
            <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}
