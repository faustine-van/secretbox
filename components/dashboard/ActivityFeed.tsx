"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, User, Key, FolderKanban } from 'lucide-react';

const ActivityFeed: React.FC = () => {
  const activities = [
    {
      id: 1,
      user: 'John Doe',
      action: 'added a new secret',
      target: 'Production API Key',
      time: '2 hours ago',
      icon: Key,
    },
    {
      id: 2,
      user: 'Jane Smith',
      action: 'created a new collection',
      target: 'Frontend Secrets',
      time: '5 hours ago',
      icon: FolderKanban,
    },
    {
      id: 3,
      user: 'Admin',
      action: 'invited a new team member',
      target: 'alex@company.com',
      time: '1 day ago',
      icon: User,
    },
    {
      id: 4,
      user: 'John Doe',
      action: 'accessed a secret',
      target: 'Staging Database Password',
      time: '2 days ago',
      icon: Key,
    },
  ];

  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Recent Activity
        </CardTitle>
        <Button variant="outline" size="sm">
          View All
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center">
                <activity.icon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-800 dark:text-slate-200">
                  <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                  <span className="font-medium text-blue-600 dark:text-blue-400">{activity.target}</span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;