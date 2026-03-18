import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import AuthShell from "./components/AuthShell";
import ProtectedRoute from "./components/ProtectedRoute";
import { FinanceProvider } from "./context/FinanceContext";
import BalancesPage from "./pages/BalancesPage";
import DebtHistoryPage from "./pages/DebtHistoryPage";
import ExpenseHistoryPage from "./pages/ExpenseHistoryPage";
import LoginPage from "./pages/LoginPage";
import NewDebtPage from "./pages/NewDebtPage";
import NewExpensePage from "./pages/NewExpensePage";
import OverviewPage from "./pages/OverviewPage";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthShell />}>
        <Route index element={<Navigate to="/auth/login" replace />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route
          element={
            <FinanceProvider>
              <AppShell />
            </FinanceProvider>
          }
        >
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/balances" element={<BalancesPage />} />
          <Route path="/expenses/new" element={<NewExpensePage />} />
          <Route path="/expenses/history" element={<ExpenseHistoryPage />} />
          <Route path="/debts/new" element={<NewDebtPage />} />
          <Route path="/debts/history" element={<DebtHistoryPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/overview" replace />} />
    </Routes>
  );
}

export default App;
