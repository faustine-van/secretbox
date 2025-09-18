import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Globe, 
  Database, 
  CreditCard, 
  FileText,
  Eye,
  Copy,
  MoreVertical,
  Filter,
  ChevronDown,
  Loader2,
  AlertTriangle,
  Search
} from 'lucide-react';
import { Secret } from '../types/Secret';
import { ViewState } from './Dashboard';

interface SecretsListProps {
  secrets: Secret[];
  viewState: ViewState;
  currentPage: number;
  onPageChange: (page: number) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  searchQuery: string;
}

const SecretsList: React.FC<SecretsListProps> = ({
  secrets,
  viewState,
  currentPage,
  onPageChange,
  selectedType,
  onTypeChange,
  searchQuery
}) => {
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(secrets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSecrets = secrets.slice(startIndex, startIndex + itemsPerPage);

  const secretTypes = [
    { value: 'all', label: 'All Types', count: secrets.length },
    { value: 'api-key', label: 'API Keys', count: secrets.filter(s => s.type === 'api-key').length },
    { value: 'database', label: 'Database', count: secrets.filter(s => s.type === 'database').length },
    { value: 'certificate', label: 'Certificates', count: secrets.filter(s => s.type === 'certificate').length },
    { value: 'token', label: 'Tokens', count: secrets.filter(s => s.type === 'token').length },
  ];

  const getSecretIcon = (type: string) => {
    switch (type) {
      case 'api-key': return Key;
      case 'database': return Database;
      case 'certificate': return FileText;
      case 'token': return Globe;
      default: return Key;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'expired': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'expiring': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading State
  if (viewState === 'loading') {
    return (
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-200/60 dark:border-slate-700/60 p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-slate-600 dark:text-slate-400">Loading your secrets...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (viewState === 'error') {
    return (
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg border border-red-200 dark:border-red-800 p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <p className="text-red-600 dark:text-red-400">Failed to load secrets</p>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty State
  if (viewState === 'empty' || (secrets.length === 0 && searchQuery)) {
    return (
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-200/60 dark:border-slate-700/60 p-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center">
            {searchQuery ? (
              <Search className="w-8 h-8 text-slate-400" />
            ) : (
              <Key className="w-8 h-8 text-slate-400" />
            )}
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {searchQuery ? 'No secrets found' : 'No secrets yet'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md">
              {searchQuery 
                ? `No secrets match "${searchQuery}". Try adjusting your search terms.`
                : 'Get started by creating your first secret. All your API keys, passwords, and certificates will appear here.'
              }
            </p>
          </div>
          {!searchQuery && (
            <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-sm">
              Add Your First Secret
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Secrets
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your API keys, passwords, and certificates
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              aria-label="Filter secrets"
            >
              <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {secretTypes.find(t => t.value === selectedType)?.label}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-10">
                {secretTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => {
                      onTypeChange(type.value);
                      setShowFilterMenu(false);
                      onPageChange(1);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                      selectedType === type.value ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-sm">{type.label}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                      {type.count}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-sm font-medium">
            Add Secret
          </button>
        </div>
      </div>

      {/* Secrets Grid */}
      <div className="grid gap-4">
        {paginatedSecrets.map((secret) => {
          const Icon = getSecretIcon(secret.type);
          
          return (
            <div
              key={secret.id}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-200/60 dark:border-slate-700/60 p-4 hover:shadow-lg hover:bg-white/90 dark:hover:bg-slate-900/90 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-slate-900 dark:text-slate-100 truncate">
                        {secret.name}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(secret.status)}`}>
                        {secret.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-1 text-sm text-slate-500 dark:text-slate-400">
                      <span className="capitalize">{secret.type.replace('-', ' ')}</span>
                      <span>•</span>
                      <span>Last accessed {formatDate(secret.lastAccessed)}</span>
                      {secret.expiresAt && (
                        <>
                          <span>•</span>
                          <span>Expires {formatDate(secret.expiresAt)}</span>
                        </>
                      )}
                    </div>
                    
                    {secret.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 truncate">
                        {secret.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label="View secret"
                  >
                    <Eye className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  </button>
                  <button 
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Copy secret"
                  >
                    <Copy className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  </button>
                  <button 
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label="More options"
                  >
                    <MoreVertical className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, secrets.length)} of {secrets.length} secrets
          </p>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecretsList;