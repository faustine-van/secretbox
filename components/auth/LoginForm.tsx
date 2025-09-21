"use client";

import React, { useState } from 'react';
import { 
  Shield, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2,
  ArrowRight,
  Key
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [step, setStep] = useState<'credentials' | 'master-password'>('credentials');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    masterPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // First step: verify email and password only
      const { error } = await login(formData.email, formData.password);
      if (error) {
        throw new Error(error.message || 'Invalid credentials');
      }
      
      // Show success toast for credentials verification
      toast({
        title: "Credentials Verified",
        description: "Please enter your master password to continue",
      });

      // Move to master password step
      setStep('master-password');
    } catch (err) {
      // Show error toast for login failure
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: err instanceof Error ? err.message : 'Login failed',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMasterPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Second step: verify master password
      const { error } = await login(formData.email, formData.password, formData.masterPassword);
      if (error) {
        throw new Error(error.message || 'Invalid master password');
      }
      
      // Show success toast for master password verification
      toast({
        title: "Master Password Verified",
        description: "Welcome back! You have successfully logged in.",
      });
      
      router.push('/dashboard');
    } catch (err) {
      // Show error toast for master password verification failure
      toast({
        variant: "destructive",
        title: "Master Password Verification Failed",
        description: err instanceof Error ? err.message : 'Master password verification failed',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onSwitchToRegister = () => {
    router.push('/register');
  };

  // switch to forget-password
  const onSwitchToForgetPassword = () => {
    router.push('/forget-password');
  };

  const goBackToCredentials = () => {
    setStep('credentials');
    // Show success toast for going back to credentials step
    toast({
      title: "Credentials Step",
      description: "You have switched back to the credentials step",
    });
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
          {step === 'master-password' ? (
            <Key className="w-8 h-8 text-white" />
          ) : (
            <Shield className="w-8 h-8 text-white" />
          )}
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
          {step === 'master-password' ? 'Master Password' : 'Welcome Back'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {step === 'master-password' 
            ? 'Enter your master password to access your vault' 
            : 'Sign in to your SecretBox account'
          }
        </p>
      </div>

      {/* Login Form */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-8 shadow-xl">
        
        {step === 'credentials' ? (
          <form onSubmit={handleCredentialsSubmit} className="space-y-6">
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
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all duration-200"
                  placeholder="Enter your email"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Account Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all duration-200"
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                  disabled={isSubmitting}
                />
                <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                disabled={isSubmitting}
                onClick={onSwitchToForgetPassword}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-slate-400 disabled:to-slate-500 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleMasterPasswordSubmit} className="space-y-6">
            {/* Master Password Field */}
            <div className="space-y-2">
              <label htmlFor="masterPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Master Password
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  <Key className="w-3 h-3 mr-1" />
                  Vault Access
                </span>
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enter your master password to unlock your encrypted vault
              </p>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="masterPassword"
                  name="masterPassword"
                  type={showMasterPassword ? 'text' : 'password'}
                  required
                  value={formData.masterPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all duration-200"
                  placeholder="Enter your master password"
                  disabled={isSubmitting}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowMasterPassword(!showMasterPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  disabled={isSubmitting}
                >
                  {showMasterPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-slate-400 disabled:to-slate-500 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Key className="w-5 h-5" />
                    <span>Unlock Vault</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={goBackToCredentials}
                disabled={isSubmitting}
                className="w-full py-2 px-4 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors"
              >
                ← Back to credentials
              </button>
            </div>
          </form>
        )}

        {/* Sign Up Link - Only show in credentials step */}
        {step === 'credentials' && (
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                disabled={isSubmitting}
              >
                Sign up
              </button>
            </p>
          </div>
        )}
      </div>
      
      {/* Security Message */}
      <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        {step === 'master-password' ? (
          <p>🔐 Your master password is never stored on our servers</p>
        ) : (
          <p>🔒 Your keys are encrypted and secure with us</p>
        )}
      </div>
    </div>
  );
}