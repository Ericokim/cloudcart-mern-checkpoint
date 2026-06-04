import { ArrowLeft, CreditCard, Mail, MapPin, Minus, Phone, Plus, ShoppingBag, Trash2, User } from "lucide-react";
import { useEffect, useState } from "react";

export function CartPanel({
  cart,
  cartTotal,
  customerEmail,
  customerName,
  customerPhone,
  deliveryAddress,
  isSubmitting,
  onCustomerEmailChange,
  onCustomerNameChange,
  onCustomerPhoneChange,
  onDeliveryAddressChange,
  onPlaceOrder,
  onRemoveFromCart,
  onUpdateQuantity
}) {
  const [step, setStep] = useState("cart");

  useEffect(() => {
    if (cart.length === 0) {
      setStep("cart");
    }
  }, [cart.length]);

  return (
    <aside className="sticky top-5 grid gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200 max-lg:static">
      <div className="flex items-start justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
          <ShoppingBag aria-hidden="true" size={24} />
          Cart
        </h2>
        {step === "checkout" && (
          <button
            className="inline-flex items-center gap-1 rounded-xl px-2 py-1 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
            type="button"
            onClick={() => setStep("cart")}
          >
            <ArrowLeft aria-hidden="true" size={16} />
            Back
          </button>
        )}
      </div>

      <div className="flex rounded-2xl bg-slate-100 p-1 text-sm font-semibold text-slate-600">
        <button
          className={`flex-1 rounded-xl px-3 py-2 transition ${
            step === "cart" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-900"
          }`}
          type="button"
          onClick={() => setStep("cart")}
        >
          Items
        </button>
        <button
          className={`flex-1 rounded-xl px-3 py-2 transition disabled:cursor-not-allowed disabled:opacity-50 ${
            step === "checkout" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-900"
          }`}
          type="button"
          onClick={() => setStep("checkout")}
          disabled={cart.length === 0}
        >
          Checkout
        </button>
      </div>

      {step === "cart" ? (
        <>
          {cart.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
              No items yet.
            </p>
          ) : (
            <ul className="grid gap-3">
              {cart.map((item) => (
                <li className="grid gap-3 border-b border-slate-200 pb-3" key={item.productId}>
                  <div className="grid grid-cols-[58px_minmax(0,1fr)] gap-3">
                    <img
                      className="h-14 w-14 rounded-xl object-cover ring-1 ring-slate-200"
                      src={item.image}
                      alt={item.name}
                    />
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <strong className="text-sm font-bold leading-5 text-slate-900">
                          {item.name}
                        </strong>
                        <span className="shrink-0 text-sm font-bold text-slate-700">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-900 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        type="button"
                        aria-label={`Decrease ${item.name} quantity`}
                        onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus aria-hidden="true" size={16} />
                      </button>
                      <span className="min-w-8 text-center text-sm font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-900 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                        type="button"
                        aria-label={`Increase ${item.name} quantity`}
                        onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus aria-hidden="true" size={16} />
                      </button>
                    </div>
                    <button
                      className="inline-flex items-center gap-1 rounded-2xl px-2 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
                      type="button"
                      aria-label={`Remove ${item.name} from cart`}
                      onClick={() => onRemoveFromCart(item.productId)}
                    >
                      <Trash2 aria-hidden="true" size={15} />
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="grid gap-3 rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-600">Order total</span>
              <strong className="text-2xl font-bold text-slate-900">${cartTotal.toFixed(2)}</strong>
            </div>
            <button
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:bg-slate-200 disabled:text-slate-500"
              type="button"
              disabled={cart.length === 0}
              onClick={() => setStep("checkout")}
            >
              Continue to checkout
            </button>
          </div>
        </>
      ) : (
        <form className="grid gap-4" onSubmit={onPlaceOrder}>
          <div className="grid gap-2 rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Order summary
            </p>
            {cart.map((item) => (
              <div className="flex items-center justify-between gap-3 text-sm" key={item.productId}>
                <span className="truncate font-semibold text-slate-700">
                  {item.quantity} x {item.name}
                </span>
                <span className="font-bold text-slate-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-3">
              <span className="text-sm font-semibold text-slate-600">Total</span>
              <strong className="text-2xl font-bold text-slate-900">${cartTotal.toFixed(2)}</strong>
            </div>
          </div>

          <label className="grid gap-2 text-sm font-bold text-slate-900" htmlFor="customerName">
            <span className="inline-flex items-center gap-2">
              <User aria-hidden="true" size={16} />
              Customer name
            </span>
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-200"
              id="customerName"
              value={customerName}
              onChange={(event) => onCustomerNameChange(event.target.value)}
              placeholder="Amina"
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-slate-900" htmlFor="customerEmail">
            <span className="inline-flex items-center gap-2">
              <Mail aria-hidden="true" size={16} />
              Email
            </span>
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-200"
              id="customerEmail"
              type="email"
              value={customerEmail}
              onChange={(event) => onCustomerEmailChange(event.target.value)}
              placeholder="amina@example.com"
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-slate-900" htmlFor="customerPhone">
            <span className="inline-flex items-center gap-2">
              <Phone aria-hidden="true" size={16} />
              Phone
            </span>
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-200"
              id="customerPhone"
              value={customerPhone}
              onChange={(event) => onCustomerPhoneChange(event.target.value)}
              placeholder="+254 700 000 000"
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-slate-900" htmlFor="deliveryAddress">
            <span className="inline-flex items-center gap-2">
              <MapPin aria-hidden="true" size={16} />
              Delivery address
            </span>
            <textarea
              className="min-h-24 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-200"
              id="deliveryAddress"
              value={deliveryAddress}
              onChange={(event) => onDeliveryAddressChange(event.target.value)}
              placeholder="Street, city, apartment"
            />
          </label>

          <button
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:bg-slate-200 disabled:text-slate-500"
            type="submit"
            disabled={isSubmitting || cart.length === 0}
          >
            <CreditCard aria-hidden="true" size={17} />
            {isSubmitting ? "Placing order..." : "Place order"}
          </button>
        </form>
      )}
    </aside>
  );
}
