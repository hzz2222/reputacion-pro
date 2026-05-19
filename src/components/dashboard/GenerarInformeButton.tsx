'use client';

import { useState } from 'react';

interface ReportData {
  businessName: string;
  month: string;
  prevMonthLabel: string;
  generatedAt: string;
  stats: {
    totalReviews: number;
    avgRating: number;
    responseRate: number;
    newThisMonth: number;
    newLastMonth: number;
    avgRatingThisMonth: number | null;
    avgRatingLastMonth: number | null;
    responseRateLastMonth: number;
  };
  topWords: { word: string; count: number }[];
  monthly: { month: string; count: number; avgRating: number }[];
  topReviews: { author: string; rating: number; text: string; date: string }[];
}

type RGB = [number, number, number];
const BRAND:   RGB = [37, 99, 235];
const EMERALD: RGB = [5, 150, 105];
const AMBER:   RGB = [217, 119, 6];
const RED:     RGB = [220, 38, 38];
const GRAY:    RGB = [107, 114, 128];
const LIGHT:   RGB = [249, 250, 251];

function delta(now: number | null, prev: number | null): string {
  if (now === null || prev === null) return '—';
  const d = now - prev;
  return (d >= 0 ? '+' : '') + d.toFixed(1);
}
function deltaColor(now: number | null, prev: number | null, higherIsBetter = true): readonly [number,number,number] {
  if (now === null || prev === null) return GRAY;
  const better = higherIsBetter ? now >= prev : now <= prev;
  return better ? EMERALD : RED;
}

