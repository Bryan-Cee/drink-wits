import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// This endpoint is for debugging purposes only
// It should be disabled in production
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Debug endpoints are disabled in production' },
      { status: 403 }
    );
  }

  try {
    const supabase = await createServerSupabaseClient();
    const results: Record<string, any> = {};

    // Check connection by testing a simple query
    try {
      const { data, error } = await supabase.rpc('version');
      results.connection = {
        success: !error,
        error: error ? error.message : null,
        version: data
      };
    } catch (e) {
      // Fallback to a simpler connection test if rpc version isn't available
      try {
        const { error } = await supabase.from('pg_catalog.pg_tables').select('schemaname').limit(1);
        results.connection = {
          success: !error,
          error: error ? error.message : null
        };
      } catch (e2) {
        results.connection = {
          success: false,
          error: e2 instanceof Error ? e2.message : 'Unknown error checking connection'
        };
      }
    }

    // Check auth configuration
    const { data: authConfig, error: authError } = await supabase.auth.getSession();

    results.auth = {
      success: !authError,
      error: authError ? authError.message : null,
      hasSession: !!authConfig.session
    };

    // List all tables
    const { data: tablesList, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    results.tables = {
      success: !tablesError,
      error: tablesError ? tablesError.message : null,
      tablesList: tablesList ? tablesList.map(t => t.table_name) : []
    };

    // Check if required tables exist
    const requiredTables = ['games', 'players', 'cards', 'favorites', 'game_cards', 'rounds'];
    const existingTables = results.tables.tablesList || [];

    results.requiredTables = {
      success: requiredTables.every(table => existingTables.includes(table)),
      missing: requiredTables.filter(table => !existingTables.includes(table))
    };

    // Check RLS policies
    try {
      const { data: policies, error: policiesError } = await supabase
        .from('pg_policies')
        .select('*');

      results.policies = {
        success: !policiesError,
        error: policiesError ? policiesError.message : null,
        policies: policies || []
      };
    } catch (e) {
      results.policies = {
        success: false,
        error: e instanceof Error ? e.message : 'Unable to check policies',
        policies: []
      };
    }

    // Check environment variables
    results.environment = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      googleClientId: !!process.env.GOOGLE_CLIENT_ID,
      googleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET
    };

    return NextResponse.json({
      success: true,
      time: new Date().toISOString(),
      results
    });

  } catch (error) {
    console.error('Debug endpoint error:', error);
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        time: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 