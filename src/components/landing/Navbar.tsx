'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-[#060B18]/95 backdrop-blur-xl shadow-lg shadow-black/30 border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-900/40 group-hover:shadow-brand-600/50 transition-shadow duration-300">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span className="font-bold text-lg text-white tracking-tight">ReputaciónPro</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              ['#funcionalidades', 'Funcionalidades'],
              ['#como-funciona', 'Cómo funciona'],
              ['#precios', 'Precios'],
              ['#faq', 'FAQ'],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="text-sm font-medium text-white/55 hover:text-white transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-brand-400 after:transition-all after:duration-300 hover:after:w-full"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-white/55 hover:text-white transition-colors duration-200 px-3 py-1.5"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/registro"
              className="bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-brand-900/40 hover:shadow-brand-600/40 hover:-translate-y-px"
            >
              Empezar gratis
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            <svg className="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-spring ${
          menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-[#060B18]/98 backdrop-blur-xl border-t border-white/5 px-4 py-4 space-y-1">
          {[
            ['#funcionalidades', 'Funcionalidades'],
            ['#como-funciona', 'Cómo funciona'],
            ['#precios', 'Precios'],
            ['#faq', 'FAQ'],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block text-sm font-medium text-white/65 hover:text-white py-2.5 px-2 rounded-lg hover:bg-white/5 transition-all duration-200"
            >
              {label}
            </a>
          ))}
          <div className="pt-3 border-t border-white/5 flex flex-col gap-2">
            <Link href="/login" className="text-sm font-medium text-white/60 py-2 px-2 hover:text-white transition-colors">
              Iniciar sesión
            </Link>
            <Link
              href="/registro"
              className="bg-gradient-to-r from-brand-600 to-brand-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl text-center hover:from-brand-500 hover:to-brand-600 transition-all"
            >
              Empezar gratis →
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
