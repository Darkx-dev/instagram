/* eslint-disable @next/next/no-img-element */
import { formatSQLiteCreatedAt } from '@/lib/parser';
import { HeartIcon } from 'lucide-react'
import React from 'react'

interface CommentProps {
    avatarUrl: string;
    username: string;
    content: string;
    likes?: number;
    isLiked?: boolean;
    createdAt: Date;
}

function Comment({ avatarUrl, username, content, likes = 0, isLiked = false, createdAt }: CommentProps) {
    return (
        <div className='flex gap-3 mb-5'>
            <img src={avatarUrl} alt={username} className='rounded-full size-8' />
            <div className='w-full'>

                <div className='w-full flex items-center text-sm'>
                    <p> <span className='font-medium text-sm'>{username}</span> {content}</p>
                    <HeartIcon size={15} fill={isLiked ? '#ffffff' : 'transparent'} className='ml-auto my-auto min-w-[15px]' />
                </div>

                <div className='text-zinc-500 text-xs flex items-center gap-2 mt-1'>
                    <span>{formatSQLiteCreatedAt(createdAt)}</span>
                    <span className="text-nowrap">{likes} likes</span>
                    <span>Reply</span>
                </div>

            </div>
        </div>
    )
}

export default Comment