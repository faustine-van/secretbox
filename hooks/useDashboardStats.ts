"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';

interface DashboardStats {
  totalSecrets: number;
  totalCollections: number;
  teamMembers: number;
  securityScore: number;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch dashboard stats' }));
        throw new Error(errorData.error || 'Failed to fetch dashboard stats');
      }
      
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      setStats(data);
    } catch (err: any) {
      // Check if the error is due to empty JSON response, which is expected for new users
      if (err.message.includes('Unexpected end of JSON input')) {
        setStats({ totalSecrets: 0, totalCollections: 0, teamMembers: 1, securityScore: 100 });
      } else {
        setError(err);
        toast({
          title: 'Error fetching stats',
          description: err.message,
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, fetchStats };
}
