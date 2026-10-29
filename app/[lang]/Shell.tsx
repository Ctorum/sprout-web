"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useState, useSyncExternalStore } from "react";
import { scopes, type Scope } from "./data";
import type { Dictionary, Locale } from "./dictionaries";
import {
  CardIcon,
  HomeIcon,
  MoonIcon,
  SunIcon,
  TargetIcon,
  TrendIcon,
  WalletIcon,
} from "./Icons";

const ScopeContext = createContext<Scope>("personal");

export const useScope = () => useContext(ScopeContext);

const languages: { code: Locale; label: string; name: string }[] = [
  { code: "en", label: "EN", name: "English" },
  { code: "pt", label: "PT", name: "Português" },
];

const navItems = [
  { id: "overview", Icon: HomeIcon },
  { id: "goals", Icon: TargetIcon },
  { id: "accounts", Icon: WalletIcon },
  { id: "investments", Icon: TrendIcon },
  { id: "debts", Icon: CardIcon },
] as const;

export function Shell({
  lang,
  dict,
  children,
}: {
  lang: Locale;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  const [scope, setScope] = useState<Scope>("personal");
  const pathname = usePathname();
  const rest = pathname.slice(lang.length + 1);

  return (
    <ScopeContext value={scope}>
      <div className="min-h-dvh lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside className="sticky top-0 hidden h-dvh flex-col gap-10 border-r border-line bg-rail px-4 py-7 lg:flex">
          <Brand className="px-3" />
          <nav aria-label={dict.shell.mainNav}>
            <ul className="flex flex-col gap-1">
              {navItems.map(({ id, Icon }) => (
                <li key={id}>
                  <NavItem
                    id={id}
                    href={`/${lang}`}
                    current={id === "overview" && rest === ""}
                    label={dict.nav[id]}
                    soon={dict.shell.soon}
                    layout="side"
                  >
                    <Icon />
                  </NavItem>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="min-w-0 pb-24 lg:pb-0">
          <header className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 pt-4 sm:px-6 lg:px-8 lg:pt-6">
            <Brand className="lg:hidden" />
            <div
              role="group"
              aria-label={dict.shell.scopeLabel}
              className="order-last grid w-full grid-cols-3 gap-1 rounded-xl bg-surface p-1 lg:order-none lg:inline-grid lg:w-auto lg:min-w-80"
            >
              {scopes.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={scope === s}
                  onClick={() => setScope(s)}
                  className="min-h-10 rounded-lg px-4 text-sm font-semibold text-muted transition-colors duration-150 hover:text-fg aria-pressed:bg-grow aria-pressed:text-bg"
                >
                  {dict.scopes[s]}
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-1">
              <ul className="flex gap-1" aria-label={dict.shell.languageLabel}>
                {languages.map((l) => (
                  <li key={l.code}>
                    <a
                      href={`/${l.code}${rest}`}
                      hrefLang={l.code}
                      lang={l.code}
                      title={l.name}
                      aria-current={l.code === lang ? "true" : undefined}
                      className="flex min-h-10 min-w-10 items-center justify-center rounded-lg px-2 text-sm font-semibold text-muted transition-colors duration-150 hover:bg-surface aria-[current=true]:bg-info-soft aria-[current=true]:text-info"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
              <ThemeToggle label={dict.shell.theme} />
            </div>
          </header>

          <main id="main" className="px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>

        <nav
          aria-label={dict.shell.mainNav}
          className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-rail lg:hidden"
        >
          <ul className="grid grid-cols-5">
            {navItems.map(({ id, Icon }) => (
              <li key={id}>
                <NavItem
                  id={id}
                  href={`/${lang}`}
                  current={id === "overview" && rest === ""}
                  label={dict.nav[id]}
                  soon={dict.shell.soon}
                  layout="bottom"
                >
                  <Icon />
                </NavItem>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </ScopeContext>
  );
}

function NavItem({
  id,
  href,
  current,
  label,
  soon,
  layout,
  children,
}: {
  id: string;
  href: string;
  current: boolean;
  label: string;
  soon: string;
  layout: "side" | "bottom";
  children: React.ReactNode;
}) {
  const shape =
    layout === "side"
      ? "min-h-11 gap-3 rounded-lg px-3 text-sm"
      : "min-h-16 flex-col justify-center gap-1 px-1 text-xs";

  if (id !== "overview") {
    return (
      <span
        aria-disabled="true"
        className={`flex items-center font-semibold text-muted/70 ${shape}`}
      >
        {children}
        <span className="flex flex-wrap items-baseline justify-center gap-x-2">
          {label}
          {layout === "side" && <span className="text-xs font-medium">{soon}</span>}
        </span>
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={`flex items-center font-semibold text-muted transition-colors duration-150 hover:bg-raised hover:text-fg aria-[current=page]:bg-grow-soft aria-[current=page]:text-grow ${shape}`}
    >
      {children}
      {label}
    </Link>
  );
}

function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function ThemeToggle({ label }: { label: string }) {
  const dark = useSyncExternalStore(
    subscribeTheme,
    () => document.documentElement.dataset.theme === "dark",
    () => false,
  );

  function toggle() {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={dark}
      onClick={toggle}
      className="flex min-h-10 min-w-10 items-center justify-center rounded-lg text-muted transition-colors duration-150 hover:bg-surface hover:text-fg"
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function Brand({ className = "" }: { className?: string }) {
  return (
    <span className={`text-xl font-extrabold tracking-tight ${className}`}>
      Sprout<span className="text-grow">.</span>
    </span>
  );
}
