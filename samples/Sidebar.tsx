import React, { useState } from 'react';
import { 
  Home, 
  Key, 
  Users, 
  FileText, 
  Settings, 
  ChevronLeft,
  Shield
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const [activeItem, setActiveItem] = useState('secrets');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'secrets', label: 'Secrets', icon: Key },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'audit', label: 'Audit Logs', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 z-40 h-screen transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      } bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-r border-slate-200/60 dark:border-slate-700/60`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                SecretBox
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Key Management</p>
            </div>
          )}
        </div>
        
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className={`w-4 h-4 text-slate-600 dark:text-slate-400 transition-transform ${
            collapsed ? 'rotate-180' : ''
          }`} />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="p-2 mt-4">
        <ul className="space-y-1" role="list">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveItem(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'group-hover:text-slate-700 dark:group-hover:text-slate-200'
                  }`} />
                  {!collapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                  {isActive && !collapsed && (
                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-lg border border-blue-100 dark:border-slate-600">
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-1">Security Status</p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-slate-500 dark:text-slate-400">All systems secure</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;