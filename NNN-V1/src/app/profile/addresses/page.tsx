"use client";

// ============================================================================
// Saved Addresses — add/edit/delete, localStorage-backed via addressStore,
// per blueprint §3.3.
// ============================================================================

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, MapPin, Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { useAddresses } from "@/lib/addressStore";
import type { SavedAddress } from "@/types";

interface AddressFormState {
  label: string;
  address: string;
  landmark: string;
  isDefault: boolean;
}

const EMPTY_FORM: AddressFormState = { label: "", address: "", landmark: "", isDefault: false };

export default function AddressesPage() {
  const { addresses, addAddress, updateAddress, deleteAddress } = useAddresses();
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressFormState>(EMPTY_FORM);

  function openAddForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormOpen(true);
  }

  function openEditForm(address: SavedAddress) {
    setForm({
      label: address.label,
      address: address.address,
      landmark: address.landmark ?? "",
      isDefault: address.isDefault,
    });
    setEditingId(address.id);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.label.trim() || !form.address.trim()) return;

    if (editingId) {
      updateAddress({
        id: editingId,
        label: form.label.trim(),
        address: form.address.trim(),
        landmark: form.landmark.trim() || undefined,
        isDefault: form.isDefault,
      });
    } else {
      addAddress({
        label: form.label.trim(),
        address: form.address.trim(),
        landmark: form.landmark.trim() || undefined,
        isDefault: form.isDefault,
      });
    }
    closeForm();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 flex flex-col gap-5">
      <Link href="/profile" className="flex items-center gap-1 text-sm text-ink-500 hover:text-ink-800 w-fit">
        <ChevronLeft className="h-4 w-4" strokeWidth={2} aria-hidden />
        Profile
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Saved Addresses</h1>
        {!formOpen && (
          <button
            type="button"
            onClick={openAddForm}
            className="flex items-center gap-1.5 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-cream-100 hover:bg-brand-600 transition-colors"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
            Add
          </button>
        )}
      </div>

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl2 border border-brand-200 bg-brand-50 p-4 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink-800">
              {editingId ? "Edit Address" : "New Address"}
            </h2>
            <button
              type="button"
              onClick={closeForm}
              className="flex h-6 w-6 items-center justify-center rounded-full text-ink-500 hover:bg-brand-100"
              aria-label="Cancel"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            </button>
          </div>

          <input
            value={form.label}
            onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
            placeholder="Label — e.g. Home, Work"
            className="rounded-xl2 border border-ink-100 bg-cream-100 px-4 py-2.5 text-sm outline-none focus:border-brand-400"
          />
          <textarea
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            placeholder="Full address"
            rows={2}
            className="rounded-xl2 border border-ink-100 bg-cream-100 px-4 py-2.5 text-sm outline-none resize-none focus:border-brand-400"
          />
          <input
            value={form.landmark}
            onChange={(e) => setForm((f) => ({ ...f, landmark: e.target.value }))}
            placeholder="Landmark (optional)"
            className="rounded-xl2 border border-ink-100 bg-cream-100 px-4 py-2.5 text-sm outline-none focus:border-brand-400"
          />
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
              className="h-4 w-4 rounded accent-brand-500"
            />
            Set as default address
          </label>

          <button
            type="submit"
            disabled={!form.label.trim() || !form.address.trim()}
            className="rounded-full bg-brand-500 px-4 py-2.5 text-sm font-semibold text-cream-100 hover:bg-brand-600 disabled:opacity-40 transition-colors"
          >
            {editingId ? "Save Changes" : "Add Address"}
          </button>
        </form>
      )}

      {addresses.length === 0 && !formOpen ? (
        <div className="rounded-xl2 border border-ink-100 bg-cream-100 p-8 text-center flex flex-col items-center gap-2">
          <MapPin className="h-9 w-9 text-ink-300" strokeWidth={1.5} aria-hidden />
          <p className="text-sm text-ink-400">No saved addresses yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="flex items-start gap-3 rounded-xl2 border border-ink-100 bg-cream-100 px-4 py-3.5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-500 shrink-0 mt-0.5">
                <MapPin className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-ink-900">{addr.label}</p>
                  {addr.isDefault && (
                    <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                      <Check className="h-2.5 w-2.5" strokeWidth={2.5} aria-hidden />
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-ink-600 mt-0.5">{addr.address}</p>
                {addr.landmark && <p className="text-xs text-ink-400">{addr.landmark}</p>}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => openEditForm(addr)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-ink-500 hover:bg-cream-200"
                  aria-label={`Edit ${addr.label}`}
                >
                  <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => deleteAddress(addr.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-ink-500 hover:bg-cream-200 hover:text-brand-500"
                  aria-label={`Delete ${addr.label}`}
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
