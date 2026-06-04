import { Package } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getErrorMessage } from "../../lib/api/client";
import { getMyOrders } from "../../lib/api/orders";

const statusStyles = {
  Processing: "bg-amber-100 text-amber-900",
  Shipped: "bg-sky-100 text-sky-900",
  Delivered: "bg-emerald-100 text-emerald-900",
  Cancelled: "bg-red-100 text-red-900"
};

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function shortOrderId(id) {
  return `#${String(id).slice(-6).toUpperCase()}`;
}

function itemCount(order) {
  return order.items.reduce((count, item) => count + item.quantity, 0);
}

export function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (loadError) {
      setError(getErrorMessage(loadError, "Could not load your orders."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <main className="mx-auto grid max-w-3xl content-start gap-5 px-4 py-6">
      <header className="grid gap-1">
        <h1 className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
          <Package aria-hidden="true" size={22} />
          My orders
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Track everything you have ordered from CloudCart.
        </p>
        {!isLoading && !error && orders.length > 0 && (
          <p className="text-sm font-semibold text-slate-700">
            {orders.length} order{orders.length === 1 ? "" : "s"} placed
          </p>
        )}
      </header>

      {isLoading && (
        <div className="grid gap-3">
          {[1, 2].map((item) => (
            <div className="h-28 rounded-2xl bg-white ring-1 ring-slate-200" key={item} />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <section className="rounded-2xl border border-dashed border-red-300 bg-white p-6 text-center">
          <p className="font-bold text-slate-900">{error}</p>
          <button
            className="mt-4 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            type="button"
            onClick={loadOrders}
          >
            Try again
          </button>
        </section>
      )}

      {!isLoading && !error && orders.length === 0 && (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <Package aria-hidden="true" size={32} className="mx-auto text-slate-300" />
          <h2 className="mt-3 text-xl font-bold text-slate-900">No orders yet</h2>
          <p className="mt-2 text-sm text-slate-600">Your placed orders will appear here.</p>
          <Link
            className="mt-4 inline-block rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            to="/"
          >
            Start shopping
          </Link>
        </section>
      )}

      {!isLoading && !error && orders.length > 0 && (
        <ul className="grid gap-4">
          {orders.map((order) => (
            <li className="grid gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200" key={order._id}>
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="grid gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <strong className="text-base font-bold text-slate-900">
                      {shortOrderId(order._id)}
                    </strong>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        statusStyles[order.status] || statusStyles.Processing
                      }`}
                    >
                      {order.status || "Processing"}
                    </span>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {formatDate(order.createdAt)} · {itemCount(order)} item
                    {itemCount(order) === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Total
                  </span>
                  <strong className="text-lg font-bold text-slate-900">
                    ${order.total.toFixed(2)}
                  </strong>
                </div>
              </div>

              <ul className="grid gap-3">
                {order.items.map((item, index) => (
                  <li className="flex items-center gap-3" key={index}>
                    <img
                      className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-slate-200"
                      src={item.image}
                      alt={item.name}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-900">{item.name}</p>
                      <p className="text-xs font-semibold text-slate-500">
                        Qty {item.quantity} · ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-slate-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                className="justify-self-start text-sm font-semibold text-slate-600 underline-offset-2 transition hover:text-slate-900 hover:underline"
                to="/"
              >
                Continue shopping
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
