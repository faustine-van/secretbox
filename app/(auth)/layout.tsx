import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SecretBox',
  description: 'Sign in or create an account for SecretBox.',
};
// app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center p-4">
      {children}
    </div>
  );
}
