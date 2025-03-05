'use client';

import { useState, useEffect } from 'react';

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState<boolean>(false);

  useEffect(() => {
    // Check if we're offline on mount
    if (typeof window !== 'undefined') {
      setIsOffline(!window.navigator.onLine);
    }

    // Update network status when it changes
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-red-600 text-white p-2 text-center z-50">
      You are currently offline. Some features may be unavailable.
    </div>
  );
} 