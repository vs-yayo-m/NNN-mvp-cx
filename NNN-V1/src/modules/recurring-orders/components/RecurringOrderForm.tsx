"use client";

// ============================================================================
// RecurringOrderForm — config sheet (frequency, time of day, start date)
// used from Order Detail or Cart to make an order recurring, per blueprint
// §3.4. Simple config UI only — no real scheduler.
// ============================================================================

import { useState } from "react";
import { X, Repeat } from "lucide-react";
import type { RecurringFrequency, OrderLine } from "@/types";
import { useRecurringOrders } from "@/lib/recurringOrderStore";

interface RecurringOrderFormProps {
  orderId: string;
  lines: OrderLine[];
  onClose: () => void;
  onSaved?: () => void;
}

const FREQUENCY_OPTIONS: { id: RecurringFrequency; label: string }[] = [
  { id: "daily", label: "Daily" },
  { id: "weekdays", label: "Weekdays" },
  { id: "weekly", label: "Weekly" },
];

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function RecurringOrderForm({ orderId, lines, onClose, onSaved }: RecurringOrderFormProps) {
  const { createRecurringOrder } = useRecurringOrders();
  const [frequency, setFrequency] = useState<RecurringFrequency>("weekdays");
  const [timeOfDay, setTimeOfDay] = useState("13:00");
  const [startDate, setStartDate] = useState(todayISODate());

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createRecurringOrder({
      createdFromOrderId: orderId,
      lines,
      frequency,
      timeOfDay,
      startDate,
    });
    onSaved?.();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-ink-900/50 animate-fade-in" onClick={onClose} aria-hidden />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl bg-cream-100 p-5 flex flex-col gap-4 animate-slide-in-right sm:animate-fade-in"
      >
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
            <Repeat className="h-5 w-5 text-brand-500" strokeWidth={2} aria-hidden />
            Make it Recurring
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-500 hover:bg-cream-200"
            aria-label="Close"
          >
            <X className="h-4 w-4" strokeWidth={2} aria-hidden />
          </button>
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-600 mb-1.5">Frequency</label>
          <div className="grid grid-cols-3 gap-2">
            {FREQUENCY_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFrequency(opt.id)}
                className={`rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
                  frequency === opt.id
                    ? "border-brand-500 bg-brand-50 text-brand-600"
                    : "border-ink-100 text-ink-600 hover:border-brand-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-600 mb-1.5" htmlFor="rec-time">
            Time of Day
          </label>
          <input
            id="rec-time"
            type="time"
            value={timeOfDay}
            onChange={(e) => setTimeOfDay(e.target.value)}
            className="w-full rounded-xl2 border border-ink-100 bg-cream-100 px-4 py-2.5 text-sm outline-none focus:border-brand-400"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-600 mb-1.5" htmlFor="rec-start">
            Start Date
          </label>
          <input
            id="rec-start"
            type="date"
            value={startDate}
            min={todayISODate()}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-xl2 border border-ink-100 bg-cream-100 px-4 py-2.5 text-sm outline-none focus:border-brand-400"
          />
        </div>

        <button
          type="submit"
          className="rounded-full bg-brand-500 px-5 py-3 font-semibold text-cream-100 hover:bg-brand-600 transition-colors"
        >
          Save Recurring Order
        </button>
      </form>
    </div>
  );
}
