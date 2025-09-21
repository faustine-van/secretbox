"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useAuth } from '../auth/AuthProvider';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/components/layout/ResponsiveLayout';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, className }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAuth();
  const { isMobile, isTablet } = useResponsive();
  
  useProtectedRoute();

  // Auto-collapse sidebar on mobile/tablet
  useEffect(() => {
    if (isMobile || isTablet) {
      setSidebarCollapsed(true);
    }
  }, [isMobile, isTablet]);

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobile, sidebarOpen]);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  // Loading state with proper centering
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <div className="flex flex-col items-center space-y-4 text-slate-600 dark:text-slate-400">
          <LoadingSpinner />
          <p className="text-slate-600 dark:text-slate-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // User not authenticated
  if (!user) {
    return null;
  }

  // Calculate main content margin based on sidebar state and screen size
  const getMainContentClasses = () => {
    if (isMobile) {
      return 'ml-0'; // No margin on mobile, sidebar overlays
    }
    return sidebarCollapsed ? 'ml-16' : 'ml-64';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-all duration-300">
      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        open={sidebarOpen}
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />
      
      {/* Main content area */}
      <div className={cn(
        'transition-all duration-300 min-h-screen',
        getMainContentClasses(),
        className
      )}>
        {/* Header */}
        <Header 
          onToggleSidebar={toggleSidebar} 
          sidebarCollapsed={sidebarCollapsed}
          isMobile={isMobile}
        />
        
        {/* Main content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-6">
              {children}
            </div>
          </div>
        </main>

        {/* Footer for larger screens */}
        {!isMobile && (
          <footer className="border-t border-slate-200/60 dark:border-slate-700/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  © 2024 SecureVault. All rights reserved.
                </div>
                <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                  <button className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                    Privacy Policy
                  </button>
                  <button className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                    Terms of Service
                  </button>
                  <button className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                    Support
                  </button>
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;