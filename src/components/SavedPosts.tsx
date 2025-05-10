"use client";
/* eslint-disable @next/next/no-img-element */
import { fetchSavedPosts, unsavePost } from '@/lib/api';
import { BookmarkIcon, HeartIcon, Loader2, MessageCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import PreviewPostModal from './PreviewPostModal';
import { ExtendedPost } from './ProfilePosts';

interface SavedPostsProps {
  initialPosts: ExtendedPost[];
}

function SavedPosts({ initialPosts }: SavedPostsProps) {
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
      const response = await fetchSavedPosts(nextPage);
      
      if (response.posts.length > 0) {
        setPosts(prevPosts => [...prevPosts, ...response.posts]);
        setPage(nextPage);
        setHasMore(response.pagination.hasNext);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more saved posts:', error);
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, page]);
  
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
  
  // Handle unsave post
  const handleUnsave = async (postId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent opening the post modal
    
    if (!session?.user) {
      window.location.href = '/login';
      return;
    }
    
    try {
      // Optimistically update UI
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      
      // Make API call
      await unsavePost(postId);
    } catch (error) {
      console.error('Error unsaving post:', error);
      // Revert optimistic update on error by refetching
      const response = await fetchSavedPosts(1);
      setPosts(response.posts);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 mt-1">
        {posts.length === 0 ? (
          <div className="col-span-3 py-20 text-center text-zinc-500">
            <p className="text-lg">No saved posts yet</p>
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
                <div className="flex gap-2 text-white">
                  <HeartIcon fill="#ffffff" />
                  <span className="font-medium">{post.likes.length}</span>
                </div>
                <div className="flex gap-2 text-white">
                  <MessageCircle fill="#ffffff" />
                  <span className="font-medium">{post.comments.length}</span>
                </div>
                <div 
                  className="flex gap-2 text-white"
                  onClick={(e) => handleUnsave(post.id, e)}
                >
                  <BookmarkIcon fill="#ffffff" />
                  <span className="font-medium">Unsave</span>
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

export default SavedPosts;
