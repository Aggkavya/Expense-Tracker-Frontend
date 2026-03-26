import { Link } from "react-router-dom";
import { SectionCard, StatTile, StatusBanner } from "../components/FormControls";
import { useFinance } from "../context/FinanceContext";
import { formatCurrency, formatDate } from "../lib/format";

function OverviewPage() {
  const {
    balances,
    debts,
    expenses,
    incomes,
    incomeTotals,
    isBootstrapping,
    isDebtLoading,
    isRefreshing,
    lastUpdatedAt,
    loadAllDebts,
    loadAllExpenses,
    loadAllIncomes,
    requestError,
    totals,
  } = useFinance();

  const recentExpenses = expenses.slice(0, 5);
  const recentIncomes = incomes.slice(0, 5);
  const debtSummary = debts.reduce(
    (summary, debt) => {
      summary.total += Number(debt.amount ?? 0);
      summary.remaining += Number(debt.remainingAmount ?? 0);
      return summary;
    },
    { total: 0, remaining: 0 },
  );

  async function handleRefresh() {
    await Promise.all([loadAllExpenses(), loadAllIncomes(), loadAllDebts()]);
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-[var(--border)] bg-[linear-gradient(140deg,#1e3a8a_0%,#2563eb_58%,#0284c7_100%)] p-7 text-white shadow-[0_28px_80px_rgba(37,99,235,0.35)] sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              Finance Tracker
            </p>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[0.95] sm:text-5xl">
              Overview
            </h1>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/expenses/new"
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Add expense
              </Link>
              <Link
                to="/incomes/new"
                className="rounded-full bg-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/25"
              >
                Add income
              </Link>
              <Link
                to="/debts/new"
                className="rounded-full bg-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/25"
              >
                Add debt
              </Link>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/20 bg-white/10 p-6 backdrop-blur">
            <p className="text-sm font-semibold text-white/85">Sync</p>
            <p className="mt-2 text-sm text-white/75">
              {lastUpdatedAt ? formatDate(lastUpdatedAt) : "Not synced yet"}
            </p>
            <button
              type="button"
              onClick={() => void handleRefresh()}
              disabled={isRefreshing}
              className="mt-5 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Bank balance" value={formatCurrency(balances.bankBalance)} accent="blue" />
        <StatTile label="Cash in hand" value={formatCurrency(balances.cashInHand)} accent="emerald" />
        <StatTile label="Expense total" value={formatCurrency(totals.total)} accent="slate" />
        <StatTile label="Income total" value={formatCurrency(incomeTotals.total)} accent="orange" />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Cash expense" value={formatCurrency(totals.cash)} accent="blue" />
        <StatTile label="Online expense" value={formatCurrency(totals.online)} accent="slate" />
        <StatTile label="Debt principal" value={formatCurrency(debtSummary.total)} accent="orange" />
        <StatTile
          label="Debt remaining"
          value={isDebtLoading ? "..." : formatCurrency(debtSummary.remaining)}
          accent="emerald"
        />
      </section>

      <SectionCard eyebrow="Expenses" title="Recent expenses">
        <StatusBanner tone="info" message={isBootstrapping ? "Loading..." : ""} />
        <StatusBanner tone="error" message={requestError} className="mt-4" />
        <div className="mt-4 overflow-hidden rounded-[20px] border border-[var(--border)]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--border)] bg-[var(--surface)]">
              <thead className="bg-[var(--surface-soft)] text-left text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                <tr>
                  <th className="px-4 py-4 font-medium">Description</th>
                  <th className="px-4 py-4 font-medium">Category</th>
                  <th className="px-4 py-4 font-medium">Payment</th>
                  <th className="px-4 py-4 font-medium">Amount</th>
                  <th className="px-4 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-sm text-[var(--muted)]">
                {recentExpenses.length ? (
                  recentExpenses.map((expense) => (
                    <tr key={`${expense.id}-${expense.date}`}>
                      <td className="px-4 py-4 font-medium text-[var(--text)]">
                        {expense.description}
                      </td>
                      <td className="px-4 py-4">{expense.category}</td>
                      <td className="px-4 py-4">{expense.paymentMode}</td>
                      <td className="px-4 py-4 font-semibold text-[var(--text)]">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="px-4 py-4">{formatDate(expense.date)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-10 text-center" colSpan="5">
                      No expenses yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>

      <SectionCard eyebrow="Income" title="Recent incomes">
        <div className="overflow-hidden rounded-[20px] border border-[var(--border)]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--border)] bg-[var(--surface)]">
              <thead className="bg-[var(--surface-soft)] text-left text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                <tr>
                  <th className="px-4 py-4 font-medium">Description</th>
                  <th className="px-4 py-4 font-medium">Payment</th>
                  <th className="px-4 py-4 font-medium">Amount</th>
                  <th className="px-4 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-sm text-[var(--muted)]">
                {recentIncomes.length ? (
                  recentIncomes.map((income) => (
                    <tr key={`${income.id}-${income.date}`}>
                      <td className="px-4 py-4 font-medium text-[var(--text)]">
                        {income.description}
                      </td>
                      <td className="px-4 py-4">{income.paymentMode}</td>
                      <td className="px-4 py-4 font-semibold text-[var(--text)]">
                        {formatCurrency(income.amount)}
                      </td>
                      <td className="px-4 py-4">{formatDate(income.date)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-10 text-center" colSpan="4">
                      No incomes yet.
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
