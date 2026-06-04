import { useEffect, useState } from "react";

const toastStyles = {
  error: "border-red-200 bg-red-50 text-red-900",
  info: "border-slate-200 bg-white text-slate-900",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900"
};

export function Toast({ message, type = "info" }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) {
      return undefined;
    }
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, [message, type]);

  if (!message) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed right-5 top-5 z-50 max-w-sm rounded-2xl border px-4 py-3 text-sm font-semibold shadow-lg transition-opacity duration-300 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      } ${toastStyles[type] || toastStyles.info}`}
    >
      {message}
    </div>
  );
}
