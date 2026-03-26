export function formatCurrency(value) {
  const numericValue = Number(value ?? 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(numericValue) ? numericValue : 0);
}

export function formatDate(value) {
  if (!value) {
    return "--";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function normaliseTotalsResponse(payload, fallbackExpenses = []) {
  const computed = fallbackExpenses.reduce(
    (summary, expense) => {
      const amount = Number(expense.amount ?? 0);
      const mode = String(expense.paymentMode ?? "").toUpperCase();

      summary.total += amount;

      if (mode === "CASH") {
        summary.cash += amount;
      }

      if (mode === "ONLINE") {
        summary.online += amount;
      }

      return summary;
    },
    { total: 0, cash: 0, online: 0 },
  );

  if (typeof payload === "number") {
    return {
      total: payload,
      cash: computed.cash,
      online: computed.online,
    };
  }

  if (typeof payload === "string" && payload.trim() !== "") {
    const value = Number(payload);
    return {
      total: Number.isFinite(value) ? value : computed.total,
      cash: computed.cash,
      online: computed.online,
    };
  }

  if (payload && typeof payload === "object") {
    return {
      total: Number(
        payload.total ??
          payload.totalAmount ??
          payload.totalExpense ??
          payload.totalAmountSpend ??
          payload.totalAmountSpent ??
          computed.total,
      ),
      cash: Number(
        payload.cash ??
          payload.cashAmount ??
          payload.totalCashExpense ??
          payload.totalCash ??
          payload.totalAmountSpendInCash ??
          payload.totalAmountSpentInCash ??
          computed.cash,
      ),
      online: Number(
        payload.online ??
          payload.onlineAmount ??
          payload.totalOnlineExpense ??
          payload.totalOnline ??
          payload.totalAmountSpentInOnline ??
          payload.totalAmountSpendInOnline ??
          payload.totalAmountSpentOnline ??
          computed.online,
      ),
    };
  }

  return computed;
}

export function normaliseIncomeTotalsResponse(payload, fallbackIncomes = []) {
  const computed = fallbackIncomes.reduce(
    (summary, income) => {
      const amount = Number(income.amount ?? 0);
      const mode = String(income.paymentMode ?? "").toUpperCase();

      summary.total += amount;

      if (mode === "CASH") {
        summary.cash += amount;
      }

      if (mode === "ONLINE") {
        summary.online += amount;
      }

      return summary;
    },
    { total: 0, cash: 0, online: 0 },
  );

  if (!payload || typeof payload !== "object") {
    return computed;
  }

  return {
    total: Number(payload.totalIncome ?? payload.total ?? computed.total),
    cash: Number(payload.totalCashIncome ?? payload.cash ?? computed.cash),
    online: Number(payload.totalOnlineIncome ?? payload.online ?? computed.online),
  };
}
