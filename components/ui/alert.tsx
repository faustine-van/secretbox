import * as React from "react";
import { cn } from "@/lib/utils"; // if you have cn helper

export function Alert({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="alert"
      className={cn("rounded-lg border p-4 text-sm shadow-sm", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-muted-foreground", className)} {...props} />
  );
}
