"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Locale } from "./dictionaries";

type Dict = {
  shell: Record<"menu" | "mainNav" | "scopeLabel" | "languageLabel" | "soon", string>;
  scopes: Record<"personal" | "household" | "company", string>;
  nav: Record<"overview" | "accounts" | "debts" | "investments" | "goals", string>;
};

const languages: { code: Locale; label: string; name: string }[] = [
  { code: "en", label: "EN", name: "English" },
  { code: "pt", label: "PT", name: "Português" },
];

const navItems = ["overview", "accounts", "debts", "investments", "goals"] as const;
const scopes = ["personal", "household", "company"] as const;

export function Shell({
  lang,
  dict,
  children,
}: {
  lang: Locale;
  dict: Dict;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState<(typeof scopes)[number]>("personal");
  const pathname = usePathname();
  const rest = pathname.replace(/^\/[^/]+/, "") || "/";

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[18rem_1fr]">
      <header className="flex items-center justify-between border-b border-line bg-rail px-4 py-2 md:hidden">
        <Brand />
        <button
          type="button"
          aria-expanded={open}
          aria-controls="rail"
          onClick={() => setOpen(!open)}
          className="min-h-11 rounded-md px-3 text-sm font-medium hover:bg-hover"
        >
          {dict.shell.menu}
        </button>
      </header>

      <aside
        id="rail"
        className={`${open ? "flex" : "hidden"} flex-col gap-6 border-b border-line bg-rail px-4 py-5 md:sticky md:top-0 md:flex md:h-dvh md:border-b-0 md:border-r`}
      >
        <div className="hidden md:block">
          <Brand />
        </div>

        <div role="radiogroup" aria-label={dict.shell.scopeLabel} className="grid grid-cols-3 rounded-lg bg-hover p-1">
          {scopes.map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={scope === s}
              onClick={() => setScope(s)}
              className="min-h-9 min-w-0 truncate rounded-md px-1 text-sm font-medium text-muted transition-colors duration-150 aria-checked:bg-bg aria-checked:text-fg aria-checked:shadow-sm"
            >
              {dict.scopes[s]}
            </button>
          ))}
        </div>

        <nav aria-label={dict.shell.mainNav}>
          <ul className="flex flex-col gap-0.5">
            {navItems.map((item) =>
              item === "overview" ? (
                <li key={item}>
                  <Link
                    href={`/${lang}`}
                    aria-current={rest === "/" ? "page" : undefined}
                    className="flex min-h-10 items-center rounded-md px-3 text-sm font-medium transition-colors duration-150 hover:bg-hover aria-[current=page]:bg-accent-soft aria-[current=page]:text-accent"
                  >
                    {dict.nav[item]}
                  </Link>
                </li>
              ) : (
                <li key={item}>
                  <span
                    aria-disabled="true"
                    className="flex min-h-10 items-center justify-between rounded-md px-3 text-sm text-muted/80"
                  >
                    {dict.nav[item]}
                    <span className="text-xs">{dict.shell.soon}</span>
                  </span>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="mt-auto flex items-center gap-2 text-sm">
          <span className="text-muted">{dict.shell.languageLabel}</span>
          <ul className="flex gap-1">
            {languages.map((l) => (
              <li key={l.code}>
                <a
                  href={`/${l.code}${rest === "/" ? "" : rest}`}
                  hrefLang={l.code}
                  lang={l.code}
                  title={l.name}
                  aria-current={l.code === lang ? "true" : undefined}
                  className="flex min-h-9 min-w-11 items-center justify-center rounded-md px-2 font-medium text-muted transition-colors duration-150 hover:bg-hover aria-[current=true]:bg-accent-soft aria-[current=true]:text-accent"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main id="main" className="px-4 py-8 md:px-12 md:py-12">
        {children}
      </main>
    </div>
  );
}

function Brand() {
  return <span className="text-lg font-semibold tracking-tight">Sprout</span>;
}
