"use client";

// ============================================================================
// Profile hub — logged-in user info, and navigation into the full Profile
// suite: Order History, Saved Addresses, Recurring Orders, plus logout.
// ============================================================================

import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserRound, Receipt, MapPin, Repeat, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/authStore";
import { useOrders } from "@/lib/orderStore";
import { maskPhone } from "@/lib/utils";
import ContactLinks from "@/components/layout/ContactLinks";

const NAV_ITEMS = [
  { href: "/profile/orders", label: "Order History", description: "View past orders and reorder", Icon: Receipt },
  { href: "/profile/addresses", label: "Saved Addresses", description: "Manage your delivery addresses", Icon: MapPin },
  { href: "/profile/recurring", label: "Recurring Orders", description: "Manage your scheduled orders", Icon: Repeat },
] as const;

export default function ProfilePage() {
  const router = useRouter();
  const { state: authState, logout } = useAuth();
  const { orders } = useOrders();

  if (!authState.isLoggedIn || !authState.profile) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16 text-center flex flex-col items-center gap-4">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-ink-100 text-ink-400">
          <UserRound className="h-7 w-7" strokeWidth={1.75} aria-hidden />
        </span>
        <p className="font-display text-lg font-semibold text-ink-800">You&apos;re not logged in</p>
        <p className="text-sm text-ink-400">Log in to view your profile and order history.</p>
        <Link
          href="/login"
          className="mt-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-cream-100 hover:bg-brand-600"
        >
          Log In
        </Link>
        <div className="mt-6">
          <ContactLinks />
        </div>
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

      <section className="flex flex-col gap-2">
        {NAV_ITEMS.map(({ href, label, description, Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-xl2 border border-ink-100 bg-cream-100 px-4 py-3.5 hover:border-brand-300 transition-colors"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-500 shrink-0">
              <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-semibold text-ink-900">{label}</span>
              <span className="block text-xs text-ink-400">{description}</span>
            </span>
            {href === "/profile/orders" && orders.length > 0 && (
              <span className="text-xs font-medium text-ink-400 shrink-0">{orders.length}</span>
            )}
            <ChevronRight className="h-4 w-4 text-ink-300 shrink-0" strokeWidth={2} aria-hidden />
          </Link>
        ))}
      </section>

      <ContactLinks />

      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-2 self-start text-sm font-semibold text-brand-500 hover:text-brand-600"
      >
        <LogOut className="h-4 w-4" strokeWidth={2} aria-hidden />
        Log Out
      </button>
    </div>
  );
}
