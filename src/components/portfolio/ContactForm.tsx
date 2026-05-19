'use client';

import { useState } from 'react';

type FormState = 'idle' | 'sending' | 'sent';

export function ContactForm() {
  const [state, setState] = useState<FormState>('idle');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  function validate() {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = 'Introduce tu nombre';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email no válido';
    if (!form.message.trim() || form.message.length < 10) e.message = 'Escribe al menos 10 caracteres';
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setState('sending');

    const subject = encodeURIComponent(`Contacto portfolio — ${form.name}`);
    const body = encodeURIComponent(`Nombre: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:hzzbussines@gmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => setState('sent'), 800);
  }

  if (state === 'sent') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="font-bold text-gray-900 text-lg">¡Mensaje enviado!</p>
          <p className="text-gray-500 text-sm mt-1">Te responderé en menos de 24 horas.</p>
        </div>
        <button
          onClick={() => { setState('idle'); setForm({ name: '', email: '', message: '' }); }}
          className="text-sm text-brand-600 hover:underline"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre</label>
        <input
          type="text"
          placeholder="Tu nombre"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className={`w-full px-4 py-3 rounded-xl border text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
        <input
          type="email"
          placeholder="tu@email.com"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className={`w-full px-4 py-3 rounded-xl border text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
        />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Mensaje</label>
        <textarea
          rows={4}
          placeholder="Cuéntame en qué puedo ayudarte..."
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          className={`w-full px-4 py-3 rounded-xl border text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow resize-none ${errors.message ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
        />
        {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={state === 'sending'}
        className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-md shadow-brand-200 hover:shadow-brand-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
      >
        {state === 'sending' ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Enviando…
          </>
        ) : (
          <>
            Enviar mensaje
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
