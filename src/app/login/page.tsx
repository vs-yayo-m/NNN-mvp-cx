'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/authStore';
import PhoneInputForm from '@/modules/auth/components/PhoneInputForm';
import { writeStore } from '@/lib/storage';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();

  return (
    <PhoneInputForm
      onSubmit={(phone) => {
        auth.startLogin(phone);
        writeStore('nnn-return', searchParams.get('return') || '/profile');
        router.push('/login/otp');
      }}
    />
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="panel mx-auto max-w-md p-6">Loading login…</div>}>
      <LoginContent />
    </Suspense>
  );
}
