import {
  ArrowRightLeft,
  CircleDollarSign,
  HandCoins,
  LayoutDashboard,
  Landmark,
  LogOut,
  Moon,
  PlusCircle,
  Receipt,
  ScrollText,
  Sun,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearSession, getStoredUser } from "../lib/api";
import { useTheme } from "../context/ThemeContext";

const navigation = [
  {
    label: "Overview",
    to: "/overview",
    icon: LayoutDashboard,
  },
  {
    label: "Balances",
    to: "/balances",
    icon: ArrowRightLeft,
  },
  {
    label: "New Expense",
    to: "/expenses/new",
    icon: PlusCircle,
  },
  {
    label: "Expense History",
    to: "/expenses/history",
    icon: Receipt,
  },
  {
    label: "New Income",
    to: "/incomes/new",
    icon: CircleDollarSign,
  },
  {
    label: "Income History",
    to: "/incomes/history",
    icon: Landmark,
  },
  {
    label: "New Debt",
    to: "/debts/new",
    icon: HandCoins,
  },
  {
    label: "Debt Ledger",
    to: "/debts/history",
    icon: ScrollText,
  },
];

function AppShell() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const user = getStoredUser();

  function handleLogout() {
    clearSession();
    navigate("/auth/login", { replace: true });
  }

  return (
    <div className="min-h-screen text-[var(--text)]">
      <div className="mx-auto grid min-h-screen w-full gap-6 px-4 py-4 lg:grid-cols-[300px_minmax(0,1fr)] xl:px-8">
        <aside
          className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5"
          style={{ boxShadow: "var(--panel-shadow)" }}
        >
          <div
            className={`rounded-[24px] p-6 text-white ${
              isDark
                ? "border border-cyan-400/35 bg-[linear-gradient(145deg,#030b14_0%,#0a2236_55%,#134b68_100%)]"
                : "bg-[linear-gradient(145deg,#1e3a8a_0%,#2563eb_45%,#0ea5e9_100%)]"
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-xl font-bold">
              FT
            </div>
            <h1 className="mt-6 font-serif text-3xl leading-none">
              Finance Tracker
            </h1>
          </div>

          <div className="mt-6 rounded-[20px] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
              User
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--text)]">
              {user?.userName ?? "--"}
            </p>
          </div>

          <nav className="mt-6 grid grid-cols-1 gap-2">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-[16px] px-4 py-3 transition ${
                      isActive
                        ? isDark
                          ? "bg-[var(--brand)] text-[#041421] shadow-[0_0_0_1px_rgba(0,194,255,0.35),0_12px_26px_rgba(0,0,0,0.45)]"
                          : "bg-[var(--brand)] text-white shadow-[0_18px_36px_rgba(37,99,235,0.32)]"
                        : "border border-transparent text-[var(--text)] hover:border-[var(--border)] hover:bg-[var(--surface-soft)]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                          isActive
                            ? isDark
                              ? "bg-[#041421]/25 text-[#041421]"
                              : "bg-white/20 text-white"
                            : "bg-cyan-500/10 text-[var(--brand)]"
                        }`}
                      >
                        <Icon size={18} />
                      </span>
                      <span className="text-sm font-semibold">{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={toggleTheme}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-[16px] border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm font-semibold text-[var(--text)] transition hover:brightness-95"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-[16px] border border-[var(--border)] px-4 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-soft)]"
          >
            <LogOut size={16} />
            Logout
          </button>
        </aside>

        <div
          className="min-w-0 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6"
          style={{ boxShadow: "var(--panel-shadow)" }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AppShell;
