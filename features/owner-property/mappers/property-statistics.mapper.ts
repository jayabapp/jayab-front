type PropertyViewStat = { date: string | Date; view_count: number };

export const toDailyViewSeries = (statistics?: PropertyViewStat[] | null) => {
  if (!statistics?.length) return [];

  const counts = new Map<string, number>();
  for (const entry of statistics) {
    const key = new Date(entry.date).toISOString().split("T")[0];
    counts.set(key, entry.view_count);
  }

  const days = Array.from(counts.keys()).map((day) => new Date(day));
  const from = new Date(Math.min(...days.map((day) => day.getTime())));
  const to = new Date(Math.max(...days.map((day) => day.getTime())));

  const series: { date: Date; name: string; value: number }[] = [];
  for (let day = new Date(from); day <= to; day.setDate(day.getDate() + 1)) {
    const key = day.toISOString().split("T")[0];
    series.push({
      date: new Date(day),
      name: key,
      value: counts.get(key) ?? 0,
    });
  }
  return series;
};
