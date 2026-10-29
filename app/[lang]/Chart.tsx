"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

type Props = {
  labels: string[];
  plan: number[];
  actual: number[];
  max: number;
  compact: (v: number) => string;
  ariaLabel: string;
  describe: (i: number) => string;
  readout: (i: number) => ReactNode;
};

const margin = { top: 12, right: 12, bottom: 28, left: 68 };

export function Chart({ labels, plan, actual, max, compact, ariaLabel, describe, readout }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const [picked, setPicked] = useState<number | null>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const count = plan.length;
  const last = count - 1;
  const active = Math.min(picked ?? actual.length - 1, last);
  const height = width < 480 ? 220 : 280;
  const plotW = Math.max(width - margin.left - margin.right, 1);
  const plotH = height - margin.top - margin.bottom;
  const x = (i: number) => margin.left + (last === 0 ? 0 : (i * plotW) / last);
  const y = (v: number) => margin.top + plotH - (v / max) * plotH;
  const path = (values: number[]) =>
    values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const areaPath = `${path(actual)} L${x(actual.length - 1).toFixed(1)} ${y(0)} L${x(0)} ${y(0)}Z`;
  const ticks = [0, max / 2, max];
  const labelEvery = Math.ceil(count / Math.max(Math.floor(plotW / 56), 1));

  function select(next: number) {
    setPicked(Math.min(Math.max(next, 0), last));
  }

  function onKeyDown(event: KeyboardEvent) {
    const moves: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: last,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    select(moves[event.key]);
  }

  function onPointer(clientX: number) {
    const rect = wrap.current?.getBoundingClientRect();
    if (!rect || last === 0) return;
    select(Math.round(((clientX - rect.left - margin.left) / plotW) * last));
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
        {readout(active)}
      </div>
      <div
        ref={wrap}
        role="slider"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={last}
        aria-valuenow={active}
        aria-valuetext={describe(active)}
        onKeyDown={onKeyDown}
        onPointerMove={(e) => onPointer(e.clientX)}
        onPointerDown={(e) => onPointer(e.clientX)}
        className="relative cursor-crosshair touch-pan-y rounded-lg outline-offset-4"
      >
        <svg width={width} height={height} className="block" aria-hidden="true">
          <defs>
            <linearGradient id="saved-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" style={{ stopColor: "var(--grow)", stopOpacity: 0.32 }} />
              <stop offset="1" style={{ stopColor: "var(--grow)", stopOpacity: 0 }} />
            </linearGradient>
          </defs>

          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={margin.left}
                x2={width - margin.right}
                y1={y(t)}
                y2={y(t)}
                className="stroke-line"
              />
              <text x={margin.left - 10} y={y(t) + 4} textAnchor="end" className="fill-muted text-xs">
                {t === 0 ? "0" : compact(t)}
              </text>
            </g>
          ))}

          {labels.map((label, i) =>
            i % labelEvery === 0 || i === last ? (
              <text
                key={i}
                x={x(i)}
                y={height - 8}
                textAnchor={i === 0 ? "start" : i === last ? "end" : "middle"}
                className="fill-muted text-xs"
              >
                {label}
              </text>
            ) : null,
          )}

          <path d={path(plan)} fill="none" strokeWidth="2" strokeDasharray="5 5" className="stroke-info" />
          <path d={areaPath} fill="url(#saved-fill)" />
          <path
            d={path(actual)}
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-grow"
          />

          <line
            x1={x(active)}
            x2={x(active)}
            y1={margin.top}
            y2={y(0)}
            strokeWidth="1"
            className="stroke-muted"
          />
          <circle
            cx={x(active)}
            cy={y(plan[active])}
            r="4.5"
            strokeWidth="2"
            className="fill-surface stroke-info"
          />
          {actual[active] !== undefined && (
            <circle
              cx={x(active)}
              cy={y(actual[active])}
              r="5.5"
              strokeWidth="2.5"
              className="fill-grow stroke-surface"
            />
          )}
        </svg>
      </div>
    </div>
  );
}
