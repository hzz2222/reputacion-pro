'use client';

import { useState } from 'react';

const faqs = [
  {
    q: '¿Por qué es gratis el primer mes?',
    a: 'Porque sabemos que probar algo nuevo requiere confianza. Queremos que veas los resultados con tu propio negocio antes de pagar nada. No pedimos tarjeta, no hay letra pequeña. Si al cabo del mes decides continuar, genial. Si no, no pasa nada.',
  },
  {
    q: '¿Tengo que saber de tecnología para usarlo?',
    a: 'Para nada. Si sabes usar el email y WhatsApp, sabes usar ReputaciónPro. La configuración inicial lleva menos de 5 minutos y desde el primer día tienes todo funcionando. Si necesitas ayuda, nuestro soporte en español está disponible.',
  },
  {
    q: '¿La IA responde sola o yo tengo que aprobar cada respuesta?',
    a: 'Tú tienes el control total. La IA prepara una propuesta de respuesta, tú la lees, la editas si quieres, y solo entonces se publica. Nunca se publica nada en tu nombre sin que lo apruebes. Tu voz y tu criterio siempre mandan.',
  },
  {
    q: '¿Cómo se conecta con mis reseñas de Google?',
    a: 'Introduces el enlace de tu perfil de Google My Business en la configuración. Desde ahí puedes gestionar y responder todas tus reseñas directamente desde el panel, sin tener que entrar a Google cada vez.',
  },
  {
    q: '¿Puedo cancelar en cualquier momento?',
    a: 'Sí, desde el panel de configuración con un solo clic. Sin llamadas, sin formularios, sin excusas. Si cancelas, tu cuenta sigue activa hasta el final del período pagado.',
  },
  {
    q: '¿Para qué tipo de negocios funciona?',
    a: 'Para cualquier negocio con perfil en Google: restaurantes, bares, clínicas, peluquerías, talleres, academias, hoteles, tiendas, inmobiliarias, despachos... Si tus clientes pueden dejarte una reseña en Google, ReputaciónPro funciona para ti.',
  },
  {
    q: '¿Hay límite de reseñas o de solicitudes que puedo enviar?',
    a: 'No. El plan incluye acceso ilimitado. Puedes gestionar todas las reseñas que tengas y enviar tantas solicitudes como clientes quieras. Sin coste adicional.',
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-14 animate-slide-up">
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3">Resolvemos tus dudas</p>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3">
            Preguntas <span className="gradient-text-dark">frecuentes</span>
          </h2>
          <p className="text-gray-500 text-lg">Todo lo que necesitas saber antes de empezar.</p>
        </div>

        <div className="space-y-2">
          {faqs.map(({ q, a }, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-brand-200 transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left hover:bg-blue-50/40 transition-colors duration-200"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-gray-900 pr-4">{q}</span>
                <svg
                  className={`w-5 h-5 text-brand-500 flex-shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-gray-500 leading-relaxed border-t border-gray-100 pt-4 text-[0.95rem] animate-slide-up">
                  {a}
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-8 animate-fade-in delay-500">
          ¿Tienes alguna otra pregunta?{' '}
          <a href="mailto:hola@reputacionpro.app" className="text-brand-600 hover:text-brand-700 hover:underline font-medium transition-colors">
            Escríbenos y te respondemos hoy
          </a>
        </p>

      </div>
    </section>
  );
}
