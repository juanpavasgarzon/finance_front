export function formatNumber(n: number): string {
  if (n == null || isNaN(n)) {
    return "0";
  }

  return Math.round(n).toLocaleString("es-CO");
}

export function formatCurrency(n: number): string {
  if (n == null || isNaN(n)) {
    return "$0";
  }

  const rounded = Math.round(n);

  if (rounded < 0) {
    return `($${Math.abs(rounded).toLocaleString("es-CO")})`;
  }

  return `$${rounded.toLocaleString("es-CO")}`;
}

export function formatPercent(n: number): string {
  return `${(n * 100).toFixed(2)}%`;
}

export function parseNumericInput(s: string | number): number {
  if (typeof s === "number") {
    return s;
  }

  return parseFloat(String(s).replace(/\./g, "").replace(/,/g, ".").replace(/[^0-9.\-]/g, "")) || 0;
}
