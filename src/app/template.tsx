'use client';

import PageTransition from '@/components/ui/PageTransition';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  return (
    <PageTransition key={pathname}>
      {children}
    </PageTransition>
  );
} 