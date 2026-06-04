import { LogOut, Mail, Package, ShieldCheck, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toast } from "../../components/shared/Toast";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../lib/api/client";
import { changePassword, updateProfile } from "../../lib/api/auth";

const inputClass =
  "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-200";

const primaryButton =
  "rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:bg-slate-200 disabled:text-slate-500";

export function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [toast, setToast] = useState({ message: "", type: "info" });

  async function handleProfileSubmit(event) {
    event.preventDefault();
    if (!name.trim() || !email.trim()) {
      setToast({ message: "Name and email are required.", type: "error" });
      return;
    }

    setIsSavingProfile(true);
    setToast({ message: "Saving...", type: "info" });
    try {
      const { user: nextUser } = await updateProfile({ name: name.trim(), email: email.trim() });
      updateUser(nextUser);
      setName(nextUser.name);
      setEmail(nextUser.email);
      setToast({ message: "Profile updated.", type: "success" });
    } catch (error) {
      setToast({ message: getErrorMessage(error, "Could not update profile."), type: "error" });
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    if (newPassword.length < 6) {
      setToast({ message: "New password must be at least 6 characters.", type: "error" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setToast({ message: "New passwords do not match.", type: "error" });
      return;
    }

    setIsSavingPassword(true);
    setToast({ message: "Updating password...", type: "info" });
    try {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setToast({ message: "Password updated.", type: "success" });
    } catch (error) {
      setToast({ message: getErrorMessage(error, "Could not update password."), type: "error" });
    } finally {
      setIsSavingPassword(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <main className="mx-auto grid max-w-2xl content-start gap-5 px-4 py-6">
      <Toast message={toast.message} type={toast.type} />

      <header className="grid gap-1">
        <h1 className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
          <User aria-hidden="true" size={22} />
          My account
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Manage your CloudCart details and password.
        </p>
      </header>

      <section className="grid gap-3 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white">
            {(user?.name || "?").charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-slate-900">{user?.name}</p>
            <p className="inline-flex items-center gap-1 text-sm text-slate-500">
              <Mail aria-hidden="true" size={14} />
              <span className="truncate">{user?.email}</span>
            </p>
          </div>
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            <ShieldCheck aria-hidden="true" size={14} />
            {user?.isAdmin ? "Admin" : "Customer"}
          </span>
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
        <h2 className="text-lg font-bold text-slate-900">Profile details</h2>
        <form className="grid gap-4" onSubmit={handleProfileSubmit}>
          <label className="grid gap-2 text-sm font-bold text-slate-900" htmlFor="name">
            Name
            <input
              className={inputClass}
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-900" htmlFor="email">
            Email
            <input
              className={inputClass}
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <button className={`${primaryButton} justify-self-start`} type="submit" disabled={isSavingProfile}>
            {isSavingProfile ? "Saving..." : "Save changes"}
          </button>
        </form>
      </section>

      <section className="grid gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
        <h2 className="text-lg font-bold text-slate-900">Change password</h2>
        <form className="grid gap-4" onSubmit={handlePasswordSubmit}>
          <label className="grid gap-2 text-sm font-bold text-slate-900" htmlFor="currentPassword">
            Current password
            <input
              className={inputClass}
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              placeholder="••••••••"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-900" htmlFor="newPassword">
            New password
            <input
              className={inputClass}
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="At least 6 characters"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-900" htmlFor="confirmPassword">
            Confirm new password
            <input
              className={inputClass}
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="••••••••"
            />
          </label>
          <button className={`${primaryButton} justify-self-start`} type="submit" disabled={isSavingPassword}>
            {isSavingPassword ? "Updating..." : "Update password"}
          </button>
        </form>
      </section>

      <section className="flex flex-wrap items-center gap-3">
        <Link
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
          to="/account/orders"
        >
          <Package aria-hidden="true" size={16} />
          View my orders
        </Link>
        <Link
          className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
          to="/"
        >
          Continue shopping
        </Link>
        <button
          className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50"
          type="button"
          onClick={handleLogout}
        >
          <LogOut aria-hidden="true" size={16} />
          Log out
        </button>
      </section>
    </main>
  );
}
