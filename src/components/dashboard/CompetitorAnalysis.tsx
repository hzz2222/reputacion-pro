'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Entity {
  name: string;
  label: string;
  rating: number;
  reviewCount: number;
  monthly: number[];
  color: string;
  isOwn: boolean;
}

interface Props {
  businessName: string;
  userId: string;
  ownRating: number;
  ownReviewCount: number;
  ownMonthly: number[];
  isMockData: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const COLORS = ['#2563eb', '#7c3aed', '#059669', '#d97706'] as const;
const STORAGE_PREFIX = 'rp_competitors_';

const MONTH_ABBR = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

// ─── Deterministic mock data from competitor name ─────────────────────────────

function fnv32(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(h ^ s.charCodeAt(i), 16777619)) >>> 0;
  }
  return h;
}

function buildCompetitor(name: string): { rating: number; reviewCount: number; monthly: number[] } {
  const h1 = fnv32(name);
  const h2 = fnv32(name + '_r');
  const rating      = parseFloat((3.1 + (h1 % 170) / 100).toFixed(1));
  const reviewCount = 30 + (h2 % 450);
  const base        = 3 + (h1 % 9);
  const monthly     = Array.from({ length: 6 }, (_, i) =>
    Math.max(0, base + ((fnv32(name + i) % 9) - 4)),
  );
  return { rating, reviewCount, monthly };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < full ? 'text-amber-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

// ─── SVG Line Chart ──────────────────────────────────────────────────────────

const CW = 560; // canvas width
const CH = 170; // canvas height
const PL = 36; const PR = 16; const PT = 16; const PB = 34;
const PW = CW - PL - PR;
const PH = CH - PT - PB;

function getMonthLabels() {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return MONTH_ABBR[d.getMonth()];
  });
}

