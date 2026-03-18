export function Field({ label, hint, required = false, className = "", ...props }) {
  return (
    <label className={`block space-y-2 ${className}`}>
      <span className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        {hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
      </span>
      <input
        required={required}
        {...props}
        className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <select
        {...props}
        className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      >
        {includeEmptyOption ? <option value="">{emptyLabel}</option> : null}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function SectionCard({ eyebrow, title, description, children, aside }) {
  return (
    <section className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">{title}</h2>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
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
    blue: "from-blue-600 to-cyan-500",
    emerald: "from-emerald-500 to-teal-500",
    orange: "from-orange-500 to-amber-500",
    slate: "from-slate-900 to-slate-700",
  };

  return (
    <article className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_20px_40px_rgba(15,23,42,0.05)]">
      <div className={`h-1.5 w-20 rounded-full bg-gradient-to-r ${accentClasses[accent]}`} />
      <p className="mt-5 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
      {detail ? <p className="mt-2 text-sm text-slate-400">{detail}</p> : null}
    </article>
  );
}

export function StatusBanner({ tone = "info", message, className = "" }) {
  if (!message) {
    return null;
  }

  const tones = {
    info: "border-blue-200 bg-blue-50 text-blue-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    error: "border-rose-200 bg-rose-50 text-rose-700",
  };

  return (
    <div className={`rounded-[20px] border px-4 py-3 text-sm ${tones[tone]} ${className}`}>
      {message}
    </div>
  );
}
