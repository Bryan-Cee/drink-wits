import { createServerSupabaseClient } from '@/lib/supabase/server';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  // Get the redirectTo parameter for post-auth redirection
  const redirectTo = requestUrl.searchParams.get('redirectTo');

  if (code) {
    const supabase = await createServerSupabaseClient();

    // Exchange the auth code for a session
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL to redirect to after sign in
  const finalRedirectUrl = redirectTo || '/';
  return NextResponse.redirect(new URL(finalRedirectUrl, request.url));
}
