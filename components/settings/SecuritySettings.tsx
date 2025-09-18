
'use client';

import { Button } from '@/components/ui/button';

export function SecuritySettings() {
  return (
    <div>
      <h2 className="text-xl font-bold">Security Settings</h2>
      <div className="mt-4 space-y-4">
        <div>
          <h3 className="text-lg font-bold">Master Password</h3>
          <Button className="mt-2">Change Master Password</Button>
        </div>
        <div>
          <h3 className="text-lg font-bold">Two-Factor Authentication</h3>
          <Button className="mt-2">Enable 2FA</Button>
        </div>
        <div>
          <h3 className="text-lg font-bold">Account Deletion</h3>
          <Button variant="destructive" className="mt-2">Delete Account</Button>
        </div>
      </div>
    </div>
  );
}
