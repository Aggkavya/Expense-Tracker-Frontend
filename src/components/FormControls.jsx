import { ChevronDown } from "lucide-react";

export function Field({ label, hint, required = false, className = "", ...props }) {
  return (
    <label className={`block space-y-2 ${className}`}>
      <span className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-[var(--text)]">{label}</span>
        {hint ? <span className="text-xs text-[var(--muted)]">{hint}</span> : null}
      </span>
      <input
        required={required}
        {...props}
        className="w-full rounded-[16px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:ring-4 focus:ring-blue-100 dark:focus:ring-sky-900/30"
      />
    </label>
  );
}

export function SelectField({
  label,
  options,
  includeEmptyOption = false,
  emptyLabel = "Select",
  className = "",
  ...props
}) {
  return (
    <label className={`block space-y-2 ${className}`}>
      <span className="text-sm font-semibold text-[var(--text)]">{label}</span>
      <div className="relative">
        <select
          {...props}
          className="w-full appearance-none rounded-[16px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 pr-11 text-sm font-medium text-[var(--text)] outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-blue-100 dark:focus:ring-sky-900/30"
        >
          {includeEmptyOption ? <option value="">{emptyLabel}</option> : null}
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[var(--muted)]">
          <ChevronDown size={16} />
        </span>
      </div>
    </label>
  );
}

export function SectionCard({ eyebrow, title, description, children, aside }) {
  return (
    <section className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
      <div className="flex flex-col gap-4 border-b border-[var(--border)]/60 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">{title}</h2>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              {description}
            </p>
          ) : null}
        </div>
        {aside ? <div>{aside}</div> : null}
      </div>
      <div className="pt-6">{children}</div>
    </section>
  );
}

export function StatTile({ label, value, accent = "blue", detail }) {
  const accentClasses = {
    blue: "from-blue-600 to-sky-500",
    emerald: "from-emerald-500 to-teal-500",
    orange: "from-orange-500 to-amber-500",
    slate: "from-slate-700 to-slate-500 dark:from-slate-200 dark:to-slate-400",
  };

  return (
    <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
      <div className={`h-1.5 w-20 rounded-full bg-gradient-to-r ${accentClasses[accent]}`} />
      <p className="mt-5 text-sm font-medium text-[var(--muted)]">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text)]">{value}</p>
      {detail ? <p className="mt-2 text-sm text-[var(--muted)]">{detail}</p> : null}
    </article>
  );
}

export function StatusBanner({ tone = "info", message, className = "" }) {
  if (!message) {
    return null;
  }

  const tones = {
    info: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-200",
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200",
    error:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200",
    warning:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/40 dark:bg-amber-500/10 dark:text-amber-200",
  };

  return (
    <div className={`rounded-[20px] border px-4 py-3 text-sm ${tones[tone]} ${className}`}>
      {message}
    </div>
  );
}
