import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Toast } from "../../components/shared/Toast";
import { useCartContext } from "../../context/CartContext";
import { getErrorMessage } from "../../lib/api/client";
import { getProduct } from "../../lib/api/products";

export function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCartContext();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ message: "", type: "info" });

  const loadProduct = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getProduct(id);
      setProduct(data);
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
    addToCart(product);
    setToast({ message: `${product.name} added to cart.`, type: "success" });
  }

  return (
    <main className="mx-auto grid max-w-4xl gap-5 px-4 py-6">
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
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
          <h1 className="text-xl font-bold text-slate-900">Product not found</h1>
        </section>
      )}

      {!isLoading && !error && product && (
        <article className="grid gap-6 rounded-2xl bg-white p-5 ring-1 ring-slate-200 md:grid-cols-2">
          <img
            className="aspect-[4/3] w-full rounded-2xl object-cover"
            src={product.image}
            alt={product.name}
          />
          <div className="grid content-start gap-4">
            <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
            <p className="text-sm leading-6 text-slate-600">{product.description}</p>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-slate-900">
                ${product.price.toFixed(2)}
              </span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                {product.stock} in stock
              </span>
            </div>
            <button
              className="inline-flex w-fit items-center justify-center gap-2 rounded-2xl bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-300 disabled:bg-slate-200 disabled:text-slate-500"
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart aria-hidden="true" size={17} />
              {product.stock === 0 ? "Out of stock" : "Add to cart"}
            </button>
          </div>
        </article>
      )}
    </main>
  );
}
