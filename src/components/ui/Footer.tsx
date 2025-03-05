'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import the reset component to avoid hydration issues
const AgeVerificationReset = dynamic(() => import('./AgeVerificationReset'), {
  ssr: false,
});

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              © {currentYear} Drink Wits - Play Responsibly <AgeVerificationReset />
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
