import type { ScopeData } from "./data";
import type { Dictionary } from "./dictionaries";
import type { Formatters } from "./format";
import { ArrowDownIcon, ArrowUpIcon, TrendIcon } from "./Icons";

const kindIcons = { debt: ArrowDownIcon, credit: ArrowUpIcon, invest: TrendIcon } as const;

export function Rail({
  data,
  dict,
  f,
}: {
  data: ScopeData;
  dict: Dictionary;
  f: Formatters;
}) {
  const items = dict.items as Record<string, string>;
  const flowMax = Math.max(data.income, data.expenses);
  const upcoming = [...data.upcoming].sort((a, b) => a.inDays - b.inDays);

  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-surface">
      <section aria-labelledby="upcoming-title" className="p-5">
        <h2 id="upcoming-title" className="text-base font-bold">
          {dict.upcoming.title}
        </h2>
        <ul className="mt-3 flex flex-col">
          {upcoming.map((entry) => {
            const Icon = kindIcons[entry.kind];
            const incoming = entry.kind === "credit";
            return (
              <li key={entry.id} className="flex items-center gap-3 py-2.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-raised text-muted">
                  <Icon width={16} height={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    <span className="sr-only">{dict.upcoming[entry.kind]}: </span>
                    {items[entry.id]}
                  </p>
                  <p className="text-xs text-muted">{f.inDays(entry.inDays)}</p>
                </div>
                <p
                  className={`text-sm font-bold tabular-nums ${incoming ? "text-grow" : ""}`}
                >
                  {f.signedMoney(incoming ? entry.amount : -entry.amount)}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="cashflow-title" className="p-5">
        <h2 id="cashflow-title" className="text-base font-bold">
          {dict.cashflow.title}
        </h2>
        <dl className="mt-3 flex flex-col gap-3 text-sm">
          <Flow label={dict.cashflow.in} value={f.money(data.income)} ratio={data.income / flowMax} tone="bg-grow" />
          <Flow label={dict.cashflow.out} value={f.money(data.expenses)} ratio={data.expenses / flowMax} tone="bg-info" />
          <div className="flex items-baseline justify-between border-t border-line pt-3">
            <dt className="font-semibold">{dict.cashflow.left}</dt>
            <dd className="text-lg font-extrabold tabular-nums">
              {f.signedMoney(data.income - data.expenses)}
            </dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="investments-title" className="p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="investments-title" className="text-base font-bold">
            {dict.investments.title}
          </h2>
          <p className="text-xs text-muted">{dict.investments.period}</p>
        </div>
        <ul className="mt-3 flex flex-col">
          {data.holdings.map((holding) => {
            const name = items[holding.id];
            const up = holding.change >= 0;
            const Icon = up ? ArrowUpIcon : ArrowDownIcon;
            return (
              <li key={holding.id} className="flex items-center gap-3 py-2.5">
                <span
                  aria-hidden="true"
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-info-soft text-sm font-extrabold text-info"
                >
                  {name[0]}
                </span>
                <p className="min-w-0 flex-1 truncate text-sm font-semibold">{name}</p>
                <div className="text-right">
                  <p className="text-sm font-bold tabular-nums">{f.money(holding.value)}</p>
                  <p
                    className={`flex items-center justify-end gap-1 text-xs font-semibold tabular-nums ${up ? "text-grow" : "text-debt"}`}
                  >
                    <Icon width={12} height={12} strokeWidth={2.5} />
                    <span className="sr-only">{up ? dict.investments.up : dict.investments.down}: </span>
                    {f.change(holding.change)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function Flow({
  label,
  value,
  ratio,
  tone,
}: {
  label: string;
  value: string;
  ratio: number;
  tone: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <dt className="text-muted">{label}</dt>
        <dd className="font-bold tabular-nums">{value}</dd>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-raised">
        <div
          className={`h-full origin-left rounded-full transition-transform duration-300 ease-out ${tone}`}
          style={{ transform: `scaleX(${ratio})` }}
        />
      </div>
    </div>
  );
}
