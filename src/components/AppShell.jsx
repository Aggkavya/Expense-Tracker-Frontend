import {
  ArrowRightLeft,
  CreditCard,
  HandCoins,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  ScrollText,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearSession, getStoredUser } from "../lib/api";

const navigation = [
  {
    label: "Overview",
    description: "Summary and quick actions",
    to: "/overview",
    icon: LayoutDashboard,
  },
  {
    label: "Balances",
    description: "Update cash and bank",
    to: "/balances",
    icon: ArrowRightLeft,
  },
  {
    label: "New Expense",
    description: "Create a fresh expense",
    to: "/expenses/new",
    icon: PlusCircle,
  },
  {
    label: "Expense History",
    description: "Filter and sort spending",
    to: "/expenses/history",
    icon: CreditCard,
  },
  {
    label: "New Debt",
    description: "Record borrowed money",
    to: "/debts/new",
    icon: HandCoins,
  },
  {
    label: "Debt Ledger",
    description: "Pay, inspect, or delete debts",
    to: "/debts/history",
    icon: ScrollText,
  },
];

function AppShell() {
  const navigate = useNavigate();
  const user = getStoredUser();

  function handleLogout() {
    clearSession();
    navigate("/auth/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="rounded-[30px] border border-slate-200/80 bg-white/95 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="rounded-[28px] bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_58%,#14b8a6_100%)] p-6 text-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/14 text-xl font-bold">
              FT
            </div>
            <h1 className="mt-6 font-serif text-3xl leading-none">
              Finance tracker
            </h1>
            <p className="mt-3 text-sm leading-6 text-white/78">
              Clean pages for balance control, expense capture, and filtered spend reviews.
            </p>
          </div>

          <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Active user
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {user?.userName ?? "Authenticated"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              JWT-secured workspace
            </p>
          </div>

          <nav className="mt-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `group flex items-start gap-4 rounded-[22px] px-4 py-4 transition ${
                      isActive
                        ? "bg-slate-950 text-white shadow-[0_18px_40px_rgba(15,23,42,0.22)]"
                        : "border border-transparent bg-white text-slate-700 hover:border-slate-200 hover:bg-slate-50"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl ${
                          isActive
                            ? "bg-white/12 text-white"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        <Icon size={18} />
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-semibold">{item.label}</span>
                        <span
                          className={`mt-1 block text-xs leading-5 ${
                            isActive ? "text-white/70" : "text-slate-500"
                          }`}
                        >
                          {item.description}
                        </span>
                      </span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-[22px] border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <LogOut size={16} />
            Logout
          </button>
        </aside>

        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AppShell;
