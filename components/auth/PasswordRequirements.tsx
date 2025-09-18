"use client";
import React from 'react';
import { Check, X, Shield, AlertTriangle } from 'lucide-react';

interface PasswordRequirementsProps {
  password: string;
  isMaster?: boolean;
  showStrength?: boolean;
}

export function PasswordRequirements({ 
  password, 
  isMaster = false, 
  showStrength = true 
}: PasswordRequirementsProps) {
  const basicRequirements = [
    { text: 'At least 8 characters', met: password.length >= 8 },
    { text: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { text: 'Contains lowercase letter', met: /[a-z]/.test(password) },
    { text: 'Contains number', met: /\d/.test(password) }, // Fixed the typo
  ];

  const masterRequirements = [
    { text: 'At least 12 characters', met: password.length >= 12 },
    { text: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { text: 'Contains lowercase letter', met: /[a-z]/.test(password) },
    { text: 'Contains number', met: /\d/.test(password) },
    { text: 'Contains special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    { text: 'No repeating characters', met: !/(.)\1{2,}/.test(password) },
  ];

  const requirements = isMaster ? masterRequirements : basicRequirements;

  // Calculate strength
  const getStrength = () => {
    const metCount = requirements.filter(req => req.met).length;
    const percentage = (metCount / requirements.length) * 100;
    
    if (percentage < 25) return { level: 0, label: 'Very Weak', color: 'red' };
    if (percentage < 50) return { level: 1, label: 'Weak', color: 'orange' };
    if (percentage < 75) return { level: 2, label: 'Fair', color: 'yellow' };
    if (percentage < 90) return { level: 3, label: 'Good', color: 'blue' };
    return { level: 4, label: isMaster ? 'Very Strong' : 'Strong', color: 'green' };
  };

  const strength = getStrength();
  const metCount = requirements.filter(req => req.met).length;

  if (!password) return null;

  return (
    <div className="mt-3 space-y-3">
      {/* Strength Bar */}
      {showStrength && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              {isMaster ? 'Master Password' : 'Password'} Strength
            </span>
            <div className="flex items-center space-x-1">
              {strength.color === 'red' || strength.color === 'orange' ? (
                <AlertTriangle className="w-3 h-3 text-amber-500" />
              ) : (
                <Shield className="w-3 h-3 text-green-500" />
              )}
              <span className={`text-xs font-medium ${
                strength.color === 'red' ? 'text-red-600 dark:text-red-400' :
                strength.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                strength.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                strength.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                'text-green-600 dark:text-green-400'
              }`}>
                {strength.label}
              </span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  strength.level >= level - 1
                    ? strength.color === 'red' ? 'bg-red-500' :
                      strength.color === 'orange' ? 'bg-orange-500' :
                      strength.color === 'yellow' ? 'bg-yellow-500' :
                      strength.color === 'blue' ? 'bg-blue-500' :
                      'bg-green-500'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Requirements List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Requirements ({metCount}/{requirements.length} met)
          </span>
          {isMaster && metCount >= requirements.length - 1 && (
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                Enterprise Grade
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-1">
          {requirements.map((req, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-200 ${
                req.met 
                  ? 'bg-green-100 dark:bg-green-900/30' 
                  : 'bg-slate-100 dark:bg-slate-800'
              }`}>
                {req.met ? (
                  <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                ) : (
                  <X className="w-2 h-2 text-slate-400 dark:text-slate-500" />
                )}
              </div>
              <span className={`text-xs transition-colors duration-200 ${
                req.met 
                  ? 'text-green-600 dark:text-green-400 font-medium' 
                  : 'text-slate-500 dark:text-slate-400'
              }`}>
                {req.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Security Tips */}
      {isMaster && strength.level < 3 && (
        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                Master password needs improvement
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                This password protects all your secrets. Use 12+ characters with mixed case, numbers, and symbols.
              </p>
            </div>
          </div>
        </div>
      )}

      {isMaster && strength.level >= 4 && (
        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
            <p className="text-xs text-green-700 dark:text-green-300 font-medium">
              Excellent! This master password provides strong protection for your vault.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}