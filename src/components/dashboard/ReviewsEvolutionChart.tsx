'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { MonthlyDataPoint } from '@/lib/mockChartData';

export function ReviewsEvolutionChart({ data }: { data: MonthlyDataPoint[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-bold text-gray-900">Evolución de reseñas</h2>
          <p className="text-xs text-gray-400 mt-0.5">Últimos 6 meses</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
            Recibidas
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            Respondidas
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="gradNuevas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradRespondidas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              fontSize: '13px',
              padding: '8px 14px',
            }}
            itemStyle={{ color: '#374151', paddingBottom: '2px' }}
            labelStyle={{ color: '#6b7280', fontWeight: 600, marginBottom: '4px' }}
          />
          <Area
            type="monotone"
            dataKey="nuevas"
            name="Recibidas"
            stroke="#2563eb"
            strokeWidth={2.5}
            fill="url(#gradNuevas)"
            dot={{ fill: '#2563eb', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="respondidas"
            name="Respondidas"
            stroke="#34d399"
            strokeWidth={2.5}
            fill="url(#gradRespondidas)"
            dot={{ fill: '#34d399', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
