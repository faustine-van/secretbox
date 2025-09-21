
'use client';

import { Button } from '@/components/ui/button';

export function ExportAuditLogs() {
  const handleExport = async () => {
    const response = await fetch('/api/audit/export');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit_logs.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <Button onClick={handleExport} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">Export Logs</Button>
  );
}
