import { LogOut, Package, ShoppingBag, ShoppingCart, User } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCartContext } from "../../context/CartContext";

const linkBase =
  "rounded-xl px-3 py-2 text-sm font-semibold transition hover:bg-slate-100 hover:text-slate-900";

function navClass({ isActive }) {
  return `${linkBase} ${isActive ? "bg-slate-900 text-white hover:bg-slate-900 hover:text-white" : "text-slate-600"}`;
}

export function NavBar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { cart } = useCartContext();
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link className="inline-flex items-center gap-2 text-xl font-bold text-slate-900" to="/">
          <ShoppingBag aria-hidden="true" size={22} />
          CloudCart
        </Link>

        <div className="flex flex-wrap items-center gap-1">
          <NavLink className={navClass} to="/" end>
            Catalog
          </NavLink>

          <Link
            className={`relative inline-flex items-center gap-1 ${linkBase} text-slate-600`}
            to="/"
            aria-label={`Cart, ${cartCount} item(s)`}
          >
            <ShoppingCart aria-hidden="true" size={16} />
            Cart
            {cartCount > 0 && (
              <span className="ml-0.5 inline-flex min-w-5 items-center justify-center rounded-full bg-amber-400 px-1.5 text-xs font-bold text-slate-900">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated && (
            <NavLink className={navClass} to="/account/orders">
              <span className="inline-flex items-center gap-1">
                <Package aria-hidden="true" size={15} />
                My orders
              </span>
            </NavLink>
          )}

          {isAdmin && (
            <NavLink className={navClass} to="/admin/products">
              Admin
            </NavLink>
          )}

          {isAuthenticated ? (
            <>
              <NavLink className={navClass} to="/account/profile">
                <span className="inline-flex items-center gap-1">
                  <User aria-hidden="true" size={15} />
                  {user?.name}
                </span>
              </NavLink>
              <button
                className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                type="button"
                onClick={logout}
              >
                <LogOut aria-hidden="true" size={15} />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink className={navClass} to="/login">
                Login
              </NavLink>
              <NavLink
                className="rounded-xl bg-amber-400 px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
                to="/register"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
