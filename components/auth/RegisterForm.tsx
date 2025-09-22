"use client";

import React, { useState } from 'react';
import { 
  Shield, 
  Mail, 
  Lock, 
  ArrowRight,
  User,
  Loader2,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { PasswordInput } from './PasswordInput';
import { PasswordRequirements } from './PasswordRequirements';

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    masterPassword: '',
    confirmMasterPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Passwords do not match",
      });
      return;
    }
    if (formData.masterPassword !== formData.confirmMasterPassword) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Master passwords do not match",
      });
      return;
    }
    if (!acceptedTerms) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Please accept the terms and conditions",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await register(
        formData.email, 
        formData.password, 
        formData.name, 
        formData.masterPassword
      );
      
      if (response.error) {
        throw new Error(response.error.message);
      }

      // Show success message
      toast({
        title: "Registration Successful",
        description: response.data?.message || "Please check your email to verify your account.",
      });
      
      // Show success state
      setIsEmailSent(true);
      toast({
        title: "Registration Successful",
        description:
          "Please check your email and verify your account before logging in.",
      });      
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: err instanceof Error ? err.message : 'An unknown error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onSwitchToLogin = () => {
    router.push('/login');
  };

  const resendEmail = () => {
    setIsEmailSent(false);
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
            Verify Your Email
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            We've sent a verification link to your email
          </p>
        </div>

        {/* Success Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-8 shadow-xl">
          <div className="text-center space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-300">
                Verification link sent to:
              </p>
              <p className="font-medium text-green-800 dark:text-green-200 mt-1">
                {formData.email}
              </p>
            </div>

            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
              <p>Please check your inbox and click the link to activate your account.</p>
              <p>The link will expire for security reasons.</p>
            </div>

            <div className="space-y-3 pt-4">
              <button
                onClick={resendEmail}
                className="w-full py-3 px-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                Resend Email
              </button>

              <button
                onClick={onSwitchToLogin}
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
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
          Create Account
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Join SecretBox and secure your keys
        </p>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields */}
          <NameInput value={formData.name} onChange={handleInputChange} disabled={isSubmitting} />
          <EmailInput value={formData.email} onChange={handleInputChange} disabled={isSubmitting} />
          <PasswordInput 
            name="password"
            placeholder="Create a strong password"
            value={formData.password} 
            onChange={handleInputChange} 
            disabled={isSubmitting} 
          />
          <PasswordRequirements password={formData.password} />

          <PasswordInput 
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword} 
            onChange={handleInputChange} 
            disabled={isSubmitting} 
          />
          <PasswordInput
            name="masterPassword"
            placeholder="Create a strong master password"
            value={formData.masterPassword}
            onChange={handleInputChange}
            disabled={isSubmitting}
          />
          <PasswordRequirements password={formData.masterPassword} isMaster={true} />
          <PasswordInput
            name="confirmMasterPassword"
            placeholder="Confirm your master password"
            value={formData.confirmMasterPassword}
            onChange={handleInputChange}
            disabled={isSubmitting}
          />

          <TermsCheckbox checked={acceptedTerms} onChange={setAcceptedTerms} disabled={isSubmitting} />

          <SubmitButton isSubmitting={isSubmitting} disabled={!acceptedTerms} />
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              disabled={isSubmitting}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
      <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>🛡️ Your master password adds an extra layer of security</p>
      </div>
    </div>
  );
}

// Input field components
function NameInput({ value, onChange, disabled }: any) {
  return (
    <div className="space-y-2">
      <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        Full Name
      </label>
      <div className="relative">
        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          id="name" 
          name="name" 
          type="text" 
          required 
          value={value} 
          onChange={onChange}
          onInput={onChange}
          data-testid="name-input"
          disabled={disabled} 
          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          placeholder="Enter your full name" 
        />
      </div>
    </div>
  );
}

function EmailInput({ value, onChange, disabled }: any) {
  return (
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
          value={value} 
          onChange={onChange}
          onInput={onChange}
          data-testid="email-input"
          disabled={disabled} 
          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          placeholder="Enter your email" 
        />
      </div>
    </div>
  );
}

function TermsCheckbox({ checked, onChange, disabled }: any) {
  return (
    <div className="flex items-start space-x-3">
      <input 
        id="terms" 
        type="checkbox" 
        checked={checked} 
        onChange={(e) => onChange(e.target.checked)} 
        disabled={disabled}
        data-testid="terms-checkbox"
        className="w-4 h-4 mt-0.5 text-blue-600 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500" 
      />
      <label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400">
        I agree to the{' '}
        <button type="button" className="text-blue-600 dark:text-blue-400 hover:text-blue-700">
          Terms of Service
        </button>{' '}
        and{' '}
        <button type="button" className="text-blue-600 dark:text-blue-400 hover:text-blue-700">
          Privacy Policy
        </button>
      </label>
    </div>
  );
}

function SubmitButton({ isSubmitting, disabled }: any) {
  return (
    <button 
      type="submit" 
      disabled={isSubmitting || disabled} 
      data-testid="create-account-button"
      className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-slate-400 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
    >
      {isSubmitting ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          <span>Create Account</span>
          <ArrowRight className="w-5 h-5" />
        </>
      )}
    </button>
  );
}