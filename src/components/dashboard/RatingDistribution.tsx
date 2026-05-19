interface Props {
  distribution: Record<number, number>;
  total: number;
  avgRating: number;
}

const barColors: Record<number, string> = {
  5: 'bg-emerald-400',
  4: 'bg-emerald-300',
  3: 'bg-amber-400',
  2: 'bg-orange-400',
  1: 'bg-red-400',
};

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`w-4 h-4 ${filled ? 'text-amber-400' : 'text-gray-200'}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export function RatingDistribution({ distribution, total, avgRating }: Props) {
  const rounded = Math.round(avgRating);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full flex flex-col">
      <h2 className="font-bold text-gray-900 mb-0.5">Distribución</h2>
      <p className="text-xs text-gray-400 mb-5">Desglose por estrellas</p>

      {/* Average summary */}
      <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
        <span className="text-4xl font-extrabold text-gray-900 leading-none">
          {avgRating.toFixed(1)}
        </span>
        <div>
          <div className="flex gap-0.5 mb-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <StarIcon key={s} filled={s <= rounded} />
            ))}
          </div>
          <p className="text-xs text-gray-400">{total} reseñas en total</p>
        </div>
      </div>

      {/* Bars */}
      <div className="space-y-3 flex-1">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = distribution[star] ?? 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={star} className="flex items-center gap-2.5">
              <span className="text-xs font-semibold text-gray-500 w-3 text-right">{star}</span>
              <svg className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${barColors[star]} rounded-full transition-all duration-700`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 w-4 text-right">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
