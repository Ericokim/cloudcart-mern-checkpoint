export function Hero() {
  return (
    <section className="grid overflow-hidden rounded-2xl bg-slate-900 text-white md:h-64 md:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex h-full flex-col justify-center px-5 py-5 sm:px-6">
        <p className="mb-2 inline-flex w-fit rounded-full bg-amber-300 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-900">
          New season essentials
        </p>
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">CloudCart</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200">
          Shop practical gear for work, travel, and everyday checkout demos.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-900">
          <span className="rounded-full bg-white px-3 py-2">Fast checkout</span>
          <span className="rounded-full bg-white px-3 py-2">Live stock</span>
          <span className="rounded-full bg-white px-3 py-2">MongoDB orders</span>
        </div>
      </div>

      <img
        className="hidden h-full w-full object-cover md:block"
        src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80"
        alt="Online shopping counter"
      />
    </section>
  );
}
