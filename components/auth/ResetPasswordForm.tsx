"use client";

import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  ArrowRight,
  Loader2,
  Key
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { PasswordInput } from './PasswordInput';
import { PasswordRequirements } from './PasswordRequirements';
import { createClient } from '@/lib/client/supabase';

export function ResetPasswordForm() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    masterPassword: '',
    confirmMasterPassword: ''
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Passwords do not match",
      });
      return;
    }

    if (formData.masterPassword !== formData.confirmMasterPassword) {
      setError('Master passwords do not match');
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Master passwords do not match",
      });
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Password must be at least 8 characters long",
      });
      return;
    }

    if (formData.masterPassword.length < 8) {
      setError('Master password must be at least 8 characters long');
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Master password must be at least 8 characters long",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Update the user's password using the existing Supabase session
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.password,
        // You can store master password as a metadata field if needed
        // For example: user_metadata: { masterPassword: formData.masterPassword }
        data: { masterPassword: formData.masterPassword }
      });

      if (updateError) throw updateError;

      toast({
        title: "Password Reset Successful!",
        description: "Your password has been updated. You are now logged in.",
      });

      router.push('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password reset failed';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Reset Failed",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
          <Key className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          Set New Password
        </h1>
        <p className="text-slate-600">
          Create a new password and master password for your account
        </p>
      </div>

      {/* Form */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Password */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Lock className="w-5 h-5 text-slate-600" />
              <h3 className="text-lg font-medium text-slate-900">Account Password</h3>
            </div>
            <PasswordInput
              name="password"
              placeholder="Create a new password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
            <PasswordRequirements password={formData.password} />
            <PasswordInput
              name="confirmPassword"
              placeholder="Confirm your new password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>

          {/* Master Password */}
          <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-5 h-5 text-slate-600" />
              <h3 className="text-lg font-medium text-slate-900">Master Password</h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">
                Vault Access
              </span>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Your master password encrypts and protects your secret keys. Choose something strong and memorable.
            </p>
            <PasswordInput
              name="masterPassword"
              placeholder="Create a new master password"
              value={formData.masterPassword}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
            <PasswordRequirements password={formData.masterPassword} />
            <PasswordInput
              name="confirmMasterPassword"
              placeholder="Confirm your new master password"
              value={formData.confirmMasterPassword}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !formData.password || !formData.confirmPassword || !formData.masterPassword || !formData.confirmMasterPassword}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-slate-400 disabled:to-slate-500 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Reset Password</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="mt-8 text-center text-sm text-slate-500">
        <p>🔐 Your master password is never stored on our servers</p>
      </div>
    </div>
  );
}