async function buildPdf(data: ReportData) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

  const W = 210;
  const ML = 16; // margin left
  const MR = 16; // margin right
  const CW = W - ML - MR; // content width

  /* ── PAGE 1 ─────────────────────────────────── */

  // ─── Header strip ───
  doc.setFillColor(...BRAND);
  doc.rect(0, 0, W, 28, 'F');

  // Star icon (circle placeholder)
  doc.setFillColor(255, 255, 255, 0.2);
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.4);
  doc.circle(ML + 4.5, 14, 4.5);
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text('★', ML + 2.5, 15.3);

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('ReputaciónPro', ML + 11, 12);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Informe Mensual de Reputación', ML + 11, 18.5);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(data.month, W - MR, 14, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`Generado el ${data.generatedAt}`, W - MR, 20, { align: 'right' });

  // ─── Business name ───
  let y = 36;
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text(data.businessName, ML, y);
  y += 9;

  // ─── KPI cards (4 in a row) ───
  const cardW = (CW - 9) / 4;
  const cardH = 22;
  const kpis = [
    { label: 'Total reseñas', value: String(data.stats.totalReviews), sub: 'en Google', color: BRAND },
    { label: 'Puntuación media', value: `${data.stats.avgRating.toFixed(1)} ★`, sub: 'sobre 5', color: AMBER },
    { label: 'Tasa de respuesta', value: `${data.stats.responseRate}%`, sub: 'respondidas', color: EMERALD },
    { label: 'Nuevas este mes', value: String(data.stats.newThisMonth), sub: `${data.stats.newLastMonth} el mes anterior`, color: BRAND },
  ];

  kpis.forEach(({ label, value, sub, color }, i) => {
    const x = ML + i * (cardW + 3);
    doc.setFillColor(...LIGHT);
    doc.roundedRect(x, y, cardW, cardH, 2, 2, 'F');
    doc.setDrawColor(...color);
    doc.setLineWidth(0.6);
    doc.line(x, y + cardH - 0.3, x + cardW, y + cardH - 0.3);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...color);
    doc.text(value, x + cardW / 2, y + 11, { align: 'center' });

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(55, 65, 81);
    doc.text(label.toUpperCase(), x + cardW / 2, y + 4.5, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...GRAY);
    doc.text(sub, x + cardW / 2, y + 18.5, { align: 'center' });
  });
  y += cardH + 9;

  // ─── Month-over-month comparison ───
  doc.setFillColor(239, 246, 255);
  doc.roundedRect(ML, y, CW, 18, 2, 2, 'F');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text(`COMPARATIVA CON ${data.prevMonthLabel.toUpperCase()}`, ML + 4, y + 5.5);

  const comparisons = [
    {
      label: 'Reseñas nuevas',
      now: data.stats.newThisMonth,
      prev: data.stats.newLastMonth,
      unit: '',
      higher: true,
    },
    {
      label: 'Puntuación media',
      now: data.stats.avgRatingThisMonth,
      prev: data.stats.avgRatingLastMonth,
      unit: '★',
      higher: true,
    },
    {
      label: 'Tasa de respuesta',
      now: data.stats.responseRate,
      prev: data.stats.responseRateLastMonth,
      unit: '%',
      higher: true,
    },
  ];

  const colW = CW / 3;
  comparisons.forEach(({ label, now, prev, unit, higher }, i) => {
    const x = ML + i * colW + colW / 2;
    const d = delta(now, prev);
    const col = deltaColor(now, prev, higher);
    const arrow = now !== null && prev !== null ? (now >= prev ? '▲' : '▼') : '';

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...GRAY);
    doc.text(label, x, y + 10, { align: 'center' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...col);
    doc.text(`${arrow} ${d}${unit}`, x, y + 15.5, { align: 'center' });
  });
  y += 18 + 9;

  // ─── Most mentioned words ───
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('PALABRAS MÁS MENCIONADAS POR CLIENTES', ML, y);
  y += 5;

  const maxCount = data.topWords[0]?.count ?? 1;
  const barMaxW = CW * 0.52;
  const barH = 5.5;
  const rowGap = 1.5;
  const labelColW = 36;
  const countColX = ML + labelColW + barMaxW + 4;

  data.topWords.forEach(({ word, count }, i) => {
    const rowY = y + i * (barH + rowGap);
    const barW = (count / maxCount) * barMaxW;

    // Alternating row bg
    if (i % 2 === 0) {
      doc.setFillColor(...LIGHT);
      doc.rect(ML, rowY, CW, barH + rowGap, 'F');
    }

    doc.setFontSize(7);
    doc.setFont('helvetica', i < 3 ? 'bold' : 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text(word.charAt(0).toUpperCase() + word.slice(1), ML + 2, rowY + 4);

    const barColors: Array<readonly [number,number,number]> = [BRAND, BRAND, BRAND, [96, 165, 250], [96, 165, 250], [147, 197, 253], [147, 197, 253], [191, 219, 254]];
    doc.setFillColor(...barColors[i] ?? LIGHT);
    doc.roundedRect(ML + labelColW, rowY + 1, barW, barH - 2, 1, 1, 'F');

    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BRAND);
    doc.text(String(count), countColX, rowY + 4);
  });

  y += data.topWords.length * (barH + rowGap) + 9;

  /* ── PAGE 2 ─────────────────────────────────── */
  doc.addPage();
  y = 20;

  // Header strip page 2
  doc.setFillColor(...BRAND);
  doc.rect(0, 0, W, 12, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('ReputaciónPro — Informe Mensual', ML, 8);
  doc.setFont('helvetica', 'normal');
  doc.text(data.businessName, W - MR, 8, { align: 'right' });

  // ─── Evolution chart ───
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('EVOLUCIÓN MENSUAL (ÚLTIMOS 6 MESES)', ML, y);
  y += 5;

  const chartH = 52;
  const chartW = CW;
  const chartX = ML;
  const chartY = y;

  // Chart background
  doc.setFillColor(...LIGHT);
  doc.roundedRect(chartX, chartY, chartW, chartH, 2, 2, 'F');
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.2);

  const maxVal = Math.max(...data.monthly.map((m) => m.count), 1);
  const plotH = chartH - 14; // reserve bottom for labels
  const plotY = chartY + 4;
  const barGroupW = chartW / data.monthly.length;

  // Horizontal grid lines (3 lines)
  for (let g = 1; g <= 3; g++) {
    const gy = plotY + plotH - (g / 3) * plotH;
    doc.setDrawColor(229, 231, 235);
    doc.line(chartX + 4, gy, chartX + chartW - 4, gy);
    doc.setFontSize(5.5);
    doc.setTextColor(...GRAY);
    doc.text(String(Math.round((maxVal * g) / 3)), chartX + 1, gy + 1);
  }

  data.monthly.forEach(({ month, count }, i) => {
    const bx = chartX + i * barGroupW + barGroupW * 0.25;
    const bw = barGroupW * 0.5;
    const bh = count > 0 ? (count / maxVal) * plotH : 1;
    const by = plotY + plotH - bh;

    // Bar
    doc.setFillColor(...BRAND);
    doc.roundedRect(bx, by, bw, bh, 1, 1, 'F');

    // Count label above bar
    if (count > 0) {
      doc.setFontSize(6);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...BRAND);
      doc.text(String(count), bx + bw / 2, by - 1.5, { align: 'center' });
    }

    // Month label below
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 65, 81);
    doc.text(month.charAt(0).toUpperCase() + month.slice(1), chartX + i * barGroupW + barGroupW / 2, chartY + chartH - 3, { align: 'center' });
  });

  y += chartH + 9;

  // ─── Top reviews ───
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('RESEÑAS DESTACADAS', ML, y);
  y += 5;

  data.topReviews.forEach(({ author, rating, text, date }) => {
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    const cardHeight = 22;

    doc.setFillColor(...LIGHT);
    doc.roundedRect(ML, y, CW, cardHeight, 2, 2, 'F');
    doc.setDrawColor(...BRAND);
    doc.setLineWidth(0.5);
    doc.line(ML, y + 2, ML, y + cardHeight - 2);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(author, ML + 4, y + 6);

    doc.setFontSize(8);
    doc.setTextColor(245, 158, 11);
    doc.text(stars, ML + 4, y + 12);

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    const lines = doc.splitTextToSize(`"${text}"`, CW - 8) as string[];
    doc.text(lines.slice(0, 2), ML + 4, y + 17.5);

    doc.setFontSize(6);
    doc.setTextColor(...GRAY);
    doc.text(date, W - MR, y + 6, { align: 'right' });

    y += cardHeight + 4;
  });

  // ─── Footer ───
  const footerY = 290;
  doc.setFillColor(248, 250, 252);
  doc.rect(0, footerY - 2, W, 297 - footerY + 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(0, footerY - 2, W, footerY - 2);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GRAY);
  doc.text(`Generado con ReputaciónPro · ${data.generatedAt}`, ML, footerY + 3);
  doc.text('Página 2 / 2', W - MR, footerY + 3, { align: 'right' });

  // Footer page 1
  doc.setPage(1);
  doc.setFillColor(248, 250, 252);
  doc.rect(0, footerY - 2, W, 297 - footerY + 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(0, footerY - 2, W, footerY - 2);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GRAY);
  doc.text(`Generado con ReputaciónPro · ${data.generatedAt}`, ML, footerY + 3);
  doc.text('Página 1 / 2', W - MR, footerY + 3, { align: 'right' });

  const filename = `informe-${data.month.toLowerCase().replace(/\s+/g, '-')}-${data.businessName.toLowerCase().replace(/\s+/g, '-')}.pdf`;
  doc.save(filename);
}

export function GenerarInformeButton() {
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleClick = async () => {
    setState('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/informes/mensual');
      if (!res.ok) throw new Error('Error al obtener los datos');
      const data: ReportData = await res.json();
      await buildPdf(data);
      setState('idle');
    } catch (e) {
      setState('error');
      setErrorMsg(e instanceof Error ? e.message : 'Error inesperado');
      setTimeout(() => setState('idle'), 4000);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={state === 'loading'}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all
          bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300
          disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        {state === 'loading' ? (
          <>
            <svg className="animate-spin w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generando PDF…
          </>
        ) : (
          <>
            <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Informe PDF
          </>
        )}
      </button>

      {state === 'error' && (
        <div className="absolute top-full mt-2 right-0 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-sm z-10">
          {errorMsg}
        </div>
      )}
    </div>
  );
}
