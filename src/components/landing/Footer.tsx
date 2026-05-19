import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#040810] text-white/40 hex-bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="font-bold text-lg text-white/75 group-hover:text-white transition-colors duration-200">ReputaciónPro</span>
            </Link>
            <p className="text-white/30 leading-relaxed text-sm max-w-xs">
              La herramienta de reputación online para negocios locales que quieren crecer en Google sin perder tiempo.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-white/60 font-semibold mb-4 text-sm">Producto</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                ['#funcionalidades', 'Por qué importa'],
                ['#como-funciona', 'Cómo funciona'],
                ['#precios', 'Precio'],
                ['#faq', 'Preguntas frecuentes'],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="hover:text-white/70 transition-colors duration-200">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="text-white/60 font-semibold mb-4 text-sm">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                ['Aviso legal', '#'],
                ['Política de privacidad', '#'],
                ['Política de cookies', '#'],
                ['Términos de uso', '#'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="hover:text-white/70 transition-colors duration-200">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm">© {new Date().getFullYear()} ReputaciónPro. Todos los derechos reservados.</p>
          <p className="text-xs text-white/20">Hecho para negocios locales en España 🇪🇸</p>
        </div>
      </div>
    </footer>
  );
}
