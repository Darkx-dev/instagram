/* eslint-disable @next/next/no-img-element */
import { POSTS } from '@/data/dummy';
import React from 'react';

export default function Profile() {
    return (
        <div className='grid grid-cols-3 gap-1 mt-1'>
            {POSTS.map((post, index) => (
                <div key={index}>
                    <img src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwnSX2uZl5tI5iYk6jcWMRdz1BECFmmcBUEA&s'} alt={post.caption} className="w-full h-full aspect-square object-center object-cover blur-xs" />
                </div>
            ))}
        </div>

    )
}
