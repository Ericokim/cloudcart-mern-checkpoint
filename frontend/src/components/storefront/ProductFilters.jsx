import { RefreshCw, Search, SlidersHorizontal } from "lucide-react";

export function ProductFilters({ filters, isLoading, onChange, onRefresh, resultCount }) {
  return (
    <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Shop products</h2>
          <p className="mt-1 text-sm text-slate-600">
            {isLoading ? "Loading products..." : `${resultCount} item(s) found`}
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          type="button"
          onClick={() => onRefresh()}
        >
          <RefreshCw aria-hidden="true" size={16} />
          Refresh
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_160px_170px]">
        <label className="relative block">
          <span className="sr-only">Search products</span>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
            size={18}
          />
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-11 py-3 text-sm outline-none transition focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-200"
            name="search"
            value={filters.search}
            onChange={onChange}
            placeholder="Search products"
          />
        </label>

        <label className="relative block">
          <span className="sr-only">Filter by stock</span>
          <SlidersHorizontal
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
            size={18}
          />
          <select
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-200"
            name="stock"
            value={filters.stock}
            onChange={onChange}
          >
            <option value="all">All stock</option>
            <option value="available">Available</option>
            <option value="low">Low stock</option>
          </select>
        </label>

        <label className="block">
          <span className="sr-only">Sort products</span>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-200"
            name="sort"
            value={filters.sort}
            onChange={onChange}
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>
    </section>
  );
}
