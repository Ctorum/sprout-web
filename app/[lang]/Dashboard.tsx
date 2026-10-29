"use client";

import { useMemo, useState } from "react";
import { Chart } from "./Chart";
import { goalProgress, scopeData, type Goal, type Scope } from "./data";
import type { Dictionary, Locale } from "./dictionaries";
import { createFormatters, fill, type Formatters } from "./format";
import { ArrowUpIcon, CheckIcon, ClockIcon } from "./Icons";
import { Rail } from "./Rail";
import { useScope } from "./Shell";

const ranges = ["3", "6", "all"] as const;
type Range = (typeof ranges)[number];

const tones = {
  ahead: { style: "bg-grow-soft text-grow", Icon: ArrowUpIcon },
  onTrack: { style: "bg-grow-soft text-grow", Icon: CheckIcon },
  behind: { style: "bg-debt-soft text-debt", Icon: ClockIcon },
} as const;

function statusOf(aheadMonths: number, f: Formatters, dict: Dictionary) {
  if (aheadMonths > 0) {
    return { tone: "ahead", text: fill(dict.goal.ahead, { n: f.months(aheadMonths) }) } as const;
  }
  if (aheadMonths < 0) {
    return { tone: "behind", text: fill(dict.goal.behind, { n: f.months(-aheadMonths) }) } as const;
  }
  return { tone: "onTrack", text: dict.goal.onTrack } as const;
}

