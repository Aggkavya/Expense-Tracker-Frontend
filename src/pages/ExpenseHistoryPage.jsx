import { useMemo, useState } from "react";
import {
  Field,
  SectionCard,
  SelectField,
  StatTile,
  StatusBanner,
} from "../components/FormControls";
import { useFinance } from "../context/FinanceContext";
import { expenseCategories } from "../lib/api";
import { formatCurrency, formatDate } from "../lib/format";

const initialFilters = {
  category: "",
  startDate: "",
  endDate: "",
};

function ExpenseHistoryPage() {
  const {
    activeCollection,
    applyExpenseFilters,
    expenses,
    isBootstrapping,
    isRefreshing,
    loadAllExpenses,
    removeExpense,
    requestError,
    totals,
  } = useFinance();
  const [filters, setFilters] = useState(initialFilters);
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingExpenseId, setDeletingExpenseId] = useState(null);

  async function handleApply(event) {
    event.preventDefault();
    setStatusMessage("");
    setErrorMessage("");

    try {
      await applyExpenseFilters(filters);
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
      await loadAllExpenses();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleDelete(expenseId) {
    const hasFilters =
      filters.category !== "" || filters.startDate !== "" || filters.endDate !== "";
    const confirmed = window.confirm(
      "Delete this expense? The backend will restore the amount back to cash or bank balance.",
    );

    if (!confirmed) {
      return;
    }

    setStatusMessage("");
    setErrorMessage("");
    setDeletingExpenseId(expenseId);

    try {
      await removeExpense(expenseId, {
        filters: hasFilters ? filters : null,
      });
      setStatusMessage("Expense deleted successfully.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setDeletingExpenseId(null);
    }
  }

  const sortedExpenses = useMemo(() => {
    const cloned = [...expenses];
    const modifier = sortConfig.direction === "asc" ? 1 : -1;

    cloned.sort((left, right) => {
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

    return cloned;
  }, [expenses, sortConfig]);

  return (
    <div className="space-y-6">
      <SectionCard
        eyebrow="Expense history"
        title="Filter, total, and sort spending"
        description="This page keeps reporting separate from data entry so the workflow feels calmer and easier to scan."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <StatTile
            label={activeCollection === "filtered" ? "Filtered total" : "Total spend"}
            value={formatCurrency(totals.total)}
            accent="slate"
          />
          <StatTile
            label="Cash spend"
            value={formatCurrency(totals.cash)}
            accent="emerald"
          />
          <StatTile
            label="Online spend"
            value={formatCurrency(totals.online)}
            accent="blue"
          />
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Filters"
        title="Narrow the expense list"
        description="Supports category, start date, and end date, matching your current filter and total endpoints."
      >
        <form className="grid gap-5 lg:grid-cols-5" onSubmit={handleApply}>
          <StatusBanner tone="success" message={statusMessage} className="lg:col-span-5" />
          <StatusBanner tone="error" message={errorMessage} className="lg:col-span-5" />
          <SelectField
            label="Category"
            value={filters.category}
            onChange={(event) =>
              setFilters((current) => ({ ...current, category: event.target.value }))
            }
            options={expenseCategories}
            includeEmptyOption
            emptyLabel="All categories"
          />
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
            options={["date", "amount", "category", "paymentMode", "description", "id"]}
          />
          <SelectField
            label="Direction"
            value={sortConfig.direction}
            onChange={(event) =>
              setSortConfig((current) => ({ ...current, direction: event.target.value }))
            }
            options={["desc", "asc"]}
          />
          <div className="lg:col-span-5 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isRefreshing}
              className="rounded-[20px] bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isRefreshing ? "Applying..." : "Apply filters"}
            </button>
            <button
              type="button"
              onClick={() => void handleReset()}
              className="rounded-[20px] border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Reset
            </button>
          </div>
        </form>
      </SectionCard>

      <SectionCard
        eyebrow="Table"
        title="Expense list"
        description="All rows returned by the selected collection, sorted on the client for quick exploration."
      >
        <StatusBanner tone="error" message={requestError} className="mb-4" />
        <div className="overflow-hidden rounded-[24px] border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 bg-white">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.18em] text-slate-400">
                <tr>
                  <th className="px-4 py-4 font-medium">ID</th>
                  <th className="px-4 py-4 font-medium">Amount</th>
                  <th className="px-4 py-4 font-medium">Category</th>
                  <th className="px-4 py-4 font-medium">Description</th>
                  <th className="px-4 py-4 font-medium">Payment</th>
                  <th className="px-4 py-4 font-medium">Date</th>
                  <th className="px-4 py-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                {isBootstrapping ? (
                  <tr>
                    <td className="px-4 py-10 text-center text-slate-400" colSpan="7">
                      Loading expenses...
                    </td>
                  </tr>
                ) : sortedExpenses.length ? (
                  sortedExpenses.map((expense) => (
                    <tr key={`${expense.id}-${expense.date}`}>
                      <td className="px-4 py-4">{expense.id ?? "--"}</td>
                      <td className="px-4 py-4 font-semibold text-slate-900">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="px-4 py-4">{expense.category}</td>
                      <td className="px-4 py-4">{expense.description}</td>
                      <td className="px-4 py-4">{expense.paymentMode}</td>
                      <td className="px-4 py-4">{formatDate(expense.date)}</td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => void handleDelete(expense.id)}
                          disabled={deletingExpenseId === expense.id || isRefreshing}
                          className="rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingExpenseId === expense.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-10 text-center text-slate-400" colSpan="7">
                      No expenses found for the current selection.
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

export default ExpenseHistoryPage;
