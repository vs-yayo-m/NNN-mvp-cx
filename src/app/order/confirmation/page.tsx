'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ConfirmationContent() {
  const id = useSearchParams().get('id') || '';

  return (
    <div className="panel mx-auto max-w-xl p-8 text-center">
      <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-green-100 text-4xl">✓</div>
      <h1 className="font-display text-4xl font-black">Order confirmed</h1>
      <p>
        Your order number is <b>{id || 'pending'}</b>. ETA 30–40 minutes.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link className="btn" href={`/order/${id}`}>
          Track Order
        </Link>
        <Link className="rounded-full bg-white px-5 py-3 font-bold" href="/login?return=/profile">
          Save info for next time
        </Link>
      </div>
    </div>
  );
}

export default function Confirmation() {
  return (
    <Suspense fallback={<div className="panel mx-auto max-w-xl p-8 text-center">Loading confirmation…</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
