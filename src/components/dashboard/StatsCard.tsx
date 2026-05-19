interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  color?: 'brand' | 'amber' | 'emerald' | 'red' | 'violet';
  progress?: number;
  highlight?: boolean;
}

const iconColors = {
  brand:   'bg-brand-50 text-brand-600',
  amber:   'bg-amber-50 text-amber-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  red:     'bg-red-50 text-red-600',
  violet:  'bg-violet-50 text-violet-600',
};

const barColors = {
  brand:   'bg-brand-500',
  amber:   'bg-amber-400',
  emerald: 'bg-emerald-400',
  red:     'bg-red-400',
  violet:  'bg-violet-400',
};

export function StatsCard({
  title,
  value,
  description,
  icon,
  color = 'brand',
  progress,
  highlight,
}: StatsCardProps) {
  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-6 flex flex-col gap-4 transition-all ${
      highlight ? 'border-brand-200 ring-1 ring-brand-100' : 'border-gray-100'
    }`}>
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl ${iconColors[color]} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        {progress !== undefined && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            progress >= 80 ? 'bg-emerald-50 text-emerald-700' :
            progress >= 50 ? 'bg-amber-50 text-amber-700' :
            'bg-red-50 text-red-700'
          }`}>
            {progress}%
          </span>
        )}
      </div>

      <div>
        <div className="text-3xl font-extrabold text-gray-900 leading-none mb-1">{value}</div>
        <div className="text-sm font-medium text-gray-500">{title}</div>
        {description && <div className="text-xs text-gray-400 mt-0.5">{description}</div>}
      </div>

      {progress !== undefined && (
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden -mt-1">
          <div
            className={`h-full ${barColors[color]} rounded-full transition-all duration-700`}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
}
