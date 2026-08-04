"use client";

// ============================================================================
// Profile — minimal Phase A version. The full Profile suite (order history,
// saved addresses, recurring orders) is Phase B scope per the blueprint's
// file list (app/profile/orders, /addresses, /recurring). Phase A includes
// this single screen so the "return to profile after login" flow and the
// header/bottom-nav profile icon both resolve to something real and
// functional rather than a dead link — it shows the logged-in user's info,
// a live order history summary, and logout.
// ============================================================================

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/authStore";
import { useOrders } from "@/lib/orderStore";
import { maskPhone, formatCurrency } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const { state: authState, logout } = useAuth();
  const { orders } = useOrders();

  if (!authState.isLoggedIn || !authState.profile) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16 text-center flex flex-col items-center gap-4">
        <span className="text-4xl" aria-hidden>
          👤
        </span>
        <p className="font-display text-lg font-semibold text-ink-800">You&apos;re not logged in</p>
        <p className="text-sm text-ink-400">Log in to view your profile and order history.</p>
        <Link
          href="/login"
          className="mt-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-cream-100 hover:bg-brand-600"
        >
          Log In
        </Link>
      </div>
    );
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-400 text-ink-900 font-display text-2xl font-semibold">
          {authState.profile.name.charAt(0).toUpperCase()}
        </span>
        <div>
          <h1 className="font-display text-xl font-semibold text-ink-900">{authState.profile.name}</h1>
          <p className="text-sm text-ink-400">+977 {maskPhone(authState.profile.phone)}</p>
        </div>
      </div>

      <section>
        <h2 className="text-sm font-semibold text-ink-800 mb-3">Order History</h2>
        {orders.length === 0 ? (
          <div className="rounded-xl2 border border-ink-100 bg-cream-100 p-6 text-center">
            <p className="text-sm text-ink-400">No orders yet — your history will show up here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/order/${order.id}`}
                className="flex items-center justify-between rounded-xl2 border border-ink-100 bg-cream-100 px-4 py-3 hover:border-brand-300 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-ink-900">{order.id}</p>
                  <p className="text-xs text-ink-400">
                    {new Date(order.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })} ·{" "}
                    {order.lines.length} item{order.lines.length === 1 ? "" : "s"}
                  </p>
                </div>
                <span className="text-sm font-semibold text-ink-800">{formatCurrency(order.total)}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <button
        type="button"
        onClick={handleLogout}
        className="self-start text-sm font-semibold text-brand-500 hover:text-brand-600"
      >
        Log Out
      </button>
    </div>
  );
}
