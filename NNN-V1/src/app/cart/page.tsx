import CartDrawer from "@/modules/cart/components/CartDrawer";

// ============================================================================
// Full /cart page — uses the shared CartDrawer component for line items and
// summary. The blueprint also describes an inline slide-in drawer variant;
// in Phase A the cart icon in the header links straight here, which keeps
// the flow simple and fully functional without duplicating cart UI.
// ============================================================================

export default function CartPage() {
  return (
    <div className="mx-auto max-w-2xl px-0 sm:px-4 py-6">
      <h1 className="font-display text-2xl font-semibold text-ink-900 px-4 sm:px-0 mb-4">
        Your Cart
      </h1>
      <CartDrawer />
    </div>
  );
}
