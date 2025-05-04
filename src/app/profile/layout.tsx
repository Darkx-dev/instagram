import ProfileContent from '@/components/ProfileContent'
import React from 'react'

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='p-5 max-w-5xl mx-auto'>
            <ProfileContent />
            {children}
        </div>
    )
}
