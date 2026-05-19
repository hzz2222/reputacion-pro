interface WordEntry {
  word: string;
  count: number;
}

interface WordAnalysisProps {
  positiveWords: WordEntry[];
  negativeWords: WordEntry[];
  totalPositive: number;
  totalNegative: number;
}

function WordTag({
  word,
  count,
  maxCount,
  variant,
}: {
  word: string;
  count: number;
  maxCount: number;
  variant: 'positive' | 'negative';
}) {
  const ratio = maxCount > 0 ? count / maxCount : 0;
  const tier = ratio >= 0.6 ? 'lg' : ratio >= 0.3 ? 'md' : 'sm';

  const sizeClass =
    tier === 'lg'
      ? 'text-sm font-bold px-3 py-1.5'
      : tier === 'md'
        ? 'text-xs font-semibold px-2.5 py-1.5'
        : 'text-xs font-medium px-2.5 py-1';

  const colorClass =
    variant === 'positive'
      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 ring-emerald-100'
      : 'bg-red-50 text-red-800 border-red-200 ring-red-100';

  const dotClass = variant === 'positive' ? 'bg-emerald-400' : 'bg-red-400';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${sizeClass} ${colorClass} transition-all hover:ring-2`}
      title={`Mencionada ${count} ${count === 1 ? 'vez' : 'veces'}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotClass}`} />
      {word}
      <span className="opacity-50 text-[10px] font-normal">{count}</span>
    </span>
  );
}

function EmptyState({ variant }: { variant: 'positive' | 'negative' }) {
  return (
    <p className="text-xs text-gray-400 italic">
      {variant === 'positive'
        ? 'No hay suficientes reseñas positivas para analizar.'
        : 'No hay reseñas negativas. ¡Excelente!'}
    </p>
  );
}

export function WordAnalysis({
  positiveWords,
  negativeWords,
  totalPositive,
  totalNegative,
}: WordAnalysisProps) {
  const maxPositive = positiveWords[0]?.count ?? 1;
  const maxNegative = negativeWords[0]?.count ?? 1;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-sm leading-none">Palabras más repetidas</h2>
            <p className="text-xs text-gray-400 mt-0.5">Análisis de todas las reseñas recibidas</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            {totalPositive} positivas
          </span>
          <span className="text-gray-200">·</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
            {totalNegative} negativas
          </span>
        </div>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {/* Positive */}
        <div className="px-6 py-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 flex-shrink-0" />
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
              Reseñas positivas · 4-5 ⭐
            </span>
          </div>
          {positiveWords.length === 0 ? (
            <EmptyState variant="positive" />
          ) : (
            <div className="flex flex-wrap gap-2">
              {positiveWords.map(({ word, count }) => (
                <WordTag
                  key={word}
                  word={word}
                  count={count}
                  maxCount={maxPositive}
                  variant="positive"
                />
              ))}
            </div>
          )}
        </div>

        {/* Negative */}
        <div className="px-6 py-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 flex-shrink-0" />
            <span className="text-xs font-semibold text-red-700 uppercase tracking-wide">
              Reseñas negativas · 1-2 ⭐
            </span>
          </div>
          {negativeWords.length === 0 ? (
            <EmptyState variant="negative" />
          ) : (
            <div className="flex flex-wrap gap-2">
              {negativeWords.map(({ word, count }) => (
                <WordTag
                  key={word}
                  word={word}
                  count={count}
                  maxCount={maxNegative}
                  variant="negative"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
