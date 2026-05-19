'use client';

import { useState } from 'react';
import type { FraudAnalysis } from '@/lib/fraudDetection';

interface FraudBadgeProps {
  analysis: FraudAnalysis;
}

export function FraudBadge({ analysis }: FraudBadgeProps) {
  const [open, setOpen] = useState(false);

  const isHigh = analysis.level === 'high';
  const btnClasses = isHigh
    ? 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100'
    : 'text-orange-500 bg-orange-50 border-orange-200 hover:bg-orange-100';

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className={`inline-flex items-center gap-1 border rounded-full px-2 py-0.5 text-xs font-semibold transition-colors ${btnClasses}`}
      >
        <svg
          className="w-3.5 h-3.5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        Sospechosa
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-20 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg
                className="w-4 h-4 text-orange-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-sm font-bold text-gray-800">Señales detectadas</p>
            </div>

            <ul className="space-y-1.5 mb-3">
              {analysis.signals.map((s) => (
                <li key={s.key} className="flex items-start gap-2 text-xs text-gray-600">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                  {s.label}
                </li>
              ))}
            </ul>

            <p className="text-[10px] text-gray-400 border-t border-gray-100 pt-2.5 leading-relaxed">
              Si confirmas que es falsa, repórtala desde Google My Business para solicitar su eliminación.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
