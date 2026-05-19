'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const STEPS = [
  {
    gradient: 'from-blue-600 to-indigo-700',
    iconBg: 'bg-white/20',
    icon: (
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    step: 'Paso 1 de 3',
    title: 'Conecta Google My Business',
    description:
      'Vincula tu ficha de Google para recibir nuevas reseñas automáticamente en tu panel. Sin conexión solo verás datos de ejemplo.',
    tips: [
      'Entra en Configuración y pega la URL de tu ficha de Google',
      'Las reseñas nuevas aparecerán aquí de forma automática',
    ],
    cta: { label: 'Ir a Configuración', href: '/configuracion' },
  },
  {
    gradient: 'from-brand-600 to-violet-700',
    iconBg: 'bg-white/20',
    icon: (
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    step: 'Paso 2 de 3',
    title: 'Responde reseñas con IA',
    description:
      'La inteligencia artificial redacta una respuesta personalizada para cada reseña. Tú la revisas, editas si quieres y apruebas.',
    tips: [
      'Las reseñas negativas reciben respuestas empáticas y con solución concreta',
      'El tono de la IA se adapta al perfil de tu negocio automáticamente',
    ],
    cta: { label: 'Ver mis reseñas', href: '/resenas' },
  },
  {
    gradient: 'from-emerald-600 to-teal-700',
    iconBg: 'bg-white/20',
    icon: (
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    step: 'Paso 3 de 3',
    title: 'Consigue más reseñas',
    description:
      'Envía solicitudes de reseña a tus clientes por email o WhatsApp con un solo clic. Más reseñas positivas = mejor reputación.',
    tips: [
      'Personaliza el mensaje para cada cliente',
      'Haz seguimiento de quién ha dejado ya su reseña',
    ],
    cta: { label: 'Enviar solicitudes', href: '/solicitudes' },
  },
];

async function markComplete() {
  try {
    await fetch('/api/usuario/onboarding-complete', { method: 'POST' });
  } catch { /* best-effort */ }
}

export function OnboardingTutorial({ show }: { show: boolean }) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (show) setVisible(true);
  }, [show]);

  async function handleSkip() {
    await markComplete();
    setVisible(false);
  }

  async function handleFinish() {
    await markComplete();
    setVisible(false);
  }

  async function handleCta(href: string) {
    await markComplete();
    setVisible(false);
    router.push(href);
  }

  if (!visible) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up">

        {/* Gradient header */}
        <div className={`bg-gradient-to-br ${current.gradient} px-8 pt-8 pb-10 flex flex-col items-center text-center`}>
          {/* Step dots */}
          <div className="flex items-center gap-2 mb-6">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === step
                    ? 'w-6 h-2 bg-white'
                    : i < step
                    ? 'w-2 h-2 bg-white/60'
                    : 'w-2 h-2 bg-white/30'
                }`}
              />
            ))}
          </div>

          {/* Icon */}
          <div className={`w-20 h-20 rounded-2xl ${current.iconBg} border border-white/20 flex items-center justify-center mb-5`}>
            {current.icon}
          </div>

          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-2">{current.step}</p>
          <h2 className="text-xl font-bold text-white leading-tight">{current.title}</h2>
        </div>

        {/* Body */}
        <div className="px-8 pt-6 pb-8 space-y-5">
          <p className="text-gray-600 text-sm leading-relaxed">{current.description}</p>

          <ul className="space-y-2.5">
            {current.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {tip}
              </li>
            ))}
          </ul>

          {/* CTA link */}
          <button
            onClick={() => handleCta(current.cta.href)}
            className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            {current.cta.label}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>

          {/* Navigation */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleSkip}
              className="flex-1 text-sm text-gray-400 hover:text-gray-600 transition-colors py-2.5"
            >
              Saltar tutorial
            </button>
            {isLast ? (
              <button
                onClick={handleFinish}
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
              >
                Empezar ahora
              </button>
            ) : (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Siguiente
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
