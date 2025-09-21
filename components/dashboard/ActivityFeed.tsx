"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, User, Key, FolderKanban, AlertTriangle } from 'lucide-react';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import Link from 'next/link';

const ActivityFeed: React.FC = () => {
  const { logs: activities, isLoading, error } = useAuditLogs();

  const getActivityIcon = (action: string) => {
    if (action.includes('key')) return Key;
    if (action.includes('collection')) return FolderKanban;
    if (action.includes('login') || action.includes('user')) return User;
    return Key;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Recent Activity
        </CardTitle>
        <Link href="/dashboard/audit">
          <Button variant="outline" size="sm">
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading && [...Array(4)].map((_, i) => (
            <div key={i} className="flex items-start space-x-4 animate-pulse">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/4"></div>
              </div>
            </div>
          ))}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <p>Could not load activity.</p>
            </div>
          )}
          {!isLoading && !error && activities.length === 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">No recent activity found.</p>
            </div>
          )}
          {!isLoading && !error && activities.map((activity) => {
            const Icon = getActivityIcon(activity.action);
            return (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center">
                  <Icon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-800 dark:text-slate-200">
                    <span className="font-medium">{activity.action.replace(/_/g, ' ')}</span>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {formatTime(activity.created_at)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
