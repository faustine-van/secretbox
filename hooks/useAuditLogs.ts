"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';
import { AuditEvent } from '@/types/supabase';

export function useAuditLogs() {
  const [logs, setLogs] = useState<AuditEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<{ startDate?: string, endDate?: string, action?: string }>({});
  const { toast } = useToast();

  const fetchLogs = useCallback(async (page = 1, newFilters = filters) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...newFilters
      });
      const response = await fetch(`/api/audit?${params.toString()}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch audit logs');
      }
      const { audit_logs, count } = await response.json();
      setLogs(audit_logs);
      setCount(count || 0);
      setCurrentPage(page);
      setFilters(newFilters);
    } catch (err: any) {
      setError(err);
      toast({
        title: 'Error fetching logs',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, filters]);

  useEffect(() => {
    fetchLogs(1);
  }, [fetchLogs]);

  return { logs, isLoading, error, count, currentPage, fetchLogs, setFilters };
}
