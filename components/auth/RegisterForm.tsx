"use client";

import React, { useState } from 'react';
import { 
  Shield, 
  Mail, 
  Lock, 
  ArrowRight,
  User,
  Loader2, // Added missing import
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { PasswordInput } from './PasswordInput';
import { PasswordRequirements } from './PasswordRequirements';

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    masterPassword: '',
    confirmMasterPassword: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.masterPassword !== formData.confirmMasterPassword) {
      setError('Master passwords do not match');
      return;
    }
    if (!acceptedTerms) {
      setError('Please accept the terms and conditions');
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

      // Show success message if data exists
      if (response.data?.message) {
        console.log('Registration successful:', response.data.message);
      }
      
      // Redirect to email verification page or dashboard
      router.push('/auth/verify-email');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const onSwitchToLogin = () => {
    router.push('/login');
  };

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
          <PasswordRequirements password={formData.masterPassword} />
          <PasswordInput
            name="confirmMasterPassword"
            placeholder="Confirm your master password"
            value={formData.confirmMasterPassword}
            onChange={handleInputChange}
            disabled={isSubmitting}
          />

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

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