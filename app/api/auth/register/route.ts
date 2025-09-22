// pages/api/auth/register.ts
import { createSupabaseServerClient } from '@/lib/server/supabase';
import { RegisterSchema } from '@/lib/validations';
import { NextResponse } from 'next/server';
import * as bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const body = await request.json();
    const { email, password, name, masterPassword } = body;

    const validation = RegisterSchema.safeParse({ 
      email, 
      password, 
      name, 
      masterPassword 
    });
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validation.error.issues },
        { status: 400 }
      );
    }

    const masterPasswordHash = await bcrypt.hash(masterPassword, 12);

    const { data: { user, session }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          master_password_hash: masterPasswordHash
        }
      }
    });

    if (signUpError || !user) {
      return NextResponse.json(
        { error: signUpError?.message || 'Failed to create account' },
        { status: 400 }
      );
    }

    const response = NextResponse.json({
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        name: name
      }
    });

    if (session) {
      // (cookies setting code remains the same)
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
        maxAge: 60 * 60 * 24 * 30,
        path: '/'
      });
    }

    response.cookies.set('user-session', JSON.stringify({
      userId: user.id,
      email: user.email,
      name: name,
      authenticated: true,
      masterPasswordVerified: true
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });

    response.cookies.set('auth-token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error during registration' },
      { status: 500 }
    );
  }
}