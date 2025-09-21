import { createSupabaseServerClient } from '@/lib/server/supabase';
import { auditLog } from '@/lib/server/audit';
import { NextResponse } from 'next/server';
import * as bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const body = await request.json();
    
    const { password, confirmPassword, masterPassword, confirmMasterPassword } = body;

    // Basic validation
    if (!password || !confirmPassword || !masterPassword || !confirmMasterPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords don't match" },
        { status: 400 }
      );
    }

    if (masterPassword !== confirmMasterPassword) {
      return NextResponse.json(
        { error: "Master passwords don't match" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Get the current user from the session
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('User error:', userError);
      return NextResponse.json(
        { error: 'Invalid or expired reset token. Please request a new password reset.' },
        { status: 401 }
      );
    }

    // Update the user's password in Supabase Auth
    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    });

    if (updateError) {
      console.error('Password update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update password: ' + updateError.message },
        { status: 500 }
      );
    }

    // Hash the new master password
    const masterPasswordHash = await bcrypt.hash(masterPassword, 12);

    // Update the master password in the user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({ 
        master_password_hash: masterPasswordHash,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (profileError) {
      console.error('Master password update error:', profileError);
      return NextResponse.json(
        { error: 'Failed to update master password: ' + profileError.message },
        { status: 500 }
      );
    }

    // Get user profile for logging
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single();

    // Log successful password reset
    if (auditLog) {
      try {
        await auditLog(
          user.id,
          'password_reset_completed',
          'user',
          user.id,
          request,
          { 
            email: user.email,
            full_name: profile?.full_name 
          }
        );
      } catch (auditError) {
        console.error('Audit log error:', auditError);
        // Don't fail the request if audit logging fails
      }
    }

    // Create response with session cookies
    const response = NextResponse.json({
      message: 'Password reset successful',
      user: {
        id: user.id,
        email: user.email,
        name: profile?.full_name || 'User'
      }
    });

    // Set authentication cookies since they're now fully authenticated
    response.cookies.set('user-session', JSON.stringify({
      userId: user.id,
      email: user.email,
      name: profile?.full_name || 'User',
      authenticated: true,
      masterPasswordVerified: true
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    response.cookies.set('auth-token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Reset password error:', error);
    
    // Make sure we always return JSON, even on error
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error during password reset'
      },
      { status: 500 }
    );
  }
}
