import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from '@/lib/auth/auth-context';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Drink Wits - The Social Drinking Game",
  description: "A drinking game with dares and questions to play with friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <main className="min-h-screen bg-gradient-to-b from-violet-500 to-indigo-800">
            {children}
            <Toaster position="top-center" />
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
