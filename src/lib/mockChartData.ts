export interface MonthlyDataPoint {
  month: string;
  nuevas: number;
  respondidas: number;
}

export function getMockMonthlyData(): MonthlyDataPoint[] {
  const now = new Date();
  const counts =    [3, 4, 5, 6, 7, 8];
  const replied =   [1, 2, 3, 5, 6, 7];

  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      month: d.toLocaleDateString('es-ES', { month: 'short' }),
      nuevas: counts[i],
      respondidas: replied[i],
    };
  });
}
