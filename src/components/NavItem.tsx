'use client'; // only NavItem is a client component

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import React, { JSX } from 'react';

export function NavItem({
  route,
}: {
  route: {
    PATH: string;
    NAME: string;
    ICON: JSX.Element | null;
    FOR: string;
  };
}) {
  const pathname = usePathname();
  const isActive = route.PATH === pathname;

  if (!route.ICON) return null;

  return (
    <Link
      href={route.PATH}
      className={`flex items-center rounded-xl px-3 py-3 hover:bg-zinc-800 ${
        isActive ? 'bg-zinc-800 font-semibold' : ''
      }`}
    >
      {route.ICON}
      <span className="ml-4 max-xl:hidden">{route.NAME}</span>
    </Link>
  );
}