function LineChart({ series }: { series: Array<{ label: string; color: string; data: number[] }> }) {
  const labels  = getMonthLabels();
  const allVals = series.flatMap((s) => s.data);
  const maxV    = Math.max(...allVals, 1);
  const yTicks  = Array.from(new Set([0, Math.ceil(maxV / 2), maxV]));

  const xOf = (i: number) => PL + (i / 5) * PW;
  const yOf = (v: number) => PT + PH - (v / maxV) * PH;
  const pts  = (data: number[]) => data.map((v, i) => `${xOf(i)},${yOf(v)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full" style={{ height: CH }}>
      {/* Horizontal grid lines */}
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={PL} y1={yOf(t)} x2={CW - PR} y2={yOf(t)} stroke="#f1f5f9" strokeWidth="1" />
          <text x={PL - 6} y={yOf(t) + 4} fontSize="10" fill="#94a3b8" textAnchor="end">
            {t}
          </text>
        </g>
      ))}

      {/* X axis labels */}
      {labels.map((m, i) => (
        <text key={m} x={xOf(i)} y={CH - 6} fontSize="10" fill="#94a3b8" textAnchor="middle">
          {m}
        </text>
      ))}

      {/* Series lines + dots */}
      {series.map(({ label, color, data }) => (
        <g key={label}>
          <polyline
            points={pts(data)}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {data.map((v, i) => (
            <circle
              key={i}
              cx={xOf(i)}
              cy={yOf(v)}
              r="4"
              fill={color}
              stroke="white"
              strokeWidth="2"
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

// ─── Setup form ──────────────────────────────────────────────────────────────

function SetupForm({
  initialValues,
  canCancel,
  onSave,
  onCancel,
}: {
  initialValues: string[];
  canCancel: boolean;
  onSave: (names: string[]) => void;
  onCancel: () => void;
}) {
  const [inputs, setInputs] = useState<string[]>(
    [...initialValues, '', '', ''].slice(0, 3),
  );

  function set(i: number, v: string) {
    setInputs((prev) => { const n = [...prev]; n[i] = v; return n; });
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-lg">
      <h2 className="font-bold text-gray-900 mb-1">¿Quiénes son tus competidores?</h2>
      <p className="text-sm text-gray-500 mb-5">
        Introduce el nombre tal como aparece en Google Maps (hasta 3).
      </p>

      <div className="space-y-3 mb-6">
        {([
          ['Competidor 1', 'Ej: Bar El Rincón'],
          ['Competidor 2 (opcional)', 'Ej: Restaurante La Fuente'],
          ['Competidor 3 (opcional)', 'Ej: Café Central'],
        ] as [string, string][]).map(([label, placeholder], i) => (
          <Input
            key={i}
            label={label}
            placeholder={placeholder}
            value={inputs[i]}
            onChange={(e) => set(i, e.target.value)}
          />
        ))}
      </div>

      <div className="flex gap-3">
        {canCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button
          onClick={() => onSave(inputs.map((s) => s.trim()).filter(Boolean))}
          disabled={!inputs.some((s) => s.trim())}
        >
          Ver comparativa
        </Button>
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function CompetitorAnalysis({
  businessName,
  userId,
  ownRating,
  ownReviewCount,
  ownMonthly,
  isMockData,
}: Props) {
  const [mounted,  setMounted]  = useState(false);
  const [editing,  setEditing]  = useState(false);
  const [savedNames, setSavedNames] = useState<string[]>([]);

  const storageKey = STORAGE_PREFIX + userId;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        setSavedNames(JSON.parse(raw) as string[]);
      } else {
        setEditing(true);
      }
    } catch {
      setEditing(true);
    }
    setMounted(true);
  }, [storageKey]);

  function handleSave(names: string[]) {
    if (!names.length) return;
    setSavedNames(names);
    localStorage.setItem(storageKey, JSON.stringify(names));
    setEditing(false);
  }

  function handleEdit() {
    setEditing(true);
  }

  if (!mounted) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded-lg" />
        <div className="h-4 w-80 bg-gray-100 rounded-lg" />
        <div className="h-48 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  // ── Build entities ───────────────────────────────────────────────────────
  const entities: Entity[] = [
    {
      name: businessName,
      label: 'Tu negocio',
      rating: ownRating,
      reviewCount: ownReviewCount,
      monthly: ownMonthly,
      color: COLORS[0],
      isOwn: true,
    },
    ...savedNames.map((name, i) => {
      const mock = buildCompetitor(name);
      return {
        name,
        label: name,
        ...mock,
        color: COLORS[i + 1] ?? COLORS[3],
        isOwn: false,
      };
    }),
  ];

  const maxReviews = Math.max(...entities.map((e) => e.reviewCount), 1);

  const gridClass =
    entities.length <= 2 ? 'grid-cols-1 sm:grid-cols-2' :
    entities.length === 3 ? 'grid-cols-2 sm:grid-cols-3' :
    'grid-cols-2 sm:grid-cols-4';

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Análisis competitivo</h1>
          <p className="text-gray-500 mt-1">
            Compara tu reputación online con la de tu competencia
          </p>
        </div>

        {!editing && (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar competidores
          </button>
        )}
      </div>

      {/* ── Banners ────────────────────────────────────────────────────── */}
      {isMockData && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-4 py-2.5 rounded-xl">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Tus datos son de demostración. Conecta Google My Business en Configuración para ver datos reales.
        </div>
      )}

      <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium px-4 py-2.5 rounded-xl">
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Los datos de competidores son estimaciones orientativas. Próximamente conectaremos con Google Places API para cifras en tiempo real.
      </div>

      {/* ── Setup form ─────────────────────────────────────────────────── */}
      {editing && (
        <SetupForm
          initialValues={savedNames}
          canCancel={savedNames.length > 0}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />
      )}

      {/* ── Comparison (only when not editing and competitors are set) ─── */}
      {!editing && savedNames.length > 0 && (
        <>
          {/* Summary cards */}
          <div className={`grid gap-4 ${gridClass}`}>
            {entities.map((e) => (
              <div
                key={e.name}
                className={`bg-white rounded-2xl border shadow-sm p-5 ${
                  e.isOwn ? 'border-brand-200 ring-1 ring-brand-100' : 'border-gray-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: e.color }}
                  />
                  <span
                    className={`text-xs font-semibold uppercase tracking-wide ${
                      e.isOwn ? 'text-brand-600' : 'text-gray-400'
                    }`}
                  >
                    {e.isOwn ? 'Tu negocio' : 'Competidor'}
                  </span>
                </div>
                <p className="text-sm font-bold text-gray-800 truncate mb-3" title={e.name}>
                  {e.name}
                </p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-extrabold text-gray-900">
                    {e.rating.toFixed(1)}
                  </span>
                  <span className="text-gray-400 text-sm">/5</span>
                </div>
                <Stars rating={e.rating} />
                <p className="text-xs text-gray-400 mt-2">
                  {e.reviewCount} reseña{e.reviewCount !== 1 ? 's' : ''}
                </p>
              </div>
            ))}
          </div>

          {/* Rating comparison */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-5">Valoración media</h2>
            <div className="space-y-4">
              {entities.map((e) => (
                <div key={e.name} className="flex items-center gap-3">
                  <span className="w-28 text-sm font-medium text-gray-600 truncate flex-shrink-0">
                    {e.isOwn ? 'Tu negocio' : e.name}
                  </span>
                  <div className="flex-1 h-7 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(e.rating / 5) * 100}%`,
                        backgroundColor: e.color,
                        opacity: e.isOwn ? 1 : 0.72,
                      }}
                    />
                  </div>
                  <span className="w-8 text-sm font-bold text-gray-800 text-right flex-shrink-0">
                    {e.rating.toFixed(1)}
                  </span>
                  <Stars rating={e.rating} />
                </div>
              ))}
            </div>
          </div>

          {/* Review count comparison */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-5">Número de reseñas</h2>
            <div className="space-y-4">
              {entities.map((e) => (
                <div key={e.name} className="flex items-center gap-3">
                  <span className="w-28 text-sm font-medium text-gray-600 truncate flex-shrink-0">
                    {e.isOwn ? 'Tu negocio' : e.name}
                  </span>
                  <div className="flex-1 h-7 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full flex items-center justify-end px-2 transition-all duration-700"
                      style={{
                        width: `${Math.max(4, (e.reviewCount / maxReviews) * 100)}%`,
                        backgroundColor: e.color,
                        opacity: e.isOwn ? 1 : 0.72,
                      }}
                    />
                  </div>
                  <span className="w-12 text-sm font-bold text-gray-800 text-right flex-shrink-0">
                    {e.reviewCount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly evolution */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
              <h2 className="font-bold text-gray-900">Evolución mensual de reseñas</h2>
              <div className="flex items-center gap-4 flex-wrap">
                {entities.map((e) => (
                  <div key={e.name} className="flex items-center gap-1.5">
                    <span
                      className="w-5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: e.color }}
                    />
                    <span className="text-xs text-gray-500 font-medium truncate max-w-[100px]">
                      {e.isOwn ? 'Tu negocio' : e.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <LineChart
              series={entities.map((e) => ({
                label: e.label,
                color: e.color,
                data:  e.monthly,
              }))}
            />
            <p className="text-xs text-gray-400 mt-3 text-center">
              Nuevas reseñas por mes — últimos 6 meses
            </p>
          </div>
        </>
      )}
    </div>
  );
}
