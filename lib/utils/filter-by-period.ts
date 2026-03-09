export type TimePeriod = "daily" | "monthly" | "yearly" | "all";

export function filterByPeriod<T extends { paidAt: string | null; dueDate: string | null; createdAt: string }>(
  items: Array<T>,
  period: TimePeriod,
  referenceDate: Date,
): Array<T> {
  return items.filter((item) => {
    const d = new Date(item.paidAt || item.dueDate || item.createdAt);

    if (period === "all") {
      return true;
    }

    if (period === "yearly") {
      return d.getFullYear() === referenceDate.getFullYear();
    }

    if (period === "monthly") {
      return d.getFullYear() === referenceDate.getFullYear() && d.getMonth() === referenceDate.getMonth();
    }

    return d.toISOString().slice(0, 10) === referenceDate.toISOString().slice(0, 10);
  });
}
