"use client";

// ============================================================================
// Checkout page — guest checkout allowed (no forced login), per blueprint
// §3.1 step 7. If logged in, fields pre-fill from profile. Composes the
// Phase B checkout module components: OrderTypeToggle, GuestDetailsForm,
// PaymentMethodSelect, OrderReviewSummary.
// ============================================================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ReceiptText, Loader2, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cartStore";
import { useAuth } from "@/lib/authStore";
import { useOrders } from "@/lib/orderStore";
import { formatCurrency, isValidNepaliPhone, simulateLatency } from "@/lib/utils";
import type { OrderType, PaymentMethod } from "@/types";
import OrderTypeToggle from "@/modules/checkout/components/OrderTypeToggle";
import GuestDetailsForm from "@/modules/checkout/components/GuestDetailsForm";
import PaymentMethodSelect from "@/modules/checkout/components/PaymentMethodSelect";
import OrderReviewSummary from "@/modules/checkout/components/OrderReviewSummary";

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
        <ReceiptText className="h-10 w-10 text-ink-300" strokeWidth={1.5} aria-hidden />
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

  const displayTotal = orderType === "pickup" ? total - deliveryFee : total;

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
          <span className="flex items-center gap-1 text-brand-500 text-sm font-semibold shrink-0 ml-2">
            Log in
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden />
          </span>
        </button>
      )}

      <section>
        <h2 className="text-sm font-semibold text-ink-800 mb-2">Order Type</h2>
        <OrderTypeToggle value={orderType} onChange={setOrderType} />
      </section>

      <section>
        <h2 className="text-sm font-semibold text-ink-800 mb-3">Your Details</h2>
        <GuestDetailsForm
          orderType={orderType}
          name={name}
          onNameChange={setName}
          phone={phone}
          onPhoneChange={setPhone}
          address={address}
          onAddressChange={setAddress}
          landmark={landmark}
          onLandmarkChange={setLandmark}
          touched={touched}
          nameValid={nameValid}
          phoneValid={phoneValid}
          addressValid={addressValid}
        />
      </section>

      <section>
        <h2 className="text-sm font-semibold text-ink-800 mb-2">Payment Method</h2>
        <PaymentMethodSelect value={paymentMethod} onChange={setPaymentMethod} />
      </section>

      <OrderReviewSummary
        lines={cartState.lines}
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        total={total}
        orderType={orderType}
        promoCode={cartState.promoCode}
        promoDiscount={cartState.promoDiscount}
      />

      {/* Fixed place order bar */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-30 bg-cream-100 border-t border-ink-100 p-4 md:pb-safe">
        <div className="mx-auto max-w-2xl">
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={placing}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-brand-500 px-5 py-3.5 font-semibold text-cream-100 hover:bg-brand-600 disabled:opacity-60 transition-colors"
          >
            {placing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} aria-hidden />
                Placing your order…
              </>
            ) : (
              `Place Order · ${formatCurrency(displayTotal)}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
