"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { formatPrice } from "@/lib/utils";
import { SITE } from "@/data/site-config";
import { OrderType } from "@/lib/types";
import EmptyState from "@/components/EmptyState";

export default function CheckoutPage() {
  const { cart, cartSubtotal, guest, setGuest, placeOrder, hydrated } = useApp();
  const router = useRouter();

  const [orderType, setOrderType] = useState<OrderType>("delivery");
  const [name, setName] = useState(guest.name);
  const [phone, setPhone] = useState(guest.phone);
  const [address, setAddress] = useState(guest.address ?? "");
  const [landmark, setLandmark] = useState(guest.landmark ?? "");
  const [notes, setNotes] = useState(guest.notes ?? "");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringTime, setRecurringTime] = useState("13:00");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (hydrated && cart.length === 0) {
    return (
      <EmptyState
        title="Nothing to check out"
        message="Your cart is empty right now."
        ctaLabel="Browse the menu"
        ctaHref="/menu"
      />
    );
  }

  const deliveryFee = orderType === "pickup" || cartSubtotal >= SITE.freeDeliveryThreshold ? 0 : SITE.deliveryFee;
  const total = cartSubtotal + deliveryFee;

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Enter your name";
    if (!/^\d{7,10}$/.test(phone.replace(/\D/g, ""))) next.phone = "Enter a valid phone number";
    if (orderType === "delivery" && !address.trim()) next.address = "Enter a delivery address";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validate()) return;
    setGuest({ name, phone, address, landmark, notes });
    const order = placeOrder({
      orderType,
      isRecurring,
      recurringTime: isRecurring ? recurringTime : undefined,
    });
    router.push(`/order-confirmation/${order.id}`);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-4 pb-40">
      <h1 className="mb-4 font-display text-2xl font-bold text-cream">Checkout</h1>

      {/* Order type */}
      <section className="mb-5">
        <h2 className="mb-2 text-sm font-semibold text-cream">How should we get it to you?</h2>
        <div className="flex gap-2">
          {(["delivery", "pickup"] as OrderType[]).map((t) => (
            <button
              key={t}
              onClick={() => setOrderType(t)}
              className={`tap-scale focus-ring flex-1 rounded-xl2 border px-4 py-3 text-sm font-semibold capitalize ${
                orderType === t ? "border-chili bg-chili/10 text-cream" : "border-line text-muted"
              }`}
            >
              {t === "delivery" ? "\u{1F6F5} Delivery" : "\u{1F3EA} Pickup \u2014 " + SITE.branch}
            </button>
          ))}
        </div>
      </section>

      {/* Guest details */}
      <section className="mb-5 space-y-3">
        <h2 className="text-sm font-semibold text-cream">Your details</h2>
        <div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="focus-ring w-full rounded-xl border border-line bg-surface p-3 text-sm text-cream placeholder:text-muted"
          />
          {errors.name && <p className="mt-1 text-xs text-chili">{errors.name}</p>}
        </div>
        <div>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
            inputMode="tel"
            className="focus-ring w-full rounded-xl border border-line bg-surface p-3 text-sm text-cream placeholder:text-muted"
          />
          {errors.phone && <p className="mt-1 text-xs text-chili">{errors.phone}</p>}
        </div>
        {orderType === "delivery" && (
          <>
            <div>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Delivery address"
                className="focus-ring w-full rounded-xl border border-line bg-surface p-3 text-sm text-cream placeholder:text-muted"
              />
              {errors.address && <p className="mt-1 text-xs text-chili">{errors.address}</p>}
            </div>
            <input
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="Landmark (optional)"
              className="focus-ring w-full rounded-xl border border-line bg-surface p-3 text-sm text-cream placeholder:text-muted"
            />
          </>
        )}
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes for the rider or kitchen (optional)"
          rows={2}
          className="focus-ring w-full resize-none rounded-xl border border-line bg-surface p-3 text-sm text-cream placeholder:text-muted"
        />
      </section>

      {/* Recurring order */}
      <section className="mb-5 rounded-xl2 border border-line bg-surface p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-chili"
          />
          <span className="flex-1">
            <span className="block text-sm font-semibold text-cream">Make this a recurring order</span>
            <span className="block text-xs text-muted">We&apos;ll place this same order automatically every day \u2014 you can cancel anytime from Orders.</span>
          </span>
        </label>
        {isRecurring && (
          <div className="mt-3 flex items-center gap-3">
            <span className="text-xs text-muted">Every day at</span>
            <input
              type="time"
              value={recurringTime}
              onChange={(e) => setRecurringTime(e.target.value)}
              className="focus-ring rounded-lg border border-line bg-surface2 px-3 py-1.5 font-mono text-sm text-cream"
            />
          </div>
        )}
      </section>

      {/* Summary */}
      <section className="ticket-edge rounded-xl2 border border-line bg-surface p-4">
        <h2 className="mb-3 text-sm font-semibold text-cream">Order summary</h2>
        <div className="space-y-1.5 font-mono text-sm">
          {cart.map((l) => (
            <div key={l.lineId} className="flex justify-between text-muted">
              <span>
                {l.quantity} \u00d7 {l.name}
                {l.variantLabel ? ` (${l.variantLabel})` : ""}
              </span>
              <span className="text-cream">{formatPrice(l.unitPrice * l.quantity)}</span>
            </div>
          ))}
          <div className="my-2 border-t border-dashed border-line" />
          <div className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span className="text-cream">{formatPrice(cartSubtotal)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>{orderType === "pickup" ? "Pickup fee" : "Delivery fee"}</span>
            <span className="text-cream">{deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}</span>
          </div>
          <div className="my-2 border-t border-dashed border-line" />
          <div className="flex justify-between text-base font-semibold">
            <span className="text-cream">Total</span>
            <span className="text-turmeric">{formatPrice(total)}</span>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-16 z-30 mx-auto max-w-2xl border-t border-line bg-base/95 px-4 py-3 backdrop-blur">
        <button
          onClick={handlePlaceOrder}
          className="tap-scale focus-ring flex w-full items-center justify-between rounded-full bg-chili px-5 py-3.5 text-sm font-semibold text-cream"
        >
          <span>Place order</span>
          <span className="font-mono">{formatPrice(total)}</span>
        </button>
      </div>
    </div>
  );
}
