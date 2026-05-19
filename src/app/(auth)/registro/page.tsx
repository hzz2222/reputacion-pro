'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function RegistroPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', businessName: '', businessType: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'El nombre es obligatorio';
    if (!form.email.includes('@')) e.email = 'Introduce un email válido';
    if (!form.businessName.trim()) e.businessName = 'El nombre del negocio es obligatorio';
    if (form.password.length < 8) e.password = 'Mínimo 8 caracteres';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError('');
    try {
      const res = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, businessName: form.businessName, businessType: form.businessType || 'Negocio local', password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setServerError(data.error || 'Error al crear la cuenta'); setLoading(false); return; }
      await signIn('credentials', { email: form.email, password: form.password, redirect: false });
      router.push('/dashboard');
    } catch {
      setServerError('Error de conexión. Inténtalo de nuevo.');
      setLoading(false);
    }
  };

  const businessTypes = ['Restaurante / Bar / Cafetería', 'Clínica / Salud / Bienestar', 'Tienda / Comercio', 'Academia / Formación', 'Hotel / Alojamiento', 'Taller / Reparaciones', 'Peluquería / Estética', 'Inmobiliaria', 'Servicios profesionales', 'Otro'];

  return (
    <div className="min-h-screen bg-[#060B18] hex-bg-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center shadow-lg shadow-brand-900/60">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span className="font-bold text-xl text-white">ReputaciónPro</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Crea tu cuenta gratis</h1>
          <p className="text-white/40 mt-1 text-sm">30 días de prueba · Sin tarjeta de crédito</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-black/40 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Tu nombre" type="text" placeholder="Rosa García" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
              <Input label="Email" type="email" placeholder="tu@negocio.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
            </div>

            <Input label="Nombre del negocio" type="text" placeholder="Restaurante El Rincón" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} error={errors.businessName} />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de negocio</label>
              <select
                className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent bg-white"
                value={form.businessType}
                onChange={(e) => setForm({ ...form, businessType: e.target.value })}
              >
                <option value="">Selecciona el tipo de negocio</option>
                {businessTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Contraseña" type="password" placeholder="Mínimo 8 caracteres" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} />
              <Input label="Confirmar contraseña" type="password" placeholder="Repite la contraseña" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} error={errors.confirmPassword} />
            </div>

            {serverError && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 rounded-lg p-3 text-sm border border-red-200">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {serverError}
              </div>
            )}

            <p className="text-xs text-gray-400">
              Al registrarte aceptas nuestros{' '}
              <Link href="#" className="underline hover:text-gray-600">Términos de uso</Link>{' '}
              y{' '}
              <Link href="#" className="underline hover:text-gray-600">Política de privacidad</Link>.
            </p>

            <Button type="submit" size="lg" loading={loading} className="w-full">
              Crear cuenta gratis
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-brand-700 font-semibold hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