function Status({ tone, text }: { tone: keyof typeof tones; text: string }) {
  const { style, Icon } = tones[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap ${style}`}
    >
      <Icon width={14} height={14} strokeWidth={2.5} />
      {text}
    </span>
  );
}

export function Dashboard({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const scope = useScope();
  const f = useMemo(() => createFormatters(lang), [lang]);
  const [pickedGoal, setPickedGoal] = useState<Partial<Record<Scope, string>>>({});
  const [range, setRange] = useState<Range>("all");

  const data = scopeData[scope];
  const items = dict.items as Record<string, string>;
  const goals = data.goals.map((goal) => ({ goal, ...goalProgress(goal) }));
  const current = goals.find((g) => g.goal.id === pickedGoal[scope]) ?? goals[0];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight">{dict.home.title}</h1>
        <p className="mt-1 text-sm text-muted">
          {dict.home.netWorth}{" "}
          <span className="font-bold text-fg tabular-nums">{f.money(data.netWorth)}</span>
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="flex min-w-0 flex-col gap-8">
          {current ? (
            <FocusPanel
              key={`${scope}-${current.goal.id}-${range}`}
              current={current}
              range={range}
              onRange={setRange}
              dict={dict}
              f={f}
              name={items[current.goal.id]}
            />
          ) : (
            <section className="rounded-2xl border border-line bg-surface p-8">
              <h2 className="text-lg font-bold">{dict.empty.title}</h2>
              <p className="mt-2 max-w-[60ch] text-sm text-muted">{dict.empty.body}</p>
            </section>
          )}

          {goals.length > 0 && (
            <section aria-labelledby="goals-title">
              <h2 id="goals-title" className="mb-3 text-base font-bold">
                {dict.goals.title}
              </h2>
              <ul className="flex flex-col gap-2">
                {goals.map((g) => {
                  const selected = g.goal.id === current.goal.id;
                  const status = statusOf(g.aheadMonths, f, dict);
                  return (
                    <li key={g.goal.id}>
                      <button
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setPickedGoal((p) => ({ ...p, [scope]: g.goal.id }))}
                        className="block w-full rounded-xl border border-line bg-surface px-4 py-3.5 text-left transition-colors duration-150 hover:bg-raised aria-pressed:border-info aria-pressed:bg-raised aria-pressed:py-4"
                      >
                        <span className="flex items-start justify-between gap-3">
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-bold">
                              {items[g.goal.id]}
                            </span>
                            <span className="mt-0.5 block text-xs text-muted">
                              {fill(dict.goal.deadline, { date: f.monthYear(g.deadline) })}
                              {" · "}
                              {fill(dict.goal.progress, {
                                saved: f.money(g.saved),
                                target: f.money(g.goal.target),
                              })}
                            </span>
                          </span>
                          <Status tone={status.tone} text={status.text} />
                        </span>
                        <span className="mt-3 flex items-center gap-3">
                          <span className="h-2 flex-1 overflow-hidden rounded-full bg-line">
                            <span
                              className="block h-full origin-left rounded-full bg-grow transition-transform duration-300 ease-out"
                              style={{ transform: `scaleX(${g.share})` }}
                            />
                          </span>
                          <span className="w-10 text-right text-sm font-bold tabular-nums">
                            {f.share(g.share)}
                          </span>
                        </span>
                        {selected && (
                          <span className="mt-2.5 block text-xs text-muted">
                            {g.monthlyNeeded > 0
                              ? fill(dict.goal.needed, { amount: f.money(g.monthlyNeeded) })
                              : dict.goal.done}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>

        <Rail data={data} dict={dict} f={f} />
      </div>
    </div>
  );
}

type Current = { goal: Goal } & ReturnType<typeof goalProgress>;

function FocusPanel({
  current,
  range,
  onRange,
  dict,
  f,
  name,
}: {
  current: Current;
  range: Range;
  onRange: (r: Range) => void;
  dict: Dictionary;
  f: Formatters;
  name: string;
}) {
  const { goal, plan, dates, saved, aheadMonths } = current;
  const start = range === "all" ? 0 : Math.max(goal.history.length - Number(range), 0);
  const visibleDates = dates.slice(start);
  const visiblePlan = plan.slice(start);
  const visibleActual = goal.history.slice(start);
  const status = statusOf(aheadMonths, f, dict);

  return (
    <section
      aria-labelledby="focus-title"
      className="rounded-2xl border border-line bg-surface p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div>
          <h2 id="focus-title" className="text-base font-bold">
            {name}
          </h2>
          <p className="mt-1 text-2xl font-extrabold tracking-tight tabular-nums">
            {f.money(saved)}
            <span className="ml-2 text-sm font-medium text-muted">
              {fill(dict.goal.of, { target: f.money(goal.target) })}
            </span>
          </p>
          <div className="mt-2">
            <Status tone={status.tone} text={status.text} />
          </div>
        </div>
        <div
          role="group"
          aria-label={dict.chart.range}
          className="grid grid-cols-3 gap-1 rounded-lg bg-raised p-1"
        >
          {ranges.map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={range === r}
              onClick={() => onRange(r)}
              className="min-h-9 min-w-12 rounded-md px-3 text-sm font-semibold text-muted transition-colors duration-150 hover:text-fg aria-pressed:bg-surface aria-pressed:text-fg"
            >
              {r === "3" ? dict.chart.r3 : r === "6" ? dict.chart.r6 : dict.chart.all}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Chart
          labels={visibleDates.map(f.monthShort)}
          plan={visiblePlan}
          actual={visibleActual}
          max={goal.target}
          compact={f.compact}
          ariaLabel={dict.chart.label}
          describe={(i) =>
            visibleActual[i] === undefined
              ? fill(dict.chart.planOnly, {
                  month: f.monthYear(visibleDates[i]),
                  plan: f.money(visiblePlan[i]),
                })
              : fill(dict.chart.summary, {
                  month: f.monthYear(visibleDates[i]),
                  actual: f.money(visibleActual[i]),
                  plan: f.money(visiblePlan[i]),
                })
          }
          readout={(i) => (
            <>
              <span className="font-bold">{f.monthYear(visibleDates[i])}</span>
              {visibleActual[i] !== undefined && (
                <span className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-1 w-5 rounded-full bg-grow" />
                  <span className="text-muted">{dict.chart.actual}</span>
                  <span className="font-bold tabular-nums">{f.money(visibleActual[i])}</span>
                </span>
              )}
              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-0 w-5 border-t-2 border-dashed border-info"
                />
                <span className="text-muted">{dict.chart.plan}</span>
                <span className="font-bold tabular-nums">{f.money(visiblePlan[i])}</span>
              </span>
            </>
          )}
        />
      </div>
    </section>
  );
}
