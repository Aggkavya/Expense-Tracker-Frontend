import { Link } from "react-router-dom";
import { SectionCard, StatTile, StatusBanner } from "../components/FormControls";
import { useFinance } from "../context/FinanceContext";
import { formatCurrency, formatDate } from "../lib/format";

function OverviewPage() {
  const {
    activeCollection,
    balances,
    debts,
    expenses,
    isDebtLoading,
    isBootstrapping,
    isRefreshing,
    lastUpdatedAt,
    loadAllExpenses,
    requestError,
    totals,
  } = useFinance();

  const recentExpenses = expenses.slice(0, 5);
  const debtSummary = debts.reduce(
    (summary, debt) => {
      summary.total += Number(debt.amount ?? 0);
      summary.remaining += Number(debt.remainingAmount ?? 0);

      if (debt.isHistorical) {
        summary.historical += 1;
      }

      return summary;
    },
    { total: 0, remaining: 0, historical: 0 },
  );

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[34px] bg-[linear-gradient(135deg,#ffffff_0%,#f8fbff_38%,#eff6ff_100%)] p-6 shadow-[0_30px_80px_rgba(37,99,235,0.10)] ring-1 ring-slate-200 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
              Overview
            </p>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[0.92] text-slate-950 sm:text-5xl">
              Cleaner finance tracking with real separation between actions.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Use this page for quick status, then jump to dedicated routes for balances, new expenses, and history.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/expenses/new"
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Add new expense
              </Link>
              <Link
                to="/expenses/history"
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                View history
              </Link>
              <Link
                to="/debts/history"
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Open debt ledger
              </Link>
            </div>
          </div>

          <div className="rounded-[30px] bg-slate-950 p-6 text-white">
            <p className="text-sm font-medium text-white/60">Workspace pulse</p>
            <div className="mt-8 space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/40">
                  Data source
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {activeCollection === "filtered" ? "Filtered expenses" : "All expenses"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/40">
                  Last refresh
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {lastUpdatedAt ? formatDate(lastUpdatedAt) : "Waiting for first sync"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void loadAllExpenses()}
                disabled={isRefreshing}
                className="rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isRefreshing ? "Refreshing..." : "Refresh overview"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Bank balance"
          value={formatCurrency(balances.bankBalance)}
          detail="Last stored from update balance or create expense response"
          accent="blue"
        />
        <StatTile
          label="Cash in hand"
          value={formatCurrency(balances.cashInHand)}
          detail="Cached locally until backend exposes a read endpoint"
          accent="emerald"
        />
        <StatTile
          label="Total spent"
          value={formatCurrency(totals.total)}
          detail="Current collection summary"
          accent="slate"
        />
        <StatTile
          label="Online spend"
          value={formatCurrency(totals.online)}
          detail="Cash spend is tracked separately"
          accent="orange"
        />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatTile
          label="Debt principal"
          value={formatCurrency(debtSummary.total)}
          detail={isDebtLoading ? "Loading debt records..." : "Original debt amount logged"}
          accent="blue"
        />
        <StatTile
          label="Remaining debt"
          value={formatCurrency(debtSummary.remaining)}
          detail="Outstanding amount still left to pay"
          accent="slate"
        />
        <StatTile
          label="Historical debts"
          value={String(debtSummary.historical)}
          detail="Debts recorded without adding to current balances"
          accent="emerald"
        />
      </section>

      <SectionCard
        eyebrow="Latest activity"
        title="Recent expenses"
        description="A quick top-level view. Full filtering and sorting lives on the history page."
      >
        <StatusBanner
          tone="info"
          message={
            isBootstrapping ? "Loading current expenses..." : ""
          }
        />
        <StatusBanner tone="error" message={requestError} className="mt-4" />

        <div className="mt-4 overflow-hidden rounded-[24px] border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 bg-white">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.18em] text-slate-400">
                <tr>
                  <th className="px-4 py-4 font-medium">Description</th>
                  <th className="px-4 py-4 font-medium">Category</th>
                  <th className="px-4 py-4 font-medium">Payment</th>
                  <th className="px-4 py-4 font-medium">Amount</th>
                  <th className="px-4 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                {recentExpenses.length ? (
                  recentExpenses.map((expense) => (
                    <tr key={`${expense.id}-${expense.date}`}>
                      <td className="px-4 py-4 font-medium text-slate-900">
                        {expense.description}
                      </td>
                      <td className="px-4 py-4">{expense.category}</td>
                      <td className="px-4 py-4">{expense.paymentMode}</td>
                      <td className="px-4 py-4 font-semibold text-slate-900">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="px-4 py-4">{formatDate(expense.date)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-10 text-center text-slate-400" colSpan="5">
                      No expenses available yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

export default OverviewPage;
