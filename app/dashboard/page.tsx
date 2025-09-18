import Analytics from '@/components/dashboard/Analytics';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import SecurityAlerts from '@/components/audit/SecurityAlerts';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <Analytics />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
        <div>
          <SecurityAlerts />
        </div>
      </div>
    </div>
  );
}
