
'use client';

import { useAuditLogs } from '@/hooks/useAuditLogs';
import { Button } from '@/components/ui/button';
import { AuditFilters } from './AuditFilters';
import { ExportAuditLogs } from './ExportAuditLogs';
import { FileText } from 'lucide-react';

export function AuditLogViewer() {
  const { logs, isLoading, error, count, currentPage, fetchLogs } = useAuditLogs();
  const itemsPerPage = 10;
  const totalPages = Math.ceil(count / itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Audit Logs
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Track all important activities within your account.
          </p>
        </div>
        <ExportAuditLogs />
      </div>

      <AuditFilters onApplyFilters={(filters) => fetchLogs(1, filters)} />

      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-200/60 dark:border-slate-700/60 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{log.action.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(log.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right text-xs text-slate-500 dark:text-slate-400">
                <p>IP: {log.ip_address}</p>
                <p className="truncate max-w-[200px]">{log.user_agent}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Showing page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchLogs(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchLogs(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
