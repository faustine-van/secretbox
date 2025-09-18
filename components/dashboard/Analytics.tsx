"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Key, FolderKanban, ShieldCheck, Users } from 'lucide-react';

const Analytics: React.FC = () => {
  const stats = [
    { title: 'Total Secrets', value: '1,250', icon: Key, color: 'text-blue-500' },
    { title: 'Collections', value: '75', icon: FolderKanban, color: 'text-indigo-500' },
    { title: 'Team Members', value: '12', icon: Users, color: 'text-purple-500' },
    { title: 'Security Score', value: '98%', icon: ShieldCheck, color: 'text-green-500' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
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
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Analytics;