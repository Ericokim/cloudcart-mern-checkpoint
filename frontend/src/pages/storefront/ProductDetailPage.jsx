import { ArrowLeft, Boxes, Minus, PackageCheck, Plus, ShoppingCart, Zap } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CartSummary } from "../../components/storefront/CartSummary";
import { Toast } from "../../components/shared/Toast";
import { useCartContext } from "../../context/CartContext";
import { getErrorMessage } from "../../lib/api/client";
import { getProduct } from "../../lib/api/products";

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%25' height='100%25' fill='%23e2e8f0'/><text x='50%25' y='50%25' fill='%2394a3b8' font-family='sans-serif' font-size='28' text-anchor='middle' dominant-baseline='middle'>No image</text></svg>";

const benefits = [
  { icon: Zap, label: "Fast checkout" },
  { icon: Boxes, label: "Live stock" },
  { icon: PackageCheck, label: "Demo order tracking" }
];

function stockStatus(stock) {
  if (stock === 0) {
    return { label: "Out of stock", cls: "bg-red-100 text-red-900" };
  }
  if (stock <= 5) {
    return { label: `Only ${stock} left`, cls: "bg-amber-100 text-amber-900" };
  }
  return { label: `${stock} in stock`, cls: "bg-emerald-100 text-emerald-900" };
}

export function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart, cart, updateQuantity } = useCartContext();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState({ message: "", type: "info" });

  const loadProduct = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getProduct(id);
      setProduct(data);
      setQuantity(1);
    } catch (loadError) {
      setError(getErrorMessage(loadError, "Could not load this product."));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  function handleAddToCart() {
    const existing = cart.find((item) => item.productId === product._id);
    if (existing) {
      updateQuantity(product._id, existing.quantity + quantity);
    } else {
      addToCart(product);
      if (quantity > 1) {
        updateQuantity(product._id, quantity);
      }
    }
    setToast({ message: `${quantity} × ${product.name} added to cart.`, type: "success" });
  }

  const status = product ? stockStatus(product.stock) : null;
  const outOfStock = product?.stock === 0;

  return (
    <main className="mx-auto grid max-w-6xl content-start gap-5 px-4 py-6">
      <Toast message={toast.message} type={toast.type} />

      <Link
        className="inline-flex w-fit items-center gap-1 rounded-xl px-2 py-1 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        to="/"
      >
        <ArrowLeft aria-hidden="true" size={16} />
        Back to catalog
      </Link>

      {isLoading && (
        <div className="grid gap-5 rounded-2xl bg-white p-5 ring-1 ring-slate-200 md:grid-cols-2">
          <div className="aspect-[4/3] rounded-2xl bg-slate-100" />
          <div className="grid content-start gap-3">
            <div className="h-7 w-2/3 rounded bg-slate-100" />
            <div className="h-4 w-full rounded bg-slate-100" />
            <div className="h-4 w-3/4 rounded bg-slate-100" />
            <div className="mt-3 h-11 w-40 rounded-2xl bg-slate-100" />
          </div>
        </div>
      )}

      {!isLoading && error && (
        <section className="rounded-2xl border border-dashed border-red-300 bg-white p-6 text-center">
          <h1 className="text-xl font-bold text-slate-900">{error}</h1>
          <button
            className="mt-4 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            type="button"
            onClick={loadProduct}
          >
            Try again
          </button>
        </section>
      )}

      {!isLoading && !error && !product && (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <h1 className="text-xl font-bold text-slate-900">Product not found</h1>
          <p className="mt-2 text-sm text-slate-600">
            This product may have been removed.
          </p>
          <Link
            className="mt-4 inline-block rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            to="/"
          >
            Back to catalog
          </Link>
        </section>
      )}

      {!isLoading && !error && product && (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="grid gap-6 rounded-2xl bg-white p-5 ring-1 ring-slate-200 md:grid-cols-2">
            <img
              className="aspect-[4/3] w-full rounded-2xl object-cover"
              src={product.image || FALLBACK_IMAGE}
              alt={product.name}
              onError={(event) => {
                event.currentTarget.src = FALLBACK_IMAGE;
              }}
            />
            <div className="grid content-start gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  SKU #{String(product._id).slice(-6).toUpperCase()}
                </p>
                <h1 className="mt-1 text-3xl font-bold text-slate-900">{product.name}</h1>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-2xl font-bold text-slate-900">
                  ${product.price.toFixed(2)}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.cls}`}>
                  {status.label}
                </span>
              </div>

              <p className="text-sm leading-6 text-slate-600">{product.description}</p>

              {!outOfStock && (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-900">Quantity</span>
                  <div className="inline-flex items-center gap-2">
                    <button
                      className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-900 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-50"
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus aria-hidden="true" size={16} />
                    </button>
                    <span className="min-w-8 text-center text-sm font-bold text-slate-900">
                      {quantity}
                    </span>
                    <button
                      className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-900 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-50"
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}
                      disabled={quantity >= product.stock}
                    >
                      <Plus aria-hidden="true" size={16} />
                    </button>
                  </div>
                </div>
              )}

              <button
                className="inline-flex w-fit items-center justify-center gap-2 rounded-2xl bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:bg-slate-200 disabled:text-slate-500"
                type="button"
                onClick={handleAddToCart}
                disabled={outOfStock}
              >
                <ShoppingCart aria-hidden="true" size={17} />
                {outOfStock ? "Out of stock" : "Add to cart"}
              </button>

              <ul className="mt-1 grid gap-2 border-t border-slate-100 pt-4 text-sm font-semibold text-slate-600">
                {benefits.map(({ icon: Icon, label }) => (
                  <li className="inline-flex items-center gap-2" key={label}>
                    <Icon aria-hidden="true" size={16} className="text-amber-500" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <CartSummary />
        </div>
      )}
    </main>
  );
}
