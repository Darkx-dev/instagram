"use client";
/* eslint-disable @next/next/no-img-element */
import { HeartIcon, MessageCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import PreviewPostModal from './PreviewPostModal';

// Define types aligned with Prisma schema and server component
export type ExtendedPost = {
  id: string;
  caption: string | null;
  postType: string;
  createdAt: Date;
  images: { id: string; imageUrl: string; order: number }[];
  likes: { id: string; userId: string }[];
  comments: { id: string; content: string; createdAt: Date, updatedAt: Date, parentCommentId: string; author: { id: string; username: string; avatarUrl: string | null } }[];
};

interface ProfilePostsProps {
  initialPosts: ExtendedPost[];
}

// Component to display a grid of user posts with images, likes, and comments
function ProfilePosts({ initialPosts }: ProfilePostsProps) {
  // Get the authenticated session
  const { data: session } = useSession();

  // State for controlling the post preview modal
  const [selectedPostIndex, setSelectedPostIndex] = useState<number | null>(null);
  const [showFullPostModal, setShowFullPostModal] = useState(false);

  // Handle post click to open modal
  const handlePostClick = (index: number) => {
    setSelectedPostIndex(index);
    setShowFullPostModal(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowFullPostModal(false);
    setSelectedPostIndex(null);
  };

  return (
    <div className="grid grid-cols-3 gap-1 mt-1">
      {initialPosts.map((post, index) => (
        <div
          key={post.id} // Use post.id for unique key
          className="relative group cursor-pointer"
          onClick={() => handlePostClick(index)}
        >
          {/* Display first image or fallback */}
          {post.images[0]?.imageUrl ? (
            <img
              src={post.images[0].imageUrl}
              alt={post.caption ?? 'Post image'}
              className="w-full h-full aspect-square object-center object-cover"
            />
          ) : (
            <div className="w-full h-full aspect-square bg-gray-200 flex items-center justify-center">
              No Image
            </div>
          )}
          {/* Overlay with likes and comments count on hover */}
          <div className="absolute bg-black/50 w-full h-full top-0 left-0 hidden group-hover:flex justify-center items-center gap-5">
            <div className="flex gap-2 text-white">
              <HeartIcon fill="#ffffff" />
              <span className="font-medium">{post.likes.length}</span>
            </div>
            <div className="flex gap-2 text-white">
              <MessageCircle fill="#ffffff" />
              <span className="font-medium">{post.comments.length}</span>
            </div>
          </div>
        </div>
      ))}
      {/* Render modal for selected post */}
      {showFullPostModal && session?.user?.username && selectedPostIndex !== null && (
        <PreviewPostModal
          onClose={handleModalClose}
          post={initialPosts[selectedPostIndex]}
          username={session.user.username}
        />
      )}
    </div>
  );
}

export default ProfilePosts;