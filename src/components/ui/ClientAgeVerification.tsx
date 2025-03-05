'use client';

import dynamic from 'next/dynamic';

const AgeVerification = dynamic(() => import('./AgeVerification'), {
  ssr: false,
});

export default function ClientAgeVerification() {
  return <AgeVerification />;
} 