'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signIn('credentials', { email: form.email, password: form.password, redirect: false });
    setLoading(false);
    if (result?.error) setError('Email o contraseña incorrectos. Inténtalo de nuevo.');
    else router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#060B18] hex-bg-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-900/25 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center shadow-lg shadow-brand-900/60">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span className="font-bold text-xl text-white">ReputaciónPro</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Bienvenido de nuevo</h1>
          <p className="text-white/40 mt-1 text-sm">Accede a tu panel de control</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-black/40 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Email" type="email" placeholder="tu@negocio.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required autoComplete="email" />
            <Input label="Contraseña" type="password" placeholder="Tu contraseña" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required autoComplete="current-password" />

            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 rounded-lg p-3 text-sm border border-red-200">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}

            <Button type="submit" size="lg" loading={loading} className="w-full">
              Iniciar sesión
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              ¿No tienes cuenta?{' '}
              <Link href="/registro" className="text-brand-700 font-semibold hover:underline">
                Regístrate gratis
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-white/25 text-xs mt-6">30 días gratis · Sin tarjeta de crédito</p>
      </div>
    </div>
  );
}
