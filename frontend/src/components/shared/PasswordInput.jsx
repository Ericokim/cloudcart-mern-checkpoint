import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const baseInputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm outline-none transition focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-200";

export function PasswordInput({ id, value, onChange, placeholder, autoComplete }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        className={baseInputClass}
        id={id}
        type={show ? "text" : "password"}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <button
        className="absolute inset-y-0 right-3 inline-flex items-center text-slate-400 transition hover:text-slate-700 focus:outline-none focus:text-slate-700"
        type="button"
        onClick={() => setShow((current) => !current)}
        aria-label={show ? "Hide password" : "Show password"}
        aria-pressed={show}
      >
        {show ? <EyeOff aria-hidden="true" size={18} /> : <Eye aria-hidden="true" size={18} />}
      </button>
    </div>
  );
}
