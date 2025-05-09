'use client'; // only NavItem is a client component

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import React, { JSX } from 'react';

export function NavItem({
  route,
  onClick
}: {
  route: {
    PATH: string;
    NAME: string;
    ICON: JSX.Element | null;
    FOR: string;
  };
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = route.PATH === pathname;

  if (!route.ICON) return null;

  const itemClassName = `flex items-center rounded-xl px-3 py-3 hover:bg-zinc-800 w-full cursor-pointer ${isActive ? 'bg-zinc-800 font-semibold' : ''}`;

  if (onClick) return (
    <button
      onClick={onClick}
      className={itemClassName}
    >
      {route.ICON}
      <span className="ml-4 max-xl:hidden">{route.NAME}</span>
    </button>
  );

  return (
    <Link
      href={route.PATH}
      className={itemClassName}
    >
      {route.ICON}
      <span className="ml-4 max-xl:hidden">{route.NAME}</span>
    </Link>
  );
}
