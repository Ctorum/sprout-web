import { getDictionary } from "./dictionaries";

export default async function Overview() {
  const { overview } = await getDictionary();

  return (
    <div className="max-w-2xl">
      <h1 className="text-sm font-medium text-muted">{overview.title}</h1>

      <section aria-labelledby="empty-title" className="mt-10">
        <h2
          id="empty-title"
          className="text-balance text-3xl font-semibold tracking-tight"
        >
          {overview.emptyTitle}
        </h2>
        <p className="mt-3 max-w-[60ch] text-pretty text-base text-muted">
          {overview.emptyBody}
        </p>

        <h3 className="mt-12 text-sm font-medium text-muted">
          {overview.stepsLabel}
        </h3>
        <ol className="mt-3 divide-y divide-line border-y border-line">
          {overview.steps.map((step, i) => (
            <li key={step.title} className="flex gap-4 py-4">
              <span
                aria-hidden="true"
                className="w-5 shrink-0 pt-0.5 text-sm text-muted tabular-nums"
              >
                {i + 1}
              </span>
              <div>
                <p className="font-medium">{step.title}</p>
                <p className="mt-1 max-w-[60ch] text-sm text-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <button
          type="button"
          className="mt-8 min-h-11 rounded-md bg-accent px-5 text-sm font-medium text-accent-fg transition-colors duration-150 hover:bg-accent-hover active:translate-y-px"
        >
          {overview.cta}
        </button>
      </section>
    </div>
  );
}
