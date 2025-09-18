
'use client';

import { useEffect, useState } from 'react';
import { AuditEvent } from '@/types/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/audit');
        if (!response.ok) {
          throw new Error('Failed to fetch audit logs');
        }
        const { audit_logs } = await response.json();
        setLogs(audit_logs);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-xl font-bold">Audit Logs</h2>
      <div className="mt-4 space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="flex items-center space-x-4">
            <div>
              <p className="text-sm font-medium">{log.action}</p>
              <p className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
