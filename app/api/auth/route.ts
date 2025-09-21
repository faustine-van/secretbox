import { createSupabaseServerClient } from '@/lib/server/supabase';
import { LoginSchema } from '@/lib/validations';
import { auditLog } from '@/lib/server/audit';
import { NextResponse } from 'next/server';
import * as bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const body = await request.json();
    const { email, password, masterPassword } = body;

    // Validate input
    const validation = LoginSchema.safeParse({ email, password });
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }

    // Authenticate with Supabase
    const { data: { user, session }, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !user) {
      await auditLog(
        null,
        'login_failed',
        'user',
        null,
        request,
        { email, reason: 'invalid_credentials' }
      );
      
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // If no master password provided, return success (first step)
    if (!masterPassword) {
      // Create response with temporary auth cookie for the first step
      const response = NextResponse.json({
        message: 'Credentials verified',
        step: 'master-password-required'
      });

      response.cookies.set('temp-auth-session', JSON.stringify({
        userId: user.id,
        email: user.email,
        step: 'master-password-required'
      }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 300, // 5 minutes for temp session
        path: '/'
      });

      return response;
    }

    // Get user profile and verify master password
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('master_password_hash, full_name')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Verify master password
    const masterPasswordValid = await bcrypt.compare(
      masterPassword,
      profile.master_password_hash
    );

    if (!masterPasswordValid) {
      await auditLog(
        user.id,
        'master_password_failed',
        'user',
        user.id,
        request,
        { email }
      );

      return NextResponse.json(
        { error: 'Invalid master password' },
        { status: 401 }
      );
    }

    // Set proper session cookies after successful master password verification
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: profile.full_name
      }
    });
    
    // Clear temp session
    response.cookies.delete('temp-auth-session');
    
    // Set main auth session cookies
    if (session) {
      // Set Supabase session cookies
      response.cookies.set('sb-access-token', session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: session.expires_in,
        path: '/'
      });

      response.cookies.set('sb-refresh-token', session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      });
    }

    // Set custom user session cookie
    response.cookies.set('user-session', JSON.stringify({
      userId: user.id,
      email: user.email,
      name: profile.full_name,
      authenticated: true,
      masterPasswordVerified: true
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    // Set a simple auth flag cookie for middleware
    response.cookies.set('auth-token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    // Log successful login
    await auditLog(
      user.id,
      'user_login_success',
      'user',
      user.id,
      request,
      { email, full_name: profile.full_name }
    );

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error during login' },
      { status: 500 }
    );
  }
}
