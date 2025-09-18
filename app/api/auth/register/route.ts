import { createSupabaseServerClient } from '@/lib/server/supabase';
import { RegisterSchema } from '@/lib/validations';
import { auditLog } from '@/lib/server/audit';
import { NextResponse } from 'next/server';
import * as bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const body = await request.json();
    const { email, password, name, masterPassword } = body;

    // Validate input
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

    // Check if user already exists in our user_profiles table
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', email)
      .single();
      
    if (existingProfile) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Create user with Supabase
    const { data: { user, session }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name
        }
      }
    });

    if (signUpError || !user) {
      console.error('Supabase signup error:', signUpError);
      return NextResponse.json(
        { error: signUpError?.message || 'Failed to create account' },
        { status: 400 }
      );
    }

    // Hash master password
    const masterPasswordHash = await bcrypt.hash(masterPassword, 12);

    // Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: user.id,
        email: user.email,
        full_name: name,
        master_password_hash: masterPasswordHash,
        created_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      
      // If profile creation fails, we should clean up the auth user
      await supabase.auth.admin.deleteUser(user.id);
      
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      );
    }

    // Set session cookies after successful registration
    const response = NextResponse.json({
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        name: name
      }
    });
    
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
      name: name,
      authenticated: true,
      masterPasswordVerified: true
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    // Set auth token cookie for middleware
    response.cookies.set('auth-token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    // Log successful registration
    await auditLog(
      user.id,
      'user_registration_success',
      'user',
      user.id,
      request,
      { email, full_name: name }
    );

    return response;

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error during registration' },
      { status: 500 }
    );
  }
}