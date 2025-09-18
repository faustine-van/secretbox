import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import SecretsList from './SecretsList';
import { Secret } from '../types/Secret';
import { generateMockSecrets } from '../utils/mockData';

export type ViewState = 'loading' | 'error' | 'empty' | 'loaded';

const Dashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [viewState, setViewState] = useState<ViewState>('loading');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const mockSecrets = generateMockSecrets();
      setSecrets(mockSecrets);
      setViewState(mockSecrets.length > 0 ? 'loaded' : 'empty');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const filteredSecrets = useMemo(() => {
    return secrets.filter(secret => {
      const matchesSearch = secret.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           secret.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || secret.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [secrets, searchQuery, selectedType]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 transition-all duration-300">
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <TopBar 
          onSearch={setSearchQuery} 
          searchQuery={searchQuery}
          onToggleSidebar={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
        />
        
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <SecretsList 
              secrets={filteredSecrets}
              viewState={viewState}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              searchQuery={searchQuery}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;