import type { Locale } from "./dictionaries";

const tags: Record<Locale, string> = { en: "en-US", pt: "pt-BR" };

export function createFormatters(lang: Locale) {
  const tag = tags[lang];
  const money = new Intl.NumberFormat(tag, {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const compact = new Intl.NumberFormat(tag, {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
  const share = new Intl.NumberFormat(tag, {
    style: "percent",
    maximumFractionDigits: 0,
  });
  const change = new Intl.NumberFormat(tag, {
    style: "percent",
    signDisplay: "exceptZero",
    maximumFractionDigits: 1,
  });
  const months = new Intl.NumberFormat(tag, {
    style: "unit",
    unit: "month",
    unitDisplay: "long",
  });
  const monthShort = new Intl.DateTimeFormat(tag, { month: "short", timeZone: "UTC" });
  const monthYear = new Intl.DateTimeFormat(tag, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const relative = new Intl.RelativeTimeFormat(tag, { numeric: "auto" });

  return {
    money: (v: number) => money.format(v),
    signedMoney: (v: number) => `${v < 0 ? "−" : "+"}${money.format(Math.abs(v))}`,
    compact: (v: number) => compact.format(v),
    share: (ratio: number) => share.format(ratio),
    change: (pct: number) => change.format(pct / 100),
    months: (n: number) => months.format(n),
    monthShort: (d: Date) => monthShort.format(d),
    monthYear: (d: Date) => monthYear.format(d),
    inDays: (n: number) => relative.format(n, "day"),
  };
}

export type Formatters = ReturnType<typeof createFormatters>;

export const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");
