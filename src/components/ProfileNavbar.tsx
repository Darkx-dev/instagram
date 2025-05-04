"use client"
import { BookmarkIcon, Grid3x3Icon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
const profileRoutes = [
    {
        PATH: '/profile',
        NAME: 'Posts',
        ICON: <Grid3x3Icon size={15}/>,
        FOR: 'profile'
    },
    {
        PATH: '/profile/saved',
        NAME: 'Saved',
        ICON: <BookmarkIcon size={15}/>,
        FOR: 'profile'
    }
]
export default function ProfileNavbar() {
    const pathname = usePathname();
    return (
        <div className='flex justify-center text-xs font-medium tracking-wider border-t border-zinc-600 gap-10'>
            {profileRoutes.map((route) => {
                const isActive = route.PATH === pathname;
                return (
                    <Link key={route.PATH} href={route.PATH} className={`flex gap-2 items-center uppercase py-4 ${isActive ? 'border-t-2' : ''}`}>
                        {route.ICON} {route.NAME}
                    </Link>
                )
            })}
        </div>
    )
}
