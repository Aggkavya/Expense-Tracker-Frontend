import { Navigate, NavLink, Outlet } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { getToken } from "../lib/api";
import { useTheme } from "../context/ThemeContext";

function AuthShell() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  if (getToken()) {
    return <Navigate to="/overview" replace />;
  }

  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div
        className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1400px] overflow-hidden rounded-[30px] border border-[var(--border)] bg-[var(--surface)] lg:grid-cols-[1.15fr_0.85fr]"
        style={{ boxShadow: "var(--panel-shadow)" }}
      >
        <section
          className={`relative overflow-hidden p-8 text-white sm:p-12 ${
            isDark
              ? "border-r border-cyan-400/25 bg-[linear-gradient(155deg,#020811_0%,#0a1e32_52%,#114866_100%)]"
              : "bg-[linear-gradient(155deg,#1e3a8a_0%,#2563eb_50%,#0ea5e9_100%)]"
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.22),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.16),_transparent_26%)]" />
          <div className="relative flex h-full flex-col justify-between gap-10">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-900">
                  FT
                </span>
                Finance Tracker
              </div>
              <h1 className="mt-12 max-w-xl font-serif text-5xl leading-[0.92] sm:text-6xl">
                Track cash flow with clarity.
              </h1>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[18px] border border-white/20 bg-white/10 px-4 py-4 text-sm">
                Expense and income pages
              </div>
              <div className="rounded-[18px] border border-white/20 bg-white/10 px-4 py-4 text-sm">
                Debt ledger support
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-full flex-col justify-between bg-[var(--surface)] px-6 py-8 sm:px-10 sm:py-10">
          <div>
            <div className="mb-6 flex items-center justify-end">
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:brightness-95"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                {theme === "dark" ? "Light" : "Dark"}
              </button>
            </div>

            <div className="flex gap-2 rounded-full bg-[var(--surface-soft)] p-1">
              <NavLink
                to="/auth/login"
                className={({ isActive }) =>
                  `flex-1 rounded-full px-4 py-3 text-center text-sm font-semibold transition ${
                    isActive
                      ? "bg-[var(--surface)] text-[var(--text)] shadow-sm"
                      : "text-[var(--muted)] hover:text-[var(--text)]"
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/auth/signup"
                className={({ isActive }) =>
                  `flex-1 rounded-full px-4 py-3 text-center text-sm font-semibold transition ${
                    isActive
                      ? "bg-[var(--surface)] text-[var(--text)] shadow-sm"
                      : "text-[var(--muted)] hover:text-[var(--text)]"
                  }`
                }
              >
                Signup
              </NavLink>
            </div>

            <div className="mt-8">
              <Outlet />
            </div>
          </div>

          <p className="mt-10 text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
            Finance Tracker
          </p>
        </section>
      </div>
    </main>
  );
}

export default AuthShell;
