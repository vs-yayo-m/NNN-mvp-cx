"use client";

// ============================================================================
// Recurring Orders management — list of active recurring orders with
// pause/resume/delete and a plain-language summary, per blueprint §3.4.
// ============================================================================

import Link from "next/link";
import { ChevronLeft, Repeat, Pause, Play, Trash2 } from "lucide-react";
import { useRecurringOrders, summarizeRecurringOrder } from "@/lib/recurringOrderStore";

export default function RecurringOrdersPage() {
  const { recurringOrders, togglePause, deleteRecurringOrder } = useRecurringOrders();

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 flex flex-col gap-5">
      <Link href="/profile" className="flex items-center gap-1 text-sm text-ink-500 hover:text-ink-800 w-fit">
        <ChevronLeft className="h-4 w-4" strokeWidth={2} aria-hidden />
        Profile
      </Link>

      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">Recurring Orders</h1>
        <p className="text-sm text-ink-400 mt-1">
          Set these up from any past order&apos;s detail page with &ldquo;Make this a recurring order.&rdquo;
        </p>
      </div>

      {recurringOrders.length === 0 ? (
        <div className="rounded-xl2 border border-ink-100 bg-cream-100 p-8 text-center flex flex-col items-center gap-2">
          <Repeat className="h-9 w-9 text-ink-300" strokeWidth={1.5} aria-hidden />
          <p className="text-sm text-ink-400">No recurring orders set up yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {recurringOrders.map((order) => (
            <div
              key={order.id}
              className={`flex items-start gap-3 rounded-xl2 border px-4 py-3.5 transition-colors ${
                order.isPaused ? "border-ink-100 bg-ink-50/50 opacity-70" : "border-ink-100 bg-cream-100"
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full shrink-0 mt-0.5 ${
                  order.isPaused ? "bg-ink-100 text-ink-400" : "bg-brand-50 text-brand-500"
                }`}
              >
                <Repeat className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink-900">
                  {summarizeRecurringOrder(order)}
                </p>
                <p className="text-xs text-ink-400 mt-0.5">
                  Starts {new Date(order.startDate).toLocaleDateString("en-US", { dateStyle: "medium" })}
                  {order.isPaused && " · Paused"}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => togglePause(order.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-ink-500 hover:bg-cream-200"
                  aria-label={order.isPaused ? "Resume" : "Pause"}
                >
                  {order.isPaused ? (
                    <Play className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                  ) : (
                    <Pause className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => deleteRecurringOrder(order.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-ink-500 hover:bg-cream-200 hover:text-brand-500"
                  aria-label="Delete"
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
