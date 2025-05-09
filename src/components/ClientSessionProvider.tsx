"use client"
import { SessionProvider } from 'next-auth/react'
import React from 'react'

function ClientSessionProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}

export default ClientSessionProvider