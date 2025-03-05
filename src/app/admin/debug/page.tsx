'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';

export default function DebugPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [debugData, setDebugData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDebugData() {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/debug/supabase');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch debug data');
        }
        
        setDebugData(data);
      } catch (err) {
        console.error('Error fetching debug data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchDebugData();
  }, []);

  if (!user) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-6">Admin Debug Page</h1>
        <p className="mb-4">You must be logged in to access this page.</p>
        <Link 
          href="/auth/login?returnUrl=/admin/debug"
          className="inline-block bg-indigo-600 text-white py-2 px-4 rounded-md"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Database Connection Debug</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <FaSpinner className="animate-spin text-indigo-600 text-3xl mr-3" />
          <span>Loading debug information...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
            <div className="flex items-center mb-2">
              <StatusIcon success={debugData.results.connection.success} />
              <span className="ml-2">Database Connection</span>
            </div>
            {debugData.results.connection.error && (
              <div className="mt-2 text-red-600 text-sm">
                Error: {debugData.results.connection.error}
              </div>
            )}
            {debugData.results.connection.version && (
              <div className="mt-2 text-sm text-gray-600">
                Version: {debugData.results.connection.version}
              </div>
            )}
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Authentication</h2>
            <div className="flex items-center mb-2">
              <StatusIcon success={debugData.results.auth.success} />
              <span className="ml-2">Auth Configuration</span>
            </div>
            <div className="flex items-center mb-2">
              <StatusIcon success={debugData.results.auth.hasSession} />
              <span className="ml-2">Has Active Session</span>
            </div>
            {debugData.results.auth.error && (
              <div className="mt-2 text-red-600 text-sm">
                Error: {debugData.results.auth.error}
              </div>
            )}
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center">
                <StatusIcon success={debugData.results.environment.supabaseUrl} />
                <span className="ml-2">Supabase URL</span>
              </div>
              <div className="flex items-center">
                <StatusIcon success={debugData.results.environment.supabaseAnonKey} />
                <span className="ml-2">Supabase Anon Key</span>
              </div>
              <div className="flex items-center">
                <StatusIcon success={debugData.results.environment.googleClientId} />
                <span className="ml-2">Google Client ID</span>
              </div>
              <div className="flex items-center">
                <StatusIcon success={debugData.results.environment.googleClientSecret} />
                <span className="ml-2">Google Client Secret</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Database Tables</h2>
            
            {debugData.results.tables.error ? (
              <div className="text-red-600 mb-4">
                Error checking tables: {debugData.results.tables.error}
              </div>
            ) : (
              <>
                <div className="flex items-center mb-4">
                  <StatusIcon success={debugData.results.requiredTables.success} />
                  <span className="ml-2">Required Tables</span>
                </div>
                
                {debugData.results.requiredTables.missing.length > 0 && (
                  <div className="mb-4">
                    <p className="text-amber-600 font-semibold mb-2">Missing Tables:</p>
                    <ul className="list-disc pl-5">
                      {debugData.results.requiredTables.missing.map((table: string) => (
                        <li key={table}>{table}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="mt-4">
                  <p className="font-semibold mb-2">Available Tables:</p>
                  {(debugData.results.tables.tablesList || []).length === 0 ? (
                    <p className="text-amber-600">No tables found in the database.</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {(debugData.results.tables.tablesList || []).map((table: string) => (
                        <div key={table} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                          {table}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
            
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold mb-2">Setup Instructions</h3>
              <p className="text-sm mb-2">To set up the required tables:</p>
              <ol className="list-decimal pl-5 text-sm">
                <li>Go to your Supabase dashboard</li>
                <li>Navigate to the SQL Editor</li>
                <li>Create a new query</li>
                <li>Copy and paste the SQL from <code>src/lib/supabase/setup-all-tables.sql</code></li>
                <li>Run the query to create all required tables</li>
              </ol>
            </div>
          </div>
          
          <div className="mt-4 text-right text-sm text-gray-500">
            Last updated: {new Date(debugData.time).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusIcon({ success }: { success: boolean }) {
  if (success) {
    return <FaCheckCircle className="text-green-500" />;
  }
  return <FaExclamationTriangle className="text-amber-500" />;
} 