'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Badge } from '@/components/ui/Badge';

interface SidebarProps {
  businessName: string;
  userName: string;
  subscriptionStatus: string;
}

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  },
  {
    href: '/resenas',
    label: 'Reseñas',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
  },
  {
    href: '/solicitudes',
    label: 'Solicitudes',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
  },
  {
    href: '/encuestas',
    label: 'Encuestas',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
  },
  {
    href: '/competidores',
    label: 'Competidores',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  },
  {
    href: '/configuracion',
    label: 'Configuración',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
];

const statusLabels: Record<string, { label: string; variant: 'success' | 'warning' | 'info' | 'danger' }> = {
  trialing:  { label: 'Prueba gratuita', variant: 'info' },
  active:    { label: 'Activo',          variant: 'success' },
  past_due:  { label: 'Pago pendiente',  variant: 'warning' },
  canceled:  { label: 'Cancelado',       variant: 'danger' },
};

export function Sidebar({ businessName, userName, subscriptionStatus }: SidebarProps) {
  const pathname = usePathname();
  const status = statusLabels[subscriptionStatus] ?? statusLabels.trialing;

  return (
    <aside className="w-64 flex-shrink-0 bg-[#060B18] flex flex-col min-h-screen border-r border-white/5">
      {/* Logo */}
      <div className="px-5 h-16 flex items-center border-b border-white/5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center shadow-md shadow-brand-950/50">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <span className="font-bold text-white tracking-tight">ReputaciónPro</span>
        </Link>
      </div>

      {/* Business card */}
      <div className="px-4 py-4 border-b border-white/5">
        <div className="flex items-center gap-3 px-3 py-2.5 bg-white/5 rounded-xl">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-700 to-brand-900 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {businessName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{businessName}</p>
            <p className="text-xs text-white/60 truncate">{userName}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-brand-900/70 text-brand-300 border border-brand-800/50'
                  : 'text-white/50 hover:bg-white/5 hover:text-white/80'
              }`}
            >
              <span className={active ? 'text-brand-400' : 'text-white/30'}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-4 py-4 border-t border-white/5 space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-white/30">Suscripción</span>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
        {subscriptionStatus === 'trialing' && (
          <Link
            href="/configuracion"
            className="block w-full text-center bg-gradient-to-r from-brand-700 to-brand-800 text-white text-xs font-semibold py-2 rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all"
          >
            Activar suscripción
          </Link>
        )}
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/30 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
