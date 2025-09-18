import { createSupabaseServerClient } from '@/lib/server/supabase';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Supabase logout error:', error);
      // Continue with clearing cookies even if Supabase logout fails
    }

    // Create response and clear all authentication-related cookies
    const response = NextResponse.json({ 
      message: 'Logout successful' 
    });

    const cookiesToClear = [
      'auth-token',
      'user-session', 
      'temp-auth-session',
      'sb-access-token',
      'sb-refresh-token',
      // Clear any Supabase default cookies that might exist
      'sb-localhost-auth-token',
      'supabase-auth-token',
      'supabase.auth.token'
    ];

    cookiesToClear.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if there's an error, try to clear cookies
    const response = NextResponse.json(
      { error: 'Logout failed, but cookies cleared' }, 
      { status: 500 }
    );
    
    // Clear cookies anyway
    const cookiesToClear = [
      'auth-token',
      'user-session', 
      'temp-auth-session',
      'sb-access-token',
      'sb-refresh-token'
    ];

    cookiesToClear.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    });

    return response;
  }
}