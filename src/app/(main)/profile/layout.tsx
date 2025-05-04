import ProfileContent from '@/components/ProfileContent'
import ProfileNavbar from '@/components/ProfileNavbar'
import React from 'react'

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='px-5 pt-8 max-w-[990px] mx-auto'>
            <ProfileContent />
            <ProfileNavbar />
            {children}
        </div>
    )
}

