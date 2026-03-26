import { useState } from "react";
import { Link } from "react-router-dom";
import { Field, StatusBanner } from "../components/FormControls";
import { signup } from "../lib/api";

const initialState = {
  name: "",
  userName: "",
  email: "",
  password: "",
};

function SignupPage() {
  const [values, setValues] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      await signup(values);
      setValues(initialState);
      setSuccessMessage("Account created. You can login now.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">
        Signup
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text)]">Create account</h1>

      <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
        <StatusBanner tone="error" message={errorMessage} />
        <StatusBanner tone="success" message={successMessage} />
        <Field
          label="Name"
          value={values.name}
          onChange={(event) =>
            setValues((current) => ({ ...current, name: event.target.value }))
          }
          placeholder="Raghu"
          required
        />
        <Field
          label="Username"
          value={values.userName}
          onChange={(event) =>
            setValues((current) => ({ ...current, userName: event.target.value }))
          }
          placeholder="Raghu123"
          required
        />
        <Field
          label="Email"
          type="email"
          value={values.email}
          onChange={(event) =>
            setValues((current) => ({ ...current, email: event.target.value }))
          }
          placeholder="raghu460@gmail.com"
          required
        />
        <Field
          label="Password"
          type="password"
          value={values.password}
          onChange={(event) =>
            setValues((current) => ({ ...current, password: event.target.value }))
          }
          placeholder="Create a password"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-[16px] bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Creating account..." : "Signup"}
        </button>
      </form>

      <p className="mt-5 text-sm text-[var(--muted)]">
        Already registered?{" "}
        <Link to="/auth/login" className="font-semibold text-[var(--brand)] hover:opacity-90">
          Login here
        </Link>
      </p>
    </div>
  );
}

export default SignupPage;
