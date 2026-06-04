const toastStyles = {
  error: "border-red-200 bg-red-50 text-red-900",
  info: "border-slate-200 bg-white text-slate-900",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900"
};

export function Toast({ message, type = "info" }) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`fixed right-5 top-5 z-50 max-w-sm rounded-2xl border px-4 py-3 text-sm font-semibold shadow-lg ${
        toastStyles[type] || toastStyles.info
      }`}
    >
      {message}
    </div>
  );
}
