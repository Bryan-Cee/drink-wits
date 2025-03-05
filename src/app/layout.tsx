import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import { AuthProvider } from '@/lib/auth/auth-context';
import { ThemeProvider } from '@/lib/theme/theme-context';
import Script from 'next/script';
import { Toaster } from 'react-hot-toast';
import ClientOfflineIndicator from '@/components/ui/ClientOfflineIndicator';
import ClientAgeVerification from '@/components/ui/ClientAgeVerification';

const inter = Inter({ subsets: ['latin'] });

// Define viewport separately as required by Next.js 14.2.0
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: 'Drink Wits - The Social Drinking Game',
  description: 'A drinking game with dares and questions to play with friends',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Drink Wits',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="Drink Wits" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Drink Wits" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1 pt-16 bg-gradient-to-b from-violet-100 to-indigo-200 dark:from-violet-500 dark:to-indigo-800 transition-colors duration-300">
                {children}
                <Toaster position="top-center" />
              </main>
              <Footer />
              <ClientOfflineIndicator />
            </div>
            {/* Age verification modal */}
            <ClientAgeVerification />
          </AuthProvider>
        </ThemeProvider>
        <Script src="/register-sw.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
