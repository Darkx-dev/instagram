/* eslint-disable @next/next/no-img-element */
import { authOptions } from '@/configs/next-auth';
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import React from 'react'

export default async function ProfileContent() {
    const session = await getServerSession(authOptions);
    console.log("ProfileContent: session =", session);
    return (
        <div className="flex items-center pb-12">
            <div className='mx-24'>
                <img src="https://i.pravatar.cc/150?img=52" alt="" className="max-w-[150px] max-h-[150px] object-cover rounded-full" />
            </div>
            <div>
                <div className='flex items-center gap-4'>
                    <h3 className='text-xl '>{session?.user.username}</h3>
                    <Link href='#' className='px-3 py-2 bg-zinc-700 rounded-lg tracking-wide text-sm'>Edit profile</Link>
                </div>
                <div className='flex gap-10 my-4'>
                    <p> 2 <span className='text-zinc-400'>posts</span></p>
                    <p> 66 <span className='text-zinc-400'>followers</span></p>
                    <p> 285 <span className='text-zinc-400'>following</span></p>
                </div>
                <p className='text-sm leading-tight'>52 6F 73 68 61 6E</p>
                <p className='text-sm leading-tight'>
                    राधे राधे <br />
                    darkx.dev.23@gmail.com
                </p>
            </div>
        </div>
    )
}
