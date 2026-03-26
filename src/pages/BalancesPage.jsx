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

    const cashInHand = Number(values.cashInHand);
    const bankBalance = Number(values.bankBalance);

    if (Number.isNaN(cashInHand) || Number.isNaN(bankBalance)) {
      setErrorMessage("Please enter valid numbers for both balances.");
      return;
    }

    if (cashInHand < 0) {
      setErrorMessage("Cash in hand cannot be negative.");
      return;
    }

    const confirmed = window.confirm(
      "Update balances now? This will overwrite current Cash in Hand and Bank Balance values.",
    );

    if (!confirmed) {
      return;
    }

    setIsSubmitting(true);

    try {
      await saveBalances({
        cashInHand,
        bankBalance,
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
        title="Update balances"
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
        eyebrow="Form"
        title="Set cash and bank balance"
        description="Cash cannot be negative. Bank balance can be negative."
      >
        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <StatusBanner tone="success" message={statusMessage} className="md:col-span-2" />
          <StatusBanner tone="error" message={errorMessage} className="md:col-span-2" />
          <StatusBanner
            tone="warning"
            message="Warning: this action overwrites both balances directly."
            className="md:col-span-2"
          />
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
              className="rounded-[16px] bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-70"
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
