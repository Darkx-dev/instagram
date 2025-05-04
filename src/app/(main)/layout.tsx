import Navbar from '@/components/Navbar'
import React from 'react'

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* Sidebar/navbar */}
            <Navbar />

            {/* Main content area */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
                {children}
            </main>
        </>
    )
}
