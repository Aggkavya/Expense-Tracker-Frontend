import { Navigate, NavLink, Outlet } from "react-router-dom";
import { getToken } from "../lib/api";

function AuthShell() {
  if (getToken()) {
    return <Navigate to="/overview" replace />;
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-[34px] border border-slate-200/80 bg-white shadow-[0_40px_100px_rgba(15,23,42,0.12)] lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative overflow-hidden bg-[linear-gradient(160deg,#0f172a_0%,#1d4ed8_52%,#14b8a6_100%)] p-8 text-white sm:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.18),_transparent_24%)]" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm font-medium">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-950">
                  FT
                </span>
                Personal Finance Tracker
              </div>
              <div className="mt-12 max-w-xl">
                <p className="font-serif text-5xl leading-[0.9] sm:text-6xl">
                  White-space clarity with sharper money workflows.
                </p>
                <p className="mt-6 max-w-lg text-base leading-7 text-white/78">
                  Separate pages for overview, balances, new expenses, and spending history, with a cleaner interface that feels deliberate.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                "Fresh auth flow",
                "Multi-page expense workspace",
                "Consistent white-first design system",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[24px] border border-white/14 bg-white/10 px-4 py-5 text-sm leading-6 text-white/78 backdrop-blur"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex min-h-full flex-col justify-between bg-white px-6 py-8 sm:px-10 sm:py-10">
          <div>
            <div className="flex gap-2 rounded-full bg-slate-100 p-1">
              <NavLink
                to="/auth/login"
                className={({ isActive }) =>
                  `flex-1 rounded-full px-4 py-3 text-center text-sm font-semibold transition ${
                    isActive
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
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
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
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

          <p className="mt-10 text-xs uppercase tracking-[0.24em] text-slate-400">
            Built around your current auth and expense endpoints
          </p>
        </section>
      </div>
    </main>
  );
}

export default AuthShell;
