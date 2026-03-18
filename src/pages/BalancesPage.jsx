import { useState } from "react";
import {
  Field,
  SectionCard,
  StatTile,
  StatusBanner,
} from "../components/FormControls";
import { useFinance } from "../context/FinanceContext";
import { formatCurrency } from "../lib/format";

const initialState = {
  cashInHand: "",
  bankBalance: "",
};

function BalancesPage() {
  const { balances, saveBalances } = useFinance();
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
      await saveBalances({
        cashInHand: Number(values.cashInHand),
        bankBalance: Number(values.bankBalance),
      });

      setValues(initialState);
      setStatusMessage("Balances updated successfully.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <SectionCard
        eyebrow="Balances"
        title="Update cash and bank values"
        description="This page is dedicated to the `/user/updateBalance` endpoint so the action has its own space."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <StatTile
            label="Current bank balance"
            value={formatCurrency(balances.bankBalance)}
            accent="blue"
          />
          <StatTile
            label="Current cash in hand"
            value={formatCurrency(balances.cashInHand)}
            accent="emerald"
          />
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Balance form"
        title="Push updated balances"
        description="Send the latest values to your backend and keep the cached balance cards fresh."
      >
        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <StatusBanner tone="success" message={statusMessage} className="md:col-span-2" />
          <StatusBanner tone="error" message={errorMessage} className="md:col-span-2" />
          <Field
            label="Cash in hand"
            type="number"
            min="0"
            step="0.01"
            value={values.cashInHand}
            onChange={(event) =>
              setValues((current) => ({ ...current, cashInHand: event.target.value }))
            }
            placeholder="12000"
            required
            className="md:col-span-1"
          />
          <Field
            label="Bank balance"
            type="number"
            min="0"
            step="0.01"
            value={values.bankBalance}
            onChange={(event) =>
              setValues((current) => ({ ...current, bankBalance: event.target.value }))
            }
            placeholder="25000"
            required
            className="md:col-span-1"
          />
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-[20px] bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : "Update balance"}
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}

export default BalancesPage;
