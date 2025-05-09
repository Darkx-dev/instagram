/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import React from 'react'

interface PageProps {
    postsCount: number | null,
    followersCount: number | null,
    followingCount: number | null,
    bio: string | null,
    username: string,
    fullName: string | null,
    avatarUrl: string
}

export default async function ProfileContent({ postsCount, followersCount, followingCount, bio, avatarUrl, fullName, username }: PageProps) {

    return (
        <div className="flex items-center pb-12">
            <div className='mx-24'>
                <img src={avatarUrl} alt="" className="max-w-[150px] max-h-[150px] aspect-square object-cover rounded-full" />
            </div>
            <div>
                <div className='flex items-center gap-4'>
                    <h3 className='text-xl '>{username}</h3>
                    <Link href='#' className='px-3 py-2 bg-zinc-700 rounded-lg tracking-wide text-sm'>Edit profile</Link>
                </div>
                <div className='flex gap-10 my-4'>
                    <p> {postsCount} <span className='text-zinc-400'>posts</span></p>
                    <p> {followersCount} <span className='text-zinc-400'>followers</span></p>
                    <p> {followingCount} <span className='text-zinc-400'>following</span></p>
                </div>
                <p className='text-sm leading-tight'>{fullName}</p>
                <p className='text-sm leading-tight'>
                    {bio}
                </p>
            </div>
        </div>
    )
}
