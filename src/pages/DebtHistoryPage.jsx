import { useMemo, useState } from "react";
import {
  Field,
  SectionCard,
  SelectField,
  StatTile,
  StatusBanner,
} from "../components/FormControls";
import { useFinance } from "../context/FinanceContext";
import { paymentModes } from "../lib/api";
import { formatCurrency, formatDate } from "../lib/format";

function DebtHistoryPage() {
  const { debts, isDebtLoading, payDebtEntry, removeDebt, requestError } = useFinance();
  const [expandedDebtId, setExpandedDebtId] = useState(null);
  const [activeDebtId, setActiveDebtId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentForms, setPaymentForms] = useState({});

  const debtSummary = useMemo(
    () =>
      debts.reduce(
        (summary, debt) => {
          summary.total += Number(debt.amount ?? 0);
          summary.remaining += Number(debt.remainingAmount ?? 0);
          summary.ledgerCount += debt.ledgers?.length ?? 0;
          return summary;
        },
        { total: 0, remaining: 0, ledgerCount: 0 },
      ),
    [debts],
  );

  function getPaymentForm(debtId) {
    return (
      paymentForms[debtId] ?? {
        amount: "",
        paymentMode: paymentModes[0],
        description: "",
      }
    );
  }

  function updatePaymentForm(debtId, field, value) {
    setPaymentForms((current) => ({
      ...current,
      [debtId]: {
        ...getPaymentForm(debtId),
        [field]: value,
      },
    }));
  }

  async function handlePayDebt(event, debtId) {
    event.preventDefault();
    setStatusMessage("");
    setErrorMessage("");
    setActiveDebtId(debtId);

    try {
      const form = getPaymentForm(debtId);
      await payDebtEntry({
        debtId,
        amount: Number(form.amount),
        paymentMode: form.paymentMode,
        description: form.description,
      });

      setPaymentForms((current) => ({
        ...current,
        [debtId]: {
          amount: "",
          paymentMode: paymentModes[0],
          description: "",
        },
      }));
      setStatusMessage("Debt payment recorded successfully.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setActiveDebtId(null);
    }
  }

  async function handleDeleteDebt(debtId) {
    const confirmed = window.confirm(
      "Delete this debt and reverse its balance impact? All related ledger payments will also be removed.",
    );

    if (!confirmed) {
      return;
    }

    setStatusMessage("");
    setErrorMessage("");
    setActiveDebtId(debtId);

    try {
      await removeDebt(debtId);
      setStatusMessage("Debt deleted successfully.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setActiveDebtId(null);
    }
  }

  return (
    <div className="space-y-6">
      <SectionCard
        eyebrow="Debt ledger"
        title="Manage debts and repayment history"
        description="Each debt shows its remaining amount, historical status, and nested ledger entries for every payment."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <StatTile
            label="Debt principal"
            value={formatCurrency(debtSummary.total)}
            accent="blue"
          />
          <StatTile
            label="Remaining amount"
            value={formatCurrency(debtSummary.remaining)}
            accent="slate"
          />
          <StatTile
            label="Ledger entries"
            value={String(debtSummary.ledgerCount)}
            accent="emerald"
          />
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Debt records"
        title="All debts"
        description="Pay down individual debts, inspect ledger rows, or delete a debt with full reversal."
      >
        <StatusBanner tone="success" message={statusMessage} className="mb-4" />
        <StatusBanner tone="error" message={errorMessage || requestError} className="mb-4" />

        <div className="space-y-4">
          {isDebtLoading ? (
            <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-400">
              Loading debt records...
            </div>
          ) : debts.length ? (
            debts.map((debt) => {
              const paymentForm = getPaymentForm(debt.id);
              const isExpanded = expandedDebtId === debt.id;
              const isBusy = activeDebtId === debt.id;

              return (
                <article
                  key={debt.id}
                  className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)]"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                          {debt.paymentMode}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                            debt.isHistorical
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {debt.isHistorical ? "Historical" : "Active balance impact"}
                        </span>
                      </div>
                      <h3 className="text-2xl font-semibold text-slate-950">
                        {debt.description}
                      </h3>
                      <p className="text-sm text-slate-500">
                        Created on {formatDate(debt.date)}
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <MiniStat label="Original" value={formatCurrency(debt.amount)} />
                      <MiniStat
                        label="Remaining"
                        value={formatCurrency(debt.remainingAmount)}
                      />
                      <MiniStat
                        label="Ledger rows"
                        value={String(debt.ledgers?.length ?? 0)}
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedDebtId((current) => (current === debt.id ? null : debt.id))
                      }
                      className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                    >
                      {isExpanded ? "Hide details" : "Show details"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDeleteDebt(debt.id)}
                      disabled={isBusy}
                      className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isBusy ? "Working..." : "Delete debt"}
                    </button>
                  </div>

                  {isExpanded ? (
                    <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Make payment
                        </p>
                        <form
                          className="mt-4 grid gap-4"
                          onSubmit={(event) => void handlePayDebt(event, debt.id)}
                        >
                          <Field
                            label="Amount"
                            type="number"
                            min="0"
                            step="0.01"
                            max={Number(debt.remainingAmount)}
                            value={paymentForm.amount}
                            onChange={(event) =>
                              updatePaymentForm(debt.id, "amount", event.target.value)
                            }
                            placeholder="500"
                            required
                          />
                          <SelectField
                            label="Payment mode"
                            value={paymentForm.paymentMode}
                            onChange={(event) =>
                              updatePaymentForm(debt.id, "paymentMode", event.target.value)
                            }
                            options={paymentModes}
                          />
                          <Field
                            label="Description"
                            value={paymentForm.description}
                            onChange={(event) =>
                              updatePaymentForm(debt.id, "description", event.target.value)
                            }
                            placeholder="Paid first installment"
                            required
                          />
                          <button
                            type="submit"
                            disabled={isBusy}
                            className="rounded-[18px] bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {isBusy ? "Saving..." : "Record payment"}
                          </button>
                        </form>
                      </div>

                      <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Ledger entries
                        </p>
                        <div className="mt-4 overflow-hidden rounded-[20px] border border-slate-200">
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 bg-white">
                              <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.18em] text-slate-400">
                                <tr>
                                  <th className="px-4 py-3 font-medium">Amount</th>
                                  <th className="px-4 py-3 font-medium">Mode</th>
                                  <th className="px-4 py-3 font-medium">Description</th>
                                  <th className="px-4 py-3 font-medium">Date</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                                {debt.ledgers?.length ? (
                                  debt.ledgers.map((ledger) => (
                                    <tr key={ledger.id}>
                                      <td className="px-4 py-3 font-semibold text-slate-900">
                                        {formatCurrency(ledger.amount)}
                                      </td>
                                      <td className="px-4 py-3">{ledger.paymentMode}</td>
                                      <td className="px-4 py-3">{ledger.description}</td>
                                      <td className="px-4 py-3">{formatDate(ledger.date)}</td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td
                                      className="px-4 py-8 text-center text-slate-400"
                                      colSpan="4"
                                    >
                                      No payments recorded for this debt yet.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })
          ) : (
            <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-400">
              No debts recorded yet.
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}

export default DebtHistoryPage;
