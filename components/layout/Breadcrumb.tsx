
import React from 'react';

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function Breadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(segment => segment);

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
      <Link href="/dashboard">
        <a className="hover:text-foreground">Dashboard</a>
      </Link>
      {pathSegments.map((segment, index) => {
        const href = '/' + pathSegments.slice(0, index + 1).join('/');
        const isLast = index === pathSegments.length - 1;
        return (
          <React.Fragment key={href}>
            <ChevronRight className="h-4 w-4" />
            <Link href={href}>
              <a className={`${isLast ? 'text-foreground' : 'hover:text-foreground'}`}>
                {segment}
              </a>
            </Link>
          </React.Fragment>
        );
      })}
    </nav>
  );
}
