// ============================================================================
// Promo codes — minimal Phase A stub so the cart's promo logic has something
// real to validate against. The blueprint's full promo UI (PromoCodeInput
// component, checkout integration) is built in Phase B; this data file is
// infrastructure and lives here now so cartStore.ts compiles end-to-end.
// ============================================================================

interface PromoCode {
  code: string;
  description: string;
  type: "percent" | "flat";
  value: number; // percent (0-100) or flat NPR amount
  minSubtotal?: number;
}

const PROMO_CODES: PromoCode[] = [
  { code: "WELCOME10", description: "10% off your order", type: "percent", value: 10 },
  { code: "NOMNOM50", description: "Rs. 50 off", type: "flat", value: 50, minSubtotal: 300 },
];

export function validatePromoCode(
  rawCode: string,
  subtotal: number
): { valid: boolean; discount: number; message: string } {
  const code = rawCode.trim().toUpperCase();
  if (!code) {
    return { valid: false, discount: 0, message: "Enter a promo code." };
  }
  const promo = PROMO_CODES.find((p) => p.code === code);
  if (!promo) {
    return { valid: false, discount: 0, message: "That code isn't valid." };
  }
  if (promo.minSubtotal && subtotal < promo.minSubtotal) {
    return {
      valid: false,
      discount: 0,
      message: `Add ${promo.minSubtotal - subtotal > 0 ? "more to your cart" : ""} — minimum order Rs. ${promo.minSubtotal} for this code.`,
    };
  }
  const discount = promo.type === "percent" ? Math.round((subtotal * promo.value) / 100) : promo.value;
  return { valid: true, discount, message: `${promo.description} applied.` };
}
