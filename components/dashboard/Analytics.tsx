"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Key, FolderKanban, ShieldCheck, Users, AlertTriangle } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats';

const Analytics: React.FC = () => {
  const { stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Dashboard Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/4 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 animate-pulse"></div>
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-3/4 mt-2 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 col-span-1 md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-700 dark:text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <span>Failed to load stats</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600 dark:text-red-400">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  const statsData = [
    { title: 'Total Secrets', value: stats?.totalSecrets ?? 0, icon: Key, color: 'text-blue-500', placeholder: 'Add a secret to begin' },
    { title: 'Collections', value: stats?.totalCollections ?? 0, icon: FolderKanban, color: 'text-indigo-500', placeholder: 'Create a collection to start' },
    { title: 'Team Members', value: stats?.teamMembers ?? 0, icon: Users, color: 'text-purple-500', placeholder: 'Invite a team member' },
    { title: 'Security Score', value: `${stats?.securityScore ?? 0}%`, icon: ShieldCheck, color: 'text-green-500', placeholder: 'Secure your first key' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat) => (
          <Card key={stat.title} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stat.value}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {stat.value === 0 ? stat.placeholder : ' '}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
