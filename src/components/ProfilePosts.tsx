"use client";
/* eslint-disable @next/next/no-img-element */
import { fetchUserPosts, likePost, unlikePost } from '@/lib/api';
import { HeartIcon, Loader2, MessageCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import PreviewPostModal from './PreviewPostModal';

// Define types aligned with Prisma schema and server component
export type ExtendedPost = {
  id: string;
  caption: string | null;
  postType: string;
  createdAt: Date;
  images: { id: string; imageUrl: string; order: number }[];
  likes: { id: string; userId: string }[];
  comments: {
    id: string;
    content: string;
    createdAt: Date,
    updatedAt: Date,
    parentCommentId: string;
    author: {
      id: string;
      username: string;
      avatarUrl: string | null
    }
  }[];
  isLiked?: boolean;
  isSaved?: boolean;
};

interface ProfilePostsProps {
  initialPosts: ExtendedPost[];
  username: string;
}

// Component to display a grid of user posts with images, likes, and comments
function ProfilePosts({ initialPosts, username }: ProfilePostsProps) {
  // Get the authenticated session
  const { data: session } = useSession();

  // State for posts and pagination
  const [posts, setPosts] = useState<ExtendedPost[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialPosts.length >= 20);
  const [loading, setLoading] = useState(false);

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

  // Handle loading more posts
  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const response = await fetchUserPosts(username, nextPage);

      if (response.posts.length > 0) {
        setPosts(prevPosts => [...prevPosts, ...response.posts]);
        setPage(nextPage);
        setHasMore(response.pagination.hasNext);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, page, username]);

  // Handle scroll to load more posts
  useEffect(() => {
    const handleScroll = () => {
      // Check if user has scrolled to the bottom of the page
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 300 &&
        hasMore &&
        !loading
      ) {
        loadMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, loadMorePosts]);

  // Handle like/unlike post
  const handleLikeToggle = async (postId: string, isLiked: boolean, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent opening the post modal

    if (!session?.user) {
      window.location.href = '/login';
      return;
    }

    try {
      // Optimistically update UI
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.id === postId) {
            const updatedLikes = isLiked
              ? post.likes.filter(like => like.userId !== session.user?.id)
              : [...post.likes, { id: 'temp', userId: session.user?.id as string }];

            return {
              ...post,
              likes: updatedLikes,
              isLiked: !isLiked
            };
          }
          return post;
        })
      );

      // Make API call
      if (isLiked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update on error
      // This would require refetching the post data
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 mt-1">
        {posts.length === 0 ? (
          <div className="col-span-3 py-20 text-center text-zinc-500">
            <p className="text-lg">No posts yet</p>
          </div>
        ) : (
          posts.map((post, index) => (
            <div
              key={post.id}
              className="relative group cursor-pointer aspect-square"
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
                <div
                  className="flex gap-2 text-white"
                  onClick={(e) => handleLikeToggle(post.id, !!post.isLiked, e)}
                >
                  <HeartIcon fill={post.isLiked ? "#ffffff" : "transparent"} stroke={post.isLiked ? "transparent" : "#ffffff"} />
                  <span className="font-medium">{post.likes.length}</span>
                </div>
                <div className="flex gap-2 text-white">
                  <MessageCircle fill="#ffffff" />
                  <span className="font-medium">{post.comments.length}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load more button */}
      {hasMore && (
        <div className="flex justify-center mt-8 mb-4">
          <button
            onClick={loadMorePosts}
            disabled={loading}
            className="px-4 py-2 bg-zinc-800 rounded-md text-white flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}

      {/* Loading indicator at bottom */}
      {loading && !hasMore && (
        <div className="flex justify-center my-4">
          <Loader2 size={24} className="animate-spin text-zinc-400" />
        </div>
      )}

      {/* Render modal for selected post */}
      {showFullPostModal && session?.user?.username && selectedPostIndex !== null && (
        <PreviewPostModal
          onClose={handleModalClose}
          post={posts[selectedPostIndex]}
          username={session.user.username}
        />
      )}
    </>
  );
}

export default ProfilePosts;