import React from 'react'

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='px-5 pt-8 max-w-[990px] mx-auto'>
            {children}
        </div>
    )
}

