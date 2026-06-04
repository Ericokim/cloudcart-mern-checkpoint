import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toast } from "../../components/shared/Toast";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../lib/api/client";

const inputClass =
  "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-200";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "info" });

  async function handleSubmit(event) {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setToast({ message: "Enter your name, email, and password.", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setToast({ message: "Creating account...", type: "info" });
    try {
      await register({ name: name.trim(), email: email.trim(), password });
      setToast({ message: "Account created.", type: "success" });
      navigate("/", { replace: true });
    } catch (error) {
      setToast({ message: getErrorMessage(error, "Registration failed."), type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto grid min-h-[70vh] max-w-md content-center gap-5 px-4 py-10">
      <Toast message={toast.message} type={toast.type} />
      <div className="grid gap-5 rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="mt-1 text-sm text-slate-600">Save your details for faster checkout.</p>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-bold text-slate-900" htmlFor="name">
            Name
            <input
              className={inputClass}
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Amina"
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-slate-900" htmlFor="email">
            Email
            <input
              className={inputClass}
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-slate-900" htmlFor="password">
            Password
            <input
              className={inputClass}
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
            />
          </label>

          <button
            className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:bg-slate-200 disabled:text-slate-500"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-sm text-slate-600">
          Already have an account?{" "}
          <Link className="font-semibold text-amber-600 hover:underline" to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
