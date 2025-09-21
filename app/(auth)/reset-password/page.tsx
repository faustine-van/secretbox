"use client";

import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const [isValidating, setIsValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setError('Invalid reset link - missing token');
      setIsValidating(false);
      return;
    }

    // Token exists, we just let ResetPasswordForm handle the update
    setIsValidToken(true);
    setIsValidating(false);
  }, [searchParams]);

  if (isValidating) return (
    <div className="flex items-center justify-center space-x-2">
      <span>Validating reset token...</span>
      <LoadingSpinner />
    </div>
  );

  if (error) return <div className="text-center text-red-600">{error}</div>;
  if (!isValidToken) return <div className="text-center text-red-600">Invalid or expired reset link</div>;

  return <ResetPasswordForm />;
}
