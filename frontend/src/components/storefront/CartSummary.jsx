import { CreditCard, ShoppingBag, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCartContext } from "../../context/CartContext";

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56'><rect width='100%25' height='100%25' fill='%23e2e8f0'/></svg>";

export function CartSummary() {
  const { cart, total, removeFromCart } = useCartContext();
  const navigate = useNavigate();
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const isEmpty = cart.length === 0;

  return (
    <aside className="sticky top-5 grid content-start gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200 max-lg:static">
      <div className="flex items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 text-xl font-bold text-slate-900">
          <ShoppingBag aria-hidden="true" size={20} />
          Cart
        </h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
          {itemCount} item{itemCount === 1 ? "" : "s"}
        </span>
      </div>

      {isEmpty ? (
        <div className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
          <p className="text-slate-700">Your cart is empty.</p>
          <p className="mt-1 font-medium text-slate-500">
            Add this product to get started.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3">
          {cart.map((item) => (
            <li className="flex items-center gap-3" key={item.productId}>
              <img
                className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-slate-200"
                src={item.image || FALLBACK_IMAGE}
                alt={item.name}
                onError={(event) => {
                  event.currentTarget.src = FALLBACK_IMAGE;
                }}
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
              <button
                className="shrink-0 rounded-xl p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-200"
                type="button"
                aria-label={`Remove ${item.name} from cart`}
                onClick={() => removeFromCart(item.productId)}
              >
                <Trash2 aria-hidden="true" size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="grid gap-3 rounded-2xl bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-slate-600">Order total</span>
          <strong className="text-2xl font-bold text-slate-900">${total.toFixed(2)}</strong>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:bg-slate-200 disabled:text-slate-500"
          type="button"
          disabled={isEmpty}
          onClick={() => navigate("/")}
        >
          <CreditCard aria-hidden="true" size={17} />
          Proceed to checkout
        </button>
      </div>

      <Link
        className="justify-self-center text-sm font-semibold text-slate-600 underline-offset-2 transition hover:text-slate-900 hover:underline"
        to="/"
      >
        Continue shopping
      </Link>
    </aside>
  );
}
