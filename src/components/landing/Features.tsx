const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
    title: 'Todas tus reseñas en un solo lugar',
    description: 'Olvídate de entrar a Google My Business cada vez. Todas las reseñas llegan a tu panel y sabes en todo momento qué dice la gente de tu negocio.',
    accent: 'bg-blue-50 text-blue-700',
    delay: 0,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Responde como un profesional en segundos',
    description: 'La IA redacta una respuesta adaptada al tono de tu negocio. Tú solo la revisas, la ajustas si quieres y la publicas. Sin esfuerzo, sin perder el tiempo.',
    accent: 'bg-indigo-50 text-indigo-700',
    delay: 75,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    title: 'Alerta inmediata ante reseñas negativas',
    description: 'Cuando alguien te deja una reseña mala, recibes un aviso al instante. Puedes responder antes de que otros clientes la vean y cause daño a tu imagen.',
    accent: 'bg-amber-50 text-amber-700',
    delay: 150,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Pide reseñas sin molestar, por email',
    description: 'Muchos clientes satisfechos no dejan reseña porque nadie se lo pide. Envíales un email profesional y personalizado con un enlace directo. Simple y efectivo.',
    accent: 'bg-sky-50 text-sky-700',
    delay: 225,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: 'WhatsApp: el mensaje que sí se lee',
    description: 'Un WhatsApp con un enlace directo a Google tiene mucha más respuesta que cualquier otro canal. Genera el mensaje en un clic y envíalo desde tu teléfono.',
    accent: 'bg-emerald-50 text-emerald-700',
    delay: 300,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Sigue la evolución de tu reputación',
    description: 'Visualiza tu puntuación media, cuántas reseñas recibes cada mes y qué porcentaje has respondido. Conoce tu reputación en tiempo real.',
    accent: 'bg-violet-50 text-violet-700',
    delay: 375,
  },
];

export function Features() {
  return (
    <section id="funcionalidades" className="py-24 bg-white hex-bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16 animate-slide-up">
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3">Por qué importa</p>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Google premia a los negocios<br />
            <span className="gradient-text-dark">que cuidan su reputación</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Responder a reseñas mejora tu posición en Google Maps y genera confianza en nuevos clientes antes de que te visiten.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon, title, description, accent, delay }) => (
            <div
              key={title}
              className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm card-hover animate-scale-in"
              style={{ animationDelay: `${delay}ms` }}
            >
              <div className={`w-12 h-12 ${accent} rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                {icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-700 transition-colors duration-200">{title}</h3>
              <p className="text-gray-500 leading-relaxed text-[0.95rem]">{description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
