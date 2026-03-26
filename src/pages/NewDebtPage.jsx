import { useState } from "react";
import {
  Field,
  SectionCard,
  SelectField,
  StatTile,
  StatusBanner,
} from "../components/FormControls";
import { useFinance } from "../context/FinanceContext";
import { paymentModes } from "../lib/api";
import { formatCurrency } from "../lib/format";

const initialState = {
  amount: "",
  description: "",
  paymentMode: paymentModes[0],
  isHistorical: false,
};

function NewDebtPage() {
  const { balances, createDebtEntry } = useFinance();
  const [values, setValues] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatusMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await createDebtEntry({
        amount: Number(values.amount),
        description: values.description,
        paymentMode: values.paymentMode,
        isHistorical: values.isHistorical,
      });
      setValues(initialState);
      setStatusMessage("Debt created successfully.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <SectionCard
        eyebrow="New debt"
        title="Create debt"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <StatTile
            label="Incoming mode"
            value={values.paymentMode}
            accent="blue"
          />
          <StatTile
            label="Debt amount"
            value={formatCurrency(values.amount || 0)}
            accent="orange"
          />
          <StatTile
            label="Historical"
            value={values.isHistorical ? "Yes" : "No"}
            accent="emerald"
          />
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Form"
        title="Debt entry"
        aside={
          <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--muted)]">
            Cash: <span className="font-semibold text-[var(--text)]">{formatCurrency(balances.cashInHand)}</span>
            <br />
            Bank: <span className="font-semibold text-[var(--text)]">{formatCurrency(balances.bankBalance)}</span>
          </div>
        }
      >
        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <StatusBanner tone="success" message={statusMessage} className="md:col-span-2" />
          <StatusBanner tone="error" message={errorMessage} className="md:col-span-2" />
          <Field
            label="Amount"
            type="number"
            min="0"
            step="0.01"
            value={values.amount}
            onChange={(event) =>
              setValues((current) => ({ ...current, amount: event.target.value }))
            }
            placeholder="5000"
            required
          />
          <SelectField
            label="Payment mode"
            value={values.paymentMode}
            onChange={(event) =>
              setValues((current) => ({ ...current, paymentMode: event.target.value }))
            }
            options={paymentModes}
          />
          <Field
            label="Description"
            value={values.description}
            onChange={(event) =>
              setValues((current) => ({ ...current, description: event.target.value }))
            }
            placeholder="Borrowed from family"
            required
            className="md:col-span-2"
          />
          <label className="md:col-span-2 flex items-start gap-3 rounded-[20px] border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-4">
            <input
              type="checkbox"
              checked={values.isHistorical}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  isHistorical: event.target.checked,
                }))
              }
              className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>
              <span className="block text-sm font-semibold text-slate-900">
                Mark as historical debt
              </span>
              <span className="mt-1 block text-sm leading-6 text-[var(--muted)]">
                Keep this checked for past debts that should not change current balances.
              </span>
            </span>
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-[16px] bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Creating debt..." : "Create debt"}
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}

export default NewDebtPage;
