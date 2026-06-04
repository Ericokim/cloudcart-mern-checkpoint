import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthLayout } from "../../components/shared/AuthLayout";
import { PasswordInput } from "../../components/shared/PasswordInput";
import { Toast } from "../../components/shared/Toast";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../lib/api/client";

const inputClass =
  "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-200";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "info" });

  async function handleSubmit(event) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setToast({ message: "Enter your email and password.", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setToast({ message: "Signing in...", type: "info" });
    try {
      await login({ email: email.trim(), password });
      setToast({ message: "Signed in.", type: "success" });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setToast({ message: getErrorMessage(error, "Sign in failed."), type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <Toast message={toast.message} type={toast.type} />
      <div className="grid gap-5 rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-600">Sign in to track your orders.</p>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-bold text-slate-900" htmlFor="email">
            Email
            <input
              className={inputClass}
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-slate-900" htmlFor="password">
            Password
            <PasswordInput
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
            />
          </label>

          <button
            className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:bg-slate-200 disabled:text-slate-500"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-sm text-slate-600">
          No account?{" "}
          <Link className="font-semibold text-amber-600 hover:underline" to="/register">
            Create one
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
