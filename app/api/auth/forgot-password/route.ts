import { createSupabaseServerClient } from '@/lib/server/supabase';
import { auditLog } from '@/lib/server/audit';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const ForgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const body = await request.json();
     
    // Validate input
    const validation = ForgotPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // Send password reset email - let Supabase handle user existence
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    });

    // Log the attempt (simplified logging without user lookup)
    try {
      if (resetError) {
        console.error('Password reset email error:', resetError);
        await auditLog(
          null, // Don't lookup user for security
          'password_reset_failed',
          'user',
          null,
          request,
          { email, reason: resetError.message }
        );
      } else {
        await auditLog(
          null, // Don't lookup user for security
          'password_reset_requested',
          'user',
          null,
          request,
          { email }
        );
      }
    } catch (auditError) {
      console.error('Audit log error:', auditError);
      // Don't fail the request if audit logging fails
    }

    // Check if there was a critical error sending the email
    if (resetError) {
      console.error('Password reset email error:', resetError);
      
      // For user not found errors, still return success to prevent enumeration
      if (resetError.message?.includes('User not found') || 
          resetError.message?.includes('Unable to validate email address') ||
          resetError.message?.includes('Invalid email')) {
        return NextResponse.json({
          message: 'If an account with that email exists, you will receive password reset instructions.',
        });
      }
      
      // For other critical errors (SMTP issues, etc.), return error
      return NextResponse.json(
        { error: 'Failed to send reset email. Please try again later.' },
        { status: 500 }
      );
    }

    // Return success message (user will only get email if account exists)
    return NextResponse.json({
      message: 'If an account with that email exists, you will receive password reset instructions.',
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}
