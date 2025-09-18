"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  User, 
  Sun, 
  Moon, 
  Menu,
  Settings,
  LogOut,
  Shield
} from 'lucide-react';
import { useTheme } from '../ThemeProvider';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onToggleSidebar, 
}) => {
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, title: 'New secret created', message: 'API key for production was added', time: '2 min ago', type: 'success' },
    { id: 2, title: 'Access attempt detected', message: 'Unusual login from new location', time: '5 min ago', type: 'warning' },
    { id: 3, title: 'Secret expires soon', message: 'Database password expires in 3 days', time: '1 hour ago', type: 'info' },
  ];

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/60 dark:border-slate-700/60 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search secrets, teams, or logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 md:w-96 pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all duration-200"
              aria-label="Search"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-slate-600" />
            ) : (
              <Sun className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === 'success' ? 'bg-green-500' :
                          notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {notification.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="User menu"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">John Doe</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Admin</p>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">John Doe</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">john.doe@company.com</p>
                </div>
                
                <a href="/dashboard/settings" className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300">
                  <Shield className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>Security Settings</span>
                </a>
                
                <a href="/dashboard/settings" className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300">
                  <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>Preferences</span>
                </a>
                
                <hr className="my-2 border-slate-200 dark:border-slate-700" />
                
                <button className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-red-600 dark:text-red-400">
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;