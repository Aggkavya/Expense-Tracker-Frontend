import { useState } from "react";
import {
  Field,
  SectionCard,
  SelectField,
  StatTile,
  StatusBanner,
} from "../components/FormControls";
import { useFinance } from "../context/FinanceContext";
import { expenseCategories, paymentModes } from "../lib/api";
import { formatCurrency } from "../lib/format";

const initialState = {
  amount: "",
  description: "",
  category: expenseCategories[0],
  paymentMode: paymentModes[0],
};

function NewExpensePage() {
  const { addExpense, balances } = useFinance();
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
      await addExpense({
        ...values,
        amount: Number(values.amount),
      });

      setValues(initialState);
      setStatusMessage("Expense created successfully.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <SectionCard
        eyebrow="Create expense"
        title="Add a new expense without distractions"
        description="This page is focused only on the `newExpense` payload and keeps the form isolated from reporting controls."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <StatTile
            label="Selected category"
            value={values.category}
            accent="blue"
            detail="Enum values come from your current backend contract"
          />
          <StatTile
            label="Payment mode"
            value={values.paymentMode}
            accent="emerald"
            detail="Supports CASH and ONLINE"
          />
          <StatTile
            label="Current amount"
            value={formatCurrency(values.amount || 0)}
            accent="orange"
            detail="Preview of the amount to be submitted"
          />
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Expense form"
        title="Submit a new expense"
        description="The response will also refresh the overview totals and update stored balances when the backend returns them."
        aside={
          <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            Cash: <span className="font-semibold text-slate-900">{formatCurrency(balances.cashInHand)}</span>
            <br />
            Bank: <span className="font-semibold text-slate-900">{formatCurrency(balances.bankBalance)}</span>
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
            placeholder="320"
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
          <SelectField
            label="Category"
            value={values.category}
            onChange={(event) =>
              setValues((current) => ({ ...current, category: event.target.value }))
            }
            options={expenseCategories}
          />
          <Field
            label="Description"
            value={values.description}
            onChange={(event) =>
              setValues((current) => ({ ...current, description: event.target.value }))
            }
            placeholder="stationary"
            required
          />
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-[20px] bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Creating expense..." : "Create expense"}
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}

export default NewExpensePage;
