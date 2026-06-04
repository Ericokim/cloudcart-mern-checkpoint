import { ShoppingCart } from "lucide-react";

export function ProductCard({ onAddToCart, product }) {
  return (
    <article className="grid gap-4 overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-slate-200 transition hover:-translate-y-0.5">
      <img
        className="aspect-[4/3] w-full rounded-2xl object-cover"
        src={product.image}
        alt={product.name}
      />

      <div>
        <h3 className="text-xl font-bold text-slate-900">{product.name}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{product.description}</p>
      </div>

      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-lg font-bold text-slate-900">${product.price.toFixed(2)}</span>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
          {product.stock} in stock
        </span>
      </div>

      <button
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:bg-slate-200 disabled:text-slate-500"
        type="button"
        onClick={() => onAddToCart(product)}
        disabled={product.stock === 0}
      >
        <ShoppingCart aria-hidden="true" size={17} />
        Add to cart
      </button>
    </article>
  );
}
