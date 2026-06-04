import { Boxes, PackageCheck, ShoppingBag, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const highlights = [
  { icon: Zap, title: "Fast checkout", copy: "Place demo orders in seconds." },
  { icon: Boxes, title: "Live stock", copy: "Real-time availability on every product." },
  { icon: PackageCheck, title: "Order tracking", copy: "Follow your orders from your account." }
];

export function AuthLayout({ children }) {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-slate-900 p-10 text-white lg:flex">
        <Link className="inline-flex w-fit items-center gap-2 text-xl font-bold" to="/">
          <ShoppingBag aria-hidden="true" size={24} />
          CloudCart
        </Link>

        <div className="grid gap-6">
          <div>
            <span className="inline-block rounded-full bg-amber-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-900">
              New season essentials
            </span>
            <h2 className="mt-4 text-4xl font-bold leading-tight">
              Shop practical gear for work, travel, and everyday checkout demos.
            </h2>
          </div>

          <ul className="grid gap-4">
            {highlights.map(({ icon: Icon, title, copy }) => (
              <li className="flex items-start gap-3" key={title}>
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                  <Icon aria-hidden="true" size={18} className="text-amber-400" />
                </span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-slate-300">{copy}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-slate-400">A MERN e-commerce checkout demo.</p>
      </aside>

      <div className="flex flex-col px-4 py-8">
        <Link
          className="mb-8 inline-flex w-fit items-center gap-2 text-lg font-bold text-slate-900 lg:hidden"
          to="/"
        >
          <ShoppingBag aria-hidden="true" size={20} />
          CloudCart
        </Link>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </main>
  );
}
