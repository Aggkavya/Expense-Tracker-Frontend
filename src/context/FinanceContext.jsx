import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  clearSession,
  createDebt,
  createExpense,
  deleteExpense,
  deleteDebt,
  getAllExpenses,
  getAllDebts,
  getBalance,
  getExpenseTotals,
  getFilteredExpenses,
  getStoredBalances,
  payDebt,
  setStoredBalances,
  updateBalance,
} from "../lib/api";
import { normaliseTotalsResponse } from "../lib/format";

const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [totals, setTotals] = useState({ total: 0, cash: 0, online: 0 });
  const [balances, setBalances] = useState(getStoredBalances());
  const [debts, setDebts] = useState([]);
  const [activeCollection, setActiveCollection] = useState("all");
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDebtLoading, setIsDebtLoading] = useState(true);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const [requestError, setRequestError] = useState("");

  useEffect(() => {
    void loadAllExpenses({ initial: true });
    void loadAllDebts({ initial: true });
  }, []);

  function persistBalances(nextBalances) {
    setBalances(nextBalances);
    setStoredBalances(nextBalances);
  }

  async function refreshBalances() {
    const response = await getBalance();
    const nextBalances = {
      cashInHand: response.cashInHand,
      bankBalance: response.bankBalance,
    };

    persistBalances(nextBalances);
    return nextBalances;
  }

  async function loadAllDebts(options = {}) {
    const { initial = false } = options;

    if (initial) {
      setIsDebtLoading(true);
    }

    try {
      const allDebts = await getAllDebts();
      setDebts(Array.isArray(allDebts) ? allDebts : []);
    } catch (error) {
      if (!handleAuthError(error)) {
        setRequestError(error.message);
      }
    } finally {
      if (initial) {
        setIsDebtLoading(false);
      }
    }
  }

  function handleAuthError(error) {
    if (
      error?.status === 401 ||
      error?.status === 403 ||
      error.message?.toLowerCase().includes("jwt")
    ) {
      clearSession();
      navigate("/auth/login", { replace: true });
      return true;
    }

    return false;
  }

  async function loadAllExpenses(options = {}) {
    const { initial = false } = options;
    setRequestError("");

    if (initial) {
      setIsBootstrapping(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const [allExpenses, totalsPayload, balancePayload] = await Promise.all([
        getAllExpenses(),
        getExpenseTotals({}),
        getBalance(),
      ]);

      const expenseList = Array.isArray(allExpenses) ? allExpenses : [];
      const nextTotals = normaliseTotalsResponse(totalsPayload, expenseList);
      const nextBalances = {
        cashInHand: balancePayload.cashInHand,
        bankBalance: balancePayload.bankBalance,
      };

      startTransition(() => {
        persistBalances(nextBalances);
        setExpenses(expenseList);
        setTotals(nextTotals);
        setActiveCollection("all");
        setLastUpdatedAt(new Date().toISOString());
      });
    } catch (error) {
      if (!handleAuthError(error)) {
        setRequestError(error.message);
      }
    } finally {
      if (initial) {
        setIsBootstrapping(false);
      } else {
        setIsRefreshing(false);
      }
    }
  }

  async function applyExpenseFilters(filters) {
    setIsRefreshing(true);
    setRequestError("");

    try {
      const [filteredExpenses, totalsPayload, balancePayload] = await Promise.all([
        getFilteredExpenses(filters),
        getExpenseTotals(filters),
        getBalance(),
      ]);

      const expenseList = Array.isArray(filteredExpenses) ? filteredExpenses : [];
      const nextTotals = normaliseTotalsResponse(totalsPayload, expenseList);
      const nextBalances = {
        cashInHand: balancePayload.cashInHand,
        bankBalance: balancePayload.bankBalance,
      };

      startTransition(() => {
        persistBalances(nextBalances);
        setExpenses(expenseList);
        setTotals(nextTotals);
        setActiveCollection("filtered");
        setLastUpdatedAt(new Date().toISOString());
      });
    } catch (error) {
      if (!handleAuthError(error)) {
        setRequestError(error.message);
      }
    } finally {
      setIsRefreshing(false);
    }
  }

  async function saveBalances(payload) {
    try {
      const response = await updateBalance(payload);
      const nextBalances = {
        cashInHand: response.cashInHand,
        bankBalance: response.bankBalance,
      };

      persistBalances(nextBalances);
      return nextBalances;
    } catch (error) {
      if (!handleAuthError(error)) {
        throw error;
      }

      return null;
    }
  }

  async function addExpense(payload) {
    try {
      const response = await createExpense(payload);

      await loadAllExpenses();
      return response;
    } catch (error) {
      if (!handleAuthError(error)) {
        throw error;
      }

      return null;
    }
  }

  async function createDebtEntry(payload) {
    try {
      const response = await createDebt(payload);
      await Promise.all([refreshBalances(), loadAllDebts()]);
      return response;
    } catch (error) {
      if (!handleAuthError(error)) {
        throw error;
      }

      return null;
    }
  }

  async function payDebtEntry(payload) {
    try {
      const response = await payDebt(payload);
      await Promise.all([refreshBalances(), loadAllDebts()]);
      return response;
    } catch (error) {
      if (!handleAuthError(error)) {
        throw error;
      }

      return null;
    }
  }

  async function removeDebt(debtId) {
    try {
      const response = await deleteDebt(debtId);
      await Promise.all([refreshBalances(), loadAllDebts()]);
      return response;
    } catch (error) {
      if (!handleAuthError(error)) {
        throw error;
      }

      return null;
    }
  }

  async function removeExpense(expenseId, options = {}) {
    const { filters = null } = options;

    try {
      const response = await deleteExpense(expenseId);
      await refreshBalances();

      if (filters) {
        await applyExpenseFilters(filters);
      } else {
        await loadAllExpenses();
      }

      return response;
    } catch (error) {
      if (!handleAuthError(error)) {
        throw error;
      }

      return null;
    }
  }

  return (
    <FinanceContext.Provider
      value={{
        activeCollection,
        addExpense,
        applyExpenseFilters,
        balances,
        createDebtEntry,
        debts,
        expenses,
        isDebtLoading,
        isBootstrapping,
        isRefreshing,
        lastUpdatedAt,
        loadAllDebts,
        loadAllExpenses,
        payDebtEntry,
        requestError,
        removeDebt,
        removeExpense,
        saveBalances,
        totals,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);

  if (!context) {
    throw new Error("useFinance must be used inside FinanceProvider.");
  }

  return context;
}
