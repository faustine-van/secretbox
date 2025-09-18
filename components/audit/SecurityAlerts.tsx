"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

const SecurityAlerts: React.FC = () => {
  const alerts = [
    {
      id: 1,
      title: 'Unusual Login Detected',
      description: 'A login from a new device was detected in Tokyo, Japan.',
      severity: 'high',
    },
    {
      id: 2,
      title: 'Secret Nearing Expiration',
      description: 'The "Production Database Password" will expire in 3 days.',
      severity: 'medium',
    },
    {
      id: 3,
      title: 'New Team Member Added',
      description: 'alex@company.com was added to the Frontend team.',
      severity: 'low',
    },
  ];

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'high':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
          text: 'text-red-700 dark:text-red-400',
          bg: 'bg-red-50 dark:bg-red-900/20',
        };
      case 'medium':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
          text: 'text-yellow-700 dark:text-yellow-400',
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        };
      case 'low':
      default:
        return {
          icon: <ShieldCheck className="w-5 h-5 text-green-500" />,
          text: 'text-green-700 dark:text-green-400',
          bg: 'bg-green-50 dark:bg-green-900/20',
        };
    }
  };

  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Security Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => {
            const styles = getSeverityStyles(alert.severity);
            return (
              <div key={alert.id} className={`p-3 rounded-lg flex items-start space-x-4 ${styles.bg}`}>
                <div className="mt-1">{styles.icon}</div>
                <div className="flex-1">
                  <h4 className={`font-medium text-sm ${styles.text}`}>{alert.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    {alert.description}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="text-xs">
                  Details
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityAlerts;