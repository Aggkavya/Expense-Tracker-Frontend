import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clearSession, getBalance, login, setSession } from "../lib/api";
import { Field, StatusBanner } from "../components/FormControls";

const initialState = {
  userName: "",
  password: "",
};

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const from = location.state?.from?.pathname ?? "/overview";

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await login(values);
      const token =
        response?.token ??
        response?.Token ??
        (typeof response === "string" ? response : null);

      if (!token) {
        throw new Error("Login succeeded but no token was returned by the backend.");
      }

      setSession(token, { userName: values.userName });
      await getBalance();
      navigate(from, { replace: true });
    } catch (error) {
      clearSession();
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
        Login
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
        Welcome back
      </h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
        Enter the same username and password fields your backend expects and continue into the tracker.
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <StatusBanner tone="error" message={errorMessage} />
        <Field
          label="Username"
          value={values.userName}
          onChange={(event) =>
            setValues((current) => ({ ...current, userName: event.target.value }))
          }
          placeholder="kavya123"
          required
        />
        <Field
          label="Password"
          type="password"
          value={values.password}
          onChange={(event) =>
            setValues((current) => ({ ...current, password: event.target.value }))
          }
          placeholder="Enter your password"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-[20px] bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
