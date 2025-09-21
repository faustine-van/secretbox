"use client";

import React, { useState } from 'react';
import { 
  Shield, 
  Mail, 
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export function ForgotPasswordForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset email');
      }

      // Show success state
      setIsEmailSent(true);
      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions",
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset email';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Request Failed",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const goBackToLogin = () => {
    router.push('/login');
  };

  const resendEmail = () => {
    setIsEmailSent(false);
    setError('');
  };

  if (isEmailSent) {
    return (
      <div className="w-full max-w-md">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-2">
            Check Your Email
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            We've sent password reset instructions to your email
          </p>
        </div>

        {/* Success Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-8 shadow-xl">
          <div className="text-center space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-300">
                We've sent password reset instructions to:
              </p>
              <p className="font-medium text-green-800 dark:text-green-200 mt-1">
                {email}
              </p>
            </div>
            
            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
              <p>Please check your email and click the reset link to continue.</p>
              <p>The link will expire in 1 hour for security reasons.</p>
            </div>

            <div className="space-y-3 pt-4">
              <button
                onClick={resendEmail}
                className="w-full py-3 px-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                Resend Email
              </button>
              
              <button
                onClick={goBackToLogin}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>Didn't receive the email? Check your spam folder</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
          Reset Password
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Enter your email to receive reset instructions
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all duration-200"
                placeholder="Enter your email address"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !email.trim()}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-slate-400 disabled:to-slate-500 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <button
            onClick={goBackToLogin}
            disabled={isSubmitting}
            className="inline-flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </button>
        </div>
      </div>

      {/* Security Message */}
      <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>For security, reset links expire after 1 hour</p>
      </div>
    </div>
  );
}