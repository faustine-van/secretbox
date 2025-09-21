"use client";
import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Shield, Key } from 'lucide-react';

interface PasswordInputProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  disabled: boolean;
}

export function PasswordInput({ name, value, onChange, placeholder, disabled }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const getLabel = () => {
    switch (name) {
      case 'password':
        return 'Account Password';
      case 'confirmPassword':
        return 'Confirm Account Password';
      case 'masterPassword':
        return 'Master Password';
      case 'confirmMasterPassword':
        return 'Confirm Master Password';
      default:
        return 'Password';
    }
  };

  const getIcon = () => {
    if (name.includes('master')) {
      return <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />;
    }
    return <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />;
  };

  const getDescription = () => {
    if (name === 'masterPassword') {
      return 'This password will be required to access your encrypted keys';
    }
    if (name === 'password') {
      return 'Used to sign in to your SecretBox account';
    }
    return null;
  };

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        {getLabel()}
        {name.includes('master') && (
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
            <Key className="w-3 h-3 mr-1" />
            Extra Security
          </span>
        )}
      </label>
      
      {getDescription() && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {getDescription()}
        </p>
      )}
      
      <div className="relative">
        {getIcon()}
        <input
          id={name}
          name={name}
          type={showPassword ? 'text' : 'password'}
          required
          value={value}
          onChange={onChange}
          className={`w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            name.includes('master') 
              ? 'focus:ring-blue-500 focus:border-blue-500' 
              : 'focus:ring-blue-500 focus:border-blue-500'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          placeholder={placeholder}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          disabled={disabled}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}