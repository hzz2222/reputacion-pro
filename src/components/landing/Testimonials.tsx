const businessTypes = [
  { emoji: '🍽️', label: 'Restaurantes y bares' },
  { emoji: '🏥', label: 'Clínicas y salud' },
  { emoji: '🛍️', label: 'Tiendas y comercios' },
  { emoji: '🎓', label: 'Academias y formación' },
  { emoji: '🏨', label: 'Hoteles y alojamientos' },
  { emoji: '🔧', label: 'Talleres y reparaciones' },
  { emoji: '✂️', label: 'Peluquerías y estética' },
  { emoji: '🏠', label: 'Inmobiliarias' },
  { emoji: '⚖️', label: 'Despachos profesionales' },
  { emoji: '💪', label: 'Gimnasios y deporte' },
];

const painPoints = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'El problema que nadie menciona',
    body: 'Cuando un cliente busca tu negocio en Google, lo primero que lee son las reseñas. Si no hay respuestas o hay alguna negativa sin contestar, muchos se van directamente a la competencia.',
    delay: 0,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    label: 'Google lo tiene muy en cuenta',
    body: 'Google favorece en sus resultados a los negocios activos. Responder a reseñas con regularidad es una de las señales que el algoritmo valora para posicionarte más arriba en Maps.',
    delay: 150,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'La solución cuesta menos de lo que pierdes',
    body: 'Piensa en cuánto te cuesta un cliente nuevo. Si una reseña negativa sin responder aleja a alguien, esa pérdida ya supera con creces el coste mensual de ReputaciónPro.',
    delay: 300,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-[#060B18] hex-bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Pain points header */}
        <div className="text-center mb-14 animate-slide-up">
          <p className="text-brand-400 font-semibold text-sm uppercase tracking-widest mb-3">La realidad del mercado</p>
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Tu reputación online decide<br />
            <span className="gradient-text">quién te elige a ti y quién no</span>
          </h2>
          <p className="text-xl text-white/45 max-w-2xl mx-auto leading-relaxed">
            Los clientes buscan en Google antes de visitarte. Lo que encuentran es lo que determina si entran por tu puerta o siguen buscando.
          </p>
        </div>

        {/* Pain point cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
          {painPoints.map(({ icon, label, body, delay }) => (
            <div
              key={label}
              className="group glass-dark rounded-2xl p-6 hover:bg-white/8 hover:border-blue-700/30 transition-all duration-300 hover:-translate-y-1 animate-scale-in"
              style={{ animationDelay: `${delay}ms` }}
            >
              <div className="w-11 h-11 rounded-xl bg-brand-900/50 border border-brand-700/30 text-brand-400 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                {icon}
              </div>
              <h3 className="font-bold text-white mb-2">{label}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        {/* Business types */}
        <div className="text-center mb-10 animate-slide-up">
          <p className="text-brand-400 font-semibold text-sm uppercase tracking-widest mb-3">Para todo tipo de negocios</p>
          <h3 className="text-2xl font-bold text-white mb-2">
            Da igual tu sector — si tienes presencia en Google,<br />
            <span className="gradient-text">ReputaciónPro trabaja para ti</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {businessTypes.map(({ emoji, label }, i) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 glass-dark rounded-2xl p-4 text-center hover:bg-white/10 hover:border-brand-700/40 transition-all duration-300 group cursor-default animate-scale-in"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <span className="text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">{emoji}</span>
              <span className="text-xs text-white/50 font-medium leading-tight group-hover:text-white/70 transition-colors duration-200">{label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
