// ============================================================================
// GuestDetailsForm — name, phone, delivery address (+ optional landmark)
// for checkout. Guest checkout is always allowed per blueprint §3.1 step 7;
// when logged in, the parent page pre-fills these from the user's profile.
// ============================================================================

import type { OrderType } from "@/types";

interface GuestDetailsFormProps {
  orderType: OrderType;
  name: string;
  onNameChange: (v: string) => void;
  phone: string;
  onPhoneChange: (v: string) => void;
  address: string;
  onAddressChange: (v: string) => void;
  landmark: string;
  onLandmarkChange: (v: string) => void;
  touched: boolean;
  nameValid: boolean;
  phoneValid: boolean;
  addressValid: boolean;
}

export default function GuestDetailsForm({
  orderType,
  name,
  onNameChange,
  phone,
  onPhoneChange,
  address,
  onAddressChange,
  landmark,
  onLandmarkChange,
  touched,
  nameValid,
  phoneValid,
  addressValid,
}: GuestDetailsFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-medium text-ink-600 mb-1.5" htmlFor="ck-name">
          Full Name
        </label>
        <input
          id="ck-name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
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
            onChange={(e) => onPhoneChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
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
              onChange={(e) => onAddressChange(e.target.value)}
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
              onChange={(e) => onLandmarkChange(e.target.value)}
              placeholder="e.g. near City Chowk"
              className="w-full rounded-xl2 border border-ink-100 bg-cream-100 px-4 py-3 outline-none focus:border-brand-400"
            />
          </div>
        </>
      )}
    </div>
  );
}
