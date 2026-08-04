"use client";

// ============================================================================
// Checkout page — guest checkout allowed (no forced login), per blueprint
// §3.1 step 7. If logged in, fields pre-fill from profile. Payment method
// selection is mocked (COD/eSewa/Khalti visual only — Phase B adds the
// dedicated PaymentMethodSelect component with richer styling; Phase A
// includes a fully functional inline version so checkout works end-to-end).
// ============================================================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cartStore";
import { useAuth } from "@/lib/authStore";
import { useOrders } from "@/lib/orderStore";
import { formatCurrency, isValidNepaliPhone, simulateLatency } from "@/lib/utils";
import type { OrderType, PaymentMethod } from "@/types";

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; icon: string }[] = [
  { id: "cod", label: "Cash on Delivery", icon: "💵" },
  { id: "esewa", label: "eSewa", icon: "📱" },
  { id: "khalti", label: "Khalti", icon: "💳" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { state: cartState, subtotal, deliveryFee, total, clearCart } = useCart();
  const { state: authState, setReturnContext } = useAuth();
  const { createOrder } = useOrders();

  const [orderType, setOrderType] = useState<OrderType>("delivery");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [name, setName] = useState(authState.profile?.name ?? "");
  const [phone, setPhone] = useState(authState.profile?.phone ?? "");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [touched, setTouched] = useState(false);
  const [placing, setPlacing] = useState(false);

  const nameValid = name.trim().length > 1;
  const phoneValid = isValidNepaliPhone(phone);
  const addressValid = orderType === "pickup" || address.trim().length > 4;
  const formValid = nameValid && phoneValid && addressValid;

  async function handlePlaceOrder() {
    setTouched(true);
    if (!formValid || cartState.lines.length === 0) return;

    setPlacing(true);
    await simulateLatency(500, 1000);

    const order = createOrder({
      cartLines: cartState.lines,
      subtotal,
      deliveryFee,
      promoCode: cartState.promoCode,
      promoDiscount: cartState.promoDiscount,
      orderType,
      paymentMethod,
      details: {
        name: name.trim(),
        phone: phone.trim(),
        address: orderType === "pickup" ? "Pickup at Butwal branch" : address.trim(),
        landmark: landmark.trim() || undefined,
      },
    });

    clearCart();
    setPlacing(false);
    router.push(`/order/confirmation?orderId=${order.id}`);
  }

  function handleLoginClick() {
    setReturnContext({ type: "checkout" });
    router.push("/login");
  }

  if (cartState.lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center flex flex-col items-center gap-3">
        <span className="text-4xl" aria-hidden>
          🧾
        </span>
        <p className="font-display text-lg font-semibold text-ink-800">Your cart is empty</p>
        <p className="text-sm text-ink-400">Add something to your cart before checking out.</p>
        <Link
          href="/menu"
          className="mt-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-cream-100 hover:bg-brand-600"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 flex flex-col gap-6 pb-32">
      <h1 className="font-display text-2xl font-semibold text-ink-900">Checkout</h1>

      {!authState.isLoggedIn && (
        <button
          type="button"
          onClick={handleLoginClick}
          className="flex items-center justify-between rounded-xl2 border border-ink-100 bg-cream-100 px-4 py-3 text-left hover:border-brand-300 transition-colors"
        >
          <span className="text-sm text-ink-600">
            <span className="font-semibold text-ink-900">Have an account? </span>
            Log in for faster checkout.
          </span>
          <span className="text-brand-500 text-sm font-semibold shrink-0 ml-2">Log in →</span>
        </button>
      )}

      {/* Order type */}
      <section>
        <h2 className="text-sm font-semibold text-ink-800 mb-2">Order Type</h2>
        <div className="grid grid-cols-2 gap-2">
          {(["delivery", "pickup"] as OrderType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setOrderType(t)}
              className={`rounded-xl2 border px-4 py-3 text-sm font-semibold capitalize transition-colors ${
                orderType === t
                  ? "border-brand-500 bg-brand-50 text-brand-600"
                  : "border-ink-100 text-ink-600 hover:border-brand-200"
              }`}
            >
              {t === "delivery" ? "🛵 Delivery" : "🏪 Pickup"}
            </button>
          ))}
        </div>
      </section>

      {/* Details form */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-ink-800">Your Details</h2>

        <div>
          <label className="block text-xs font-medium text-ink-600 mb-1.5" htmlFor="ck-name">
            Full Name
          </label>
          <input
            id="ck-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={`w-full rounded-xl2 border bg-cream-100 px-4 py-3 outline-none transition-colors ${
              touched && !nameValid ? "border-brand-500" : "border-ink-100 focus:border-brand-400"
            }`}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-600 mb-1.5" htmlFor="ck-phone">
            Phone Number
          </label>
          <div
            className={`flex items-center rounded-xl2 border bg-cream-100 px-4 py-3 transition-colors ${
              touched && !phoneValid ? "border-brand-500" : "border-ink-100 focus-within:border-brand-400"
            }`}
          >
            <span className="text-ink-600 font-medium pr-3 border-r border-ink-100 mr-3">+977</span>
            <input
              id="ck-phone"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="98XXXXXXXX"
              className="flex-1 bg-transparent outline-none"
            />
          </div>
        </div>

        {orderType === "delivery" && (
          <>
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1.5" htmlFor="ck-address">
                Delivery Address
              </label>
              <textarea
                id="ck-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, ward, area"
                rows={2}
                className={`w-full rounded-xl2 border bg-cream-100 px-4 py-3 outline-none resize-none transition-colors ${
                  touched && !addressValid ? "border-brand-500" : "border-ink-100 focus:border-brand-400"
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1.5" htmlFor="ck-landmark">
                Landmark / Notes <span className="text-ink-400">(optional)</span>
              </label>
              <input
                id="ck-landmark"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. near City Chowk"
                className="w-full rounded-xl2 border border-ink-100 bg-cream-100 px-4 py-3 outline-none focus:border-brand-400"
              />
            </div>
          </>
        )}
      </section>

      {/* Payment method */}
      <section>
        <h2 className="text-sm font-semibold text-ink-800 mb-2">Payment Method</h2>
        <div className="flex flex-col gap-2">
          {PAYMENT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setPaymentMethod(opt.id)}
              className={`flex items-center gap-3 rounded-xl2 border px-4 py-3 text-left transition-colors ${
                paymentMethod === opt.id
                  ? "border-brand-500 bg-brand-50"
                  : "border-ink-100 hover:border-brand-200"
              }`}
            >
              <span className="text-xl" aria-hidden>
                {opt.icon}
              </span>
              <span className="text-sm font-medium text-ink-800 flex-1">{opt.label}</span>
              <span
                className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === opt.id ? "border-brand-500" : "border-ink-100"
                }`}
              >
                {paymentMethod === opt.id && <span className="h-2 w-2 rounded-full bg-brand-500" />}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Order review summary */}
      <section className="rounded-xl2 border border-ink-100 bg-cream-100 p-4 flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-ink-800 mb-1">Order Summary</h2>
        {cartState.lines.map((line) => (
          <div key={line.lineId} className="flex justify-between text-sm text-ink-600">
            <span className="truncate pr-2">
              {line.quantity}× {line.name} ({line.variantLabel})
            </span>
            <span className="shrink-0">{formatCurrency(line.unitPrice * line.quantity)}</span>
          </div>
        ))}
        <div className="border-t border-ink-100 pt-2 mt-1 flex flex-col gap-1">
          <div className="flex justify-between text-sm text-ink-600">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-ink-600">
            <span>Delivery Fee</span>
            <span>{orderType === "pickup" ? "—" : deliveryFee === 0 ? "Free" : formatCurrency(deliveryFee)}</span>
          </div>
          <div className="flex justify-between font-semibold text-ink-900 pt-1">
            <span>Total</span>
            <span>{formatCurrency(orderType === "pickup" ? total - deliveryFee : total)}</span>
          </div>
        </div>
      </section>

      {/* Fixed place order bar */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-30 bg-cream-100 border-t border-ink-100 p-4">
        <div className="mx-auto max-w-2xl">
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={placing}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-brand-500 px-5 py-3.5 font-semibold text-cream-100 hover:bg-brand-600 disabled:opacity-60 transition-colors"
          >
            {placing ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-cream-100 border-t-transparent animate-spin" />
                Placing your order…
              </>
            ) : (
              `Place Order · ${formatCurrency(orderType === "pickup" ? total - deliveryFee : total)}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
