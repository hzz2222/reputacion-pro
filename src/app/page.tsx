import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Testimonials } from '@/components/landing/Testimonials';
import { Pricing } from '@/components/landing/Pricing';
import { FAQ } from '@/components/landing/FAQ';
import { Footer } from '@/components/landing/Footer';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />

      {/* Final CTA */}
      <section className="relative bg-[#060B18] py-28 overflow-hidden hex-bg-dark">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-brand-900/35 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-sky-900/15 rounded-full blur-[80px]" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-400 font-semibold text-sm uppercase tracking-widest mb-4 animate-slide-up">Sin excusas, sin riesgos</p>
          <h2 className="animate-slide-up delay-100 text-4xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
            Hoy tu competencia<br />
            está respondiendo reseñas.<br />
            <span className="gradient-text">¿Y tú?</span>
          </h2>
          <p className="animate-slide-up delay-200 text-xl text-white/45 mb-10 max-w-xl mx-auto leading-relaxed">
            Empieza gratis, sin tarjeta de crédito. Si en 30 días no ves el valor, simplemente no activas la suscripción.
          </p>
          <Link
            href="/registro"
            className="animate-scale-in delay-300 group inline-flex items-center gap-2.5 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white font-bold text-lg px-10 py-4 rounded-xl shadow-2xl shadow-brand-950/60 hover:shadow-brand-700/50 transition-all duration-300 hover:-translate-y-1 btn-glow"
          >
            Crear mi cuenta gratis ahora
            <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <p className="mt-5 text-white/20 text-sm animate-fade-in delay-500">30 días gratis · Sin tarjeta · Cancela cuando quieras</p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
