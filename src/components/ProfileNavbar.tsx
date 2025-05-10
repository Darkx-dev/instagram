"use client"
import { BookmarkIcon, Grid3x3Icon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import React from 'react';

interface ProfileNavbarProps {
  isCurrentUser?: boolean;
}

export default function ProfileNavbar({ isCurrentUser = false }: ProfileNavbarProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get('tab');

    // Define routes based on whether this is the current user's profile
    const profileRoutes = [
        {
            PATH: pathname,
            QUERY: '',
            NAME: 'Posts',
            ICON: <Grid3x3Icon size={15}/>,
            FOR: 'profile'
        }
    ];

    // Only show saved posts tab for the current user
    if (isCurrentUser) {
        profileRoutes.push({
            PATH: pathname,
            QUERY: '?tab=saved',
            NAME: 'Saved',
            ICON: <BookmarkIcon size={15}/>,
            FOR: 'profile'
        });
    }

    return (
        <div className='flex justify-center text-xs font-medium tracking-wider border-t border-zinc-600 gap-10'>
            {profileRoutes.map((route) => {
                const isActive = route.QUERY === (currentTab ? `?tab=${currentTab}` : '');
                return (
                    <Link
                        key={route.NAME}
                        href={`${route.PATH}${route.QUERY}`}
                        className={`flex gap-2 items-center uppercase py-4 ${isActive ? 'border-t-2' : ''}`}
                    >
                        {route.ICON} {route.NAME}
                    </Link>
                )
            })}
        </div>
    )
}
