import { useMemo, useState } from "react";
import {
  Field,
  SectionCard,
  SelectField,
  StatTile,
  StatusBanner,
} from "../components/FormControls";
import { useFinance } from "../context/FinanceContext";
import { formatCurrency, formatDate } from "../lib/format";

const initialFilters = {
  startDate: "",
  endDate: "",
};

function IncomeHistoryPage() {
  const {
    incomeTotals,
    incomes,
    isIncomeLoading,
    isRefreshing,
    loadAllIncomes,
    refreshIncomeTotals,
    removeIncome,
    requestError,
  } = useFinance();
  const [filters, setFilters] = useState(initialFilters);
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingIncomeId, setDeletingIncomeId] = useState(null);

  const hasFilters = filters.startDate !== "" || filters.endDate !== "";

  function getDeleteErrorMessage(error) {
    const raw = String(error?.message ?? "");
    if (raw.toLowerCase().includes("can't connect to the server")) {
      return "Could not delete because app can't connect to backend.";
    }
    return raw || "Delete failed. Please try again.";
  }

  async function handleApply(event) {
    event.preventDefault();
    setStatusMessage("");
    setErrorMessage("");

    try {
      await refreshIncomeTotals(filters);
      setStatusMessage("Filters applied.");
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleReset() {
    setFilters(initialFilters);
    setStatusMessage("");
    setErrorMessage("");

    try {
      await loadAllIncomes();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleDelete(incomeId) {
    const confirmed = window.confirm(
      "Delete this income? This cannot be undone. Balance will be adjusted automatically.",
    );

    if (!confirmed) {
      return;
    }

    setStatusMessage("");
    setErrorMessage("");
    setDeletingIncomeId(incomeId);

    try {
      await removeIncome(incomeId, {
        filters: hasFilters ? filters : null,
      });
      window.alert("Income deleted. Balance was updated.");
    } catch (error) {
      const message = getDeleteErrorMessage(error);
      setErrorMessage(message);
      window.alert(message);
    } finally {
      setDeletingIncomeId(null);
    }
  }

  const sortedIncomes = useMemo(() => {
    const filtered = incomes.filter((income) => {
      const incomeTime = new Date(income.date).getTime();
      if (!Number.isFinite(incomeTime)) {
        return true;
      }

      if (filters.startDate) {
        const start = new Date(`${filters.startDate}T00:00:00`).getTime();
        if (incomeTime < start) {
          return false;
        }
      }

      if (filters.endDate) {
        const end = new Date(`${filters.endDate}T23:59:59`).getTime();
        if (incomeTime > end) {
          return false;
        }
      }

      return true;
    });

    const modifier = sortConfig.direction === "asc" ? 1 : -1;
    filtered.sort((left, right) => {
      if (sortConfig.key === "amount" || sortConfig.key === "id") {
        return (Number(left[sortConfig.key]) - Number(right[sortConfig.key])) * modifier;
      }

      if (sortConfig.key === "date") {
        return (
          (new Date(left.date).getTime() - new Date(right.date).getTime()) * modifier
        );
      }

      return (
        String(left[sortConfig.key] ?? "").localeCompare(
          String(right[sortConfig.key] ?? ""),
        ) * modifier
      );
    });

    return filtered;
  }, [filters.endDate, filters.startDate, incomes, sortConfig]);

  return (
    <div className="space-y-6">
      <SectionCard eyebrow="Income" title="Income history">
        <div className="grid gap-4 md:grid-cols-3">
          <StatTile label="Total income" value={formatCurrency(incomeTotals.total)} accent="emerald" />
          <StatTile label="Cash income" value={formatCurrency(incomeTotals.cash)} accent="blue" />
          <StatTile label="Online income" value={formatCurrency(incomeTotals.online)} accent="slate" />
        </div>
      </SectionCard>

      <SectionCard eyebrow="Filters" title="Date filter and sorting">
        <form className="grid gap-5 lg:grid-cols-5" onSubmit={handleApply}>
          <StatusBanner tone="success" message={statusMessage} className="lg:col-span-5" />
          <StatusBanner tone="error" message={errorMessage} className="lg:col-span-5" />
          <Field
            label="Start date"
            type="date"
            value={filters.startDate}
            onChange={(event) =>
              setFilters((current) => ({ ...current, startDate: event.target.value }))
            }
          />
          <Field
            label="End date"
            type="date"
            value={filters.endDate}
            onChange={(event) =>
              setFilters((current) => ({ ...current, endDate: event.target.value }))
            }
          />
          <SelectField
            label="Sort by"
            value={sortConfig.key}
            onChange={(event) =>
              setSortConfig((current) => ({ ...current, key: event.target.value }))
            }
            options={["date", "amount", "description", "paymentMode", "id"]}
          />
          <SelectField
            label="Direction"
            value={sortConfig.direction}
            onChange={(event) =>
              setSortConfig((current) => ({ ...current, direction: event.target.value }))
            }
            options={["desc", "asc"]}
          />
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => void handleReset()}
              className="w-full rounded-[16px] border border-[var(--border)] bg-[var(--surface-soft)] px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:brightness-95"
            >
              Reset
            </button>
          </div>
          <div className="lg:col-span-5">
            <button
              type="submit"
              disabled={isRefreshing}
              className="rounded-[16px] bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              Apply filters
            </button>
          </div>
        </form>
      </SectionCard>

      <SectionCard eyebrow="Entries" title="Income list">
        <StatusBanner tone="error" message={requestError} className="mb-4" />
        <div className="overflow-hidden rounded-[20px] border border-[var(--border)]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--border)] bg-[var(--surface)]">
              <thead className="bg-[var(--surface-soft)] text-left text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                <tr>
                  <th className="px-4 py-4 font-medium">ID</th>
                  <th className="px-4 py-4 font-medium">Amount</th>
                  <th className="px-4 py-4 font-medium">Description</th>
                  <th className="px-4 py-4 font-medium">Payment</th>
                  <th className="px-4 py-4 font-medium">Date</th>
                  <th className="px-4 py-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-sm text-[var(--muted)]">
                {isIncomeLoading ? (
                  <tr>
                    <td className="px-4 py-10 text-center" colSpan="6">
                      Loading incomes...
                    </td>
                  </tr>
                ) : sortedIncomes.length ? (
                  sortedIncomes.map((income) => (
                    <tr key={`${income.id}-${income.date}`}>
                      <td className="px-4 py-4">{income.id ?? "--"}</td>
                      <td className="px-4 py-4 font-semibold text-[var(--text)]">
                        {formatCurrency(income.amount)}
                      </td>
                      <td className="px-4 py-4">{income.description}</td>
                      <td className="px-4 py-4">{income.paymentMode}</td>
                      <td className="px-4 py-4">{formatDate(income.date)}</td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => void handleDelete(income.id)}
                          disabled={deletingIncomeId === income.id || isRefreshing}
                          className="rounded-full border border-rose-300/60 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-500/20 dark:text-rose-300"
                        >
                          {deletingIncomeId === income.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-10 text-center" colSpan="6">
                      No incomes found.
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

export default IncomeHistoryPage;
