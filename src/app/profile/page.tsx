/* eslint-disable @next/next/no-img-element */
import { POSTS } from '@/data/dummy';
import React from 'react';

export default function Profile() {
    return (
        <div className='grid grid-cols-3'>
            {POSTS.map((post, index) => (
                <div key={index}>
                    <img src={post.content[0]} alt={post.caption} className="w-full h-full object-cover" />
                </div>
            ))}
        </div>

    )
}
