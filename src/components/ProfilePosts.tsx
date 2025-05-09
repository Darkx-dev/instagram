"use client"
/* eslint-disable @next/next/no-img-element */
import { Comment, Like, Post, PostImage } from '@/generated/prisma';
import { HeartIcon, MessageCircle } from 'lucide-react';
import React, { useState } from 'react';
import PreviewPostModal from './PreviewPostModal';

interface ExtendedPost extends Post {
  images: PostImage[];
  likes: Like[];
  comments: Comment[]
}

interface ProfilePostsProps {
  initialPosts: ExtendedPost[];
}

function ProfilePosts({ initialPosts }: ProfilePostsProps) {
  const [showFullPostModal, setShowFullPostModal] = useState(false);
  return (
    <div className="grid grid-cols-3 gap-1 mt-1">
      {initialPosts.map((post, index) => (
        <div key={index} className='relative group cursor-pointer' onClick={() => setShowFullPostModal(true)}>
          <img
            src={post.images[0]?.imageUrl ?? ""}
            alt={post.caption ?? ""}
            className="w-full h-full aspect-square object-center object-cover"
          />
          <div className='absolute bg-black/50 w-full h-full top-0 left-0 hidden group-hover:flex justify-center items-center gap-5'>
            <div className='flex gap-2'>
              <HeartIcon fill='#ffffff' />
              <span className='font-medium'>{post.likes.length}</span>
            </div>
            <div className='flex gap-2'>
              <MessageCircle fill='#ffffff' />
              <span className='font-medium'>{post.comments.length}</span>
            </div>
          </div>
        </div>
      ))}
      {showFullPostModal && <PreviewPostModal onClose={() => setShowFullPostModal(false)} />}
    </div>
  );
}

export default ProfilePosts;
