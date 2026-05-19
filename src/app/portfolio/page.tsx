import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from '@/components/portfolio/ContactForm';

export const metadata: Metadata = {
  title: 'Juan Hernández · Soluciones digitales con IA',
  description:
    'Desarrollo soluciones digitales con IA para negocios locales. Creador de ReputaciónPro, SaaS de gestión de reseñas de Google con IA.',
};

const WHATSAPP_NUMBER = '34622398840';

/* ─── Dashboard CSS mockup ───────────────────────────────────────────────── */
function DashboardMockup({ compact = false }: { compact?: boolean }) {
  const reviews = [
    { initials: 'MG', name: 'María García', rating: 5, text: 'Increíble servicio, volveré sin duda.', replied: true },
    { initials: 'CM', name: 'Carlos Martínez', rating: 4, text: 'Muy buen servicio en general.', replied: false },
    { initials: 'PS', name: 'Pedro Sánchez', rating: 5, text: 'Excelente atención desde el primer momento.', replied: true },
  ];
  const nav = ['Dashboard', 'Reseñas', 'Solicitudes', 'Encuestas', 'Competidores'];

  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl shadow-brand-950/40 ring-1 ring-white/10 select-none">
      {/* Browser chrome */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-[#1a1f2e] border-b border-white/10">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <span className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="flex-1 bg-white/10 rounded-full text-[11px] text-white/40 px-3 py-0.5 text-center truncate">
          app.reputacionpro.es/dashboard
        </div>
      </div>

      {/* App shell */}
      <div className={`flex bg-[#060B18] ${compact ? 'h-56' : 'h-80'}`}>

        {/* Sidebar */}
        <div className="w-40 flex-shrink-0 bg-[#040810] border-r border-white/5 p-3 flex flex-col gap-1">
          <div className="flex items-center gap-2 px-2 py-2 mb-2">
            <div className="w-6 h-6 rounded-md bg-brand-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">R</div>
            <span className="text-[11px] font-bold text-white/80">ReputaciónPro</span>
          </div>
          {nav.map((item, i) => (
            <div
              key={item}
              className={`text-[11px] px-2.5 py-1.5 rounded-lg cursor-default ${i === 0 ? 'bg-brand-600/20 text-brand-300 font-medium' : 'text-white/35 hover:text-white/60'}`}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-hidden p-4 flex flex-col gap-3">
          {/* Header */}
          <div>
            <p className="text-sm font-bold text-white">¡Hola, Juan! 👋</p>
            <p className="text-[11px] text-white/40">Panel de reputación · Bar El Rincón</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-2 flex-shrink-0">
            {[
              { label: 'Reseñas', value: '47', accent: 'text-brand-400' },
              { label: 'Valoración', value: '4.8★', accent: 'text-amber-400' },
              { label: 'Respondidas', value: '45/47', accent: 'text-emerald-400' },
              { label: 'Pendientes', value: '2', accent: 'text-red-400' },
            ].map(({ label, value, accent }) => (
              <div key={label} className="bg-white/5 rounded-xl p-2.5 border border-white/5">
                <p className="text-[9px] text-white/35 mb-0.5">{label}</p>
                <p className={`text-sm font-bold leading-none ${accent}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Review list */}
          <div className="flex flex-col gap-1.5 overflow-hidden flex-1">
            {reviews.slice(0, compact ? 2 : 3).map((r) => (
              <div key={r.name} className="flex items-center gap-2.5 bg-white/5 rounded-xl px-3 py-2 border border-white/5">
                <div className="w-7 h-7 rounded-full bg-brand-700 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                  {r.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[11px] font-semibold text-white/80 truncate">{r.name}</p>
                    <span className="text-[9px] text-amber-400">{'★'.repeat(r.rating)}</span>
                  </div>
                  <p className="text-[10px] text-white/35 truncate">{r.text}</p>
                </div>
                <div className={`text-[9px] font-medium flex-shrink-0 px-1.5 py-0.5 rounded-full ${r.replied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {r.replied ? 'Respondida' : 'Pendiente'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-inter)]">

      {/* ── NAV ────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-sm">JH</div>
            <span className="font-semibold text-gray-900 text-sm hidden sm:block">Juan Hernández</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {[['#sobre-mi', 'Sobre mí'], ['#proyectos', 'Proyectos'], ['#contacto', 'Contacto']].map(([href, label]) => (
              <a key={href} href={href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
                {label}
              </a>
            ))}
          </nav>
          <a
            href="#contacto"
            className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm shadow-brand-200"
          >
            Contactar
          </a>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#060B18] to-slate-900 hex-bg-dark">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-40 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-brand-800/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-brand-900/50 border border-brand-700/40 text-brand-300 text-xs font-medium px-3.5 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
                Disponible para nuevos proyectos · 2026
              </div>

              <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-[1.1] mb-6">
                Juan<br />
                <span className="gradient-text">Hernández</span>
              </h1>

              <p className="text-xl text-white/70 leading-relaxed mb-4">
                Desarrollo soluciones digitales con IA para negocios locales.
              </p>
              <p className="text-base text-white/45 leading-relaxed mb-10 max-w-lg">
                Transformo problemas reales de pymes y negocios locales en productos digitales que generan impacto desde el primer día.
                Actualmente con un SaaS en producción y varios proyectos en marcha.
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href="#proyectos"
                  className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-brand-900/50 hover:-translate-y-0.5 btn-glow"
                >
                  Ver mis proyectos
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a
                  href="#contacto"
                  className="inline-flex items-center gap-2 glass-dark text-white/80 hover:text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                >
                  Hablemos
                </a>
              </div>
            </div>

            {/* Right — dashboard mockup */}
            <div className="animate-slide-up delay-200 hidden lg:block">
              <DashboardMockup />
              <p className="text-center text-xs text-white/25 mt-3">ReputaciónPro · Panel de gestión de reseñas</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PILLARS ────────────────────────────────────────────────────── */}
      <section id="sobre-mi" className="py-20 bg-gray-50 hex-bg-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-slide-up">
            <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3">Sobre mí</p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Construyo productos que resuelven<br className="hidden sm:block" /> problemas de verdad
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: 'IA Aplicada',
                desc: 'No demos ni POCs. LLMs y modelos en producción resolviendo problemas concretos de negocios reales.',
                color: 'bg-violet-50 text-violet-600 border-violet-100',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                ),
                title: 'SaaS Completos',
                desc: 'De la idea al producto en producción: diseño, frontend, backend, base de datos, pagos e IA integrados.',
                color: 'bg-brand-50 text-brand-600 border-brand-100',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: 'Negocios Locales',
                desc: 'Especializado en el mercado español. Restaurantes, clínicas, comercios y pymes con necesidades digitales concretas.',
                color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
              },
            ].map(({ icon, title, desc, color }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-100 p-7 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 ${color}`}>
                  {icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Tech stack */}
          <div className="mt-12 flex flex-wrap justify-center gap-2.5">
            {['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'OpenAI API', 'Tailwind CSS', 'Stripe', 'NextAuth'].map((tech) => (
              <span key={tech} className="bg-white border border-gray-200 text-gray-600 text-xs font-medium px-3.5 py-1.5 rounded-full shadow-sm">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ───────────────────────────────────────────────────── */}
      <section id="proyectos" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-slide-up">
            <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3">Proyectos</p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Productos en producción
            </h2>
          </div>

          {/* ReputaciónPro — featured card */}
          <div className="rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/80 overflow-hidden">
            {/* Card header */}
            <div className="relative bg-gradient-to-br from-slate-950 to-[#060B18] px-8 py-10 hex-bg-dark overflow-hidden">
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-900/60">R</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-2xl font-extrabold text-white">ReputaciónPro</h3>
                      <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        En producción
                      </span>
                    </div>
                    <p className="text-white/50 text-sm">Gestión de reseñas de Google con IA · SaaS B2B</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link
                    href="/demo"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Ver demo
                  </Link>
                  <Link
                    href="/registro"
                    className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-brand-900/50 btn-glow"
                  >
                    Pruébalo gratis
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Dashboard mockup — full width */}
              <DashboardMockup />
            </div>

            {/* Card body */}
            <div className="px-8 py-8 bg-white">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Description */}
                <div className="lg:col-span-2">
                  <h4 className="font-bold text-gray-900 mb-3">¿Qué es?</h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Plataforma SaaS que ayuda a negocios locales a gestionar su reputación en Google de forma automatizada.
                    Los usuarios pueden responder reseñas con IA personalizada, detectar reseñas falsas, solicitar nuevas
                    reseñas a sus clientes por email o WhatsApp, y analizar la evolución de su puntuación.
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Primer mes gratuito, sin tarjeta de crédito. Desde el mes 2, €39/mes con cancelación en cualquier momento.
                  </p>

                  {/* Feature chips */}
                  <div className="flex flex-wrap gap-2 mt-5">
                    {[
                      'Respuestas IA', 'Detección de fraude', 'Campañas de solicitud',
                      'Análisis de palabras', 'Panel de métricas', 'Informes mensuales PDF',
                    ].map((f) => (
                      <span key={f} className="bg-brand-50 text-brand-700 border border-brand-100 text-xs font-medium px-3 py-1 rounded-full">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-col gap-4">
                  <h4 className="font-bold text-gray-900">Qué ofrece</h4>
                  {[
                    'Respuestas generadas en segundos',
                    'Gestión centralizada de todas tus reseñas',
                    'Sin instalaciones ni configuración técnica',
                  ].map((label) => (
                    <div key={label} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <p className="text-xs text-gray-600 leading-tight">{label}</p>
                    </div>
                  ))}

                  {/* Stack */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Stack</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['Next.js 15', 'TypeScript', 'Prisma', 'PostgreSQL', 'OpenAI'].map((t) => (
                        <span key={t} className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* More projects placeholder */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {['Próximo proyecto', 'Próximo proyecto'].map((label, i) => (
              <div key={i} className="rounded-2xl border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center gap-2 min-h-[120px]">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-400">{label}</p>
                <p className="text-xs text-gray-300">En desarrollo</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ────────────────────────────────────────────────────── */}
      <section id="contacto" className="py-20 bg-gray-50 hex-bg-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3">Contacto</p>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              ¿Tienes un proyecto en mente?
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Cuéntame tu idea. Respondo en menos de 24 horas.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-4xl mx-auto">

            {/* Left — contact info */}
            <div className="lg:col-span-2 flex flex-col gap-4">

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Canales directos</p>

                <a
                  href="mailto:hzzbussines@gmail.com"
                  className="flex items-center gap-3.5 group mb-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-100 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-brand-600 transition-colors">hzzbussines@gmail.com</p>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 group"
                >
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">WhatsApp</p>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors">Escríbeme directamente</p>
                  </div>
                </a>
              </div>

              <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-6 text-white">
                <p className="font-bold mb-2">¿Prefieres una llamada?</p>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  Si tienes una idea concreta, podemos hacer una llamada de 20 minutos para ver si encajamos.
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola Juan, me gustaría hacer una llamada para hablar de un proyecto.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
                >
                  Coordinar llamada
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right — form */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
              <h3 className="font-bold text-gray-900 mb-1">Envíame un mensaje</h3>
              <p className="text-sm text-gray-400 mb-6">Te respondo en menos de 24 horas.</p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="bg-[#060B18] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-xs">JH</div>
            <span className="text-white/60 text-sm">Juan Hernández · Desarrollador</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/" className="text-white/40 hover:text-white/70 text-xs transition-colors">
              ReputaciónPro
            </Link>
            <Link href="/demo" className="text-white/40 hover:text-white/70 text-xs transition-colors">
              Demo
            </Link>
            <a href="mailto:hzzbussines@gmail.com" className="text-white/40 hover:text-white/70 text-xs transition-colors">
              Email
            </a>
          </div>
          <p className="text-white/25 text-xs">© 2026 Juan Hernández</p>
        </div>
      </footer>

    </div>
  );
}
