import { PackageSearch } from "lucide-react";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ isLoading, onAddToCart, onRefresh, products }) {
  if (isLoading) {
    return (
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-label="Loading products">
        {[1, 2, 3].map((item) => (
          <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200" key={item}>
            <div className="aspect-[4/3] rounded-2xl bg-slate-100" />
            <div className="mt-4 h-5 w-2/3 rounded bg-slate-100" />
            <div className="mt-3 h-4 w-full rounded bg-slate-100" />
            <div className="mt-2 h-4 w-3/4 rounded bg-slate-100" />
            <div className="mt-5 h-11 rounded-2xl bg-slate-100" />
          </div>
        ))}
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-6 text-center">
        <PackageSearch className="mx-auto mb-2 text-slate-400" aria-hidden="true" size={32} />
        <h2 className="text-xl font-bold text-slate-900">No products found</h2>
        <p className="mt-2 text-sm text-slate-600">Try a different search or filter.</p>
        <button
          className="mt-4 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          type="button"
          onClick={() => onRefresh()}
        >
          Refresh
        </button>
      </section>
    );
  }

  return (
    <section>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>
    </section>
  );
}
