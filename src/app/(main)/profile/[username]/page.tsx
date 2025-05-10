import ProfileContent from '@/components/ProfileContent';
import ProfileNavbar from '@/components/ProfileNavbar';
import ProfilePosts from '@/components/ProfilePosts';
import SavedPosts from '@/components/SavedPosts';
import { authOptions } from '@/configs/next-auth';
import prisma from '@/lib/prisma';
import { safeUserSelect } from '@/lib/prismaSelects';
import { ExtendedPost } from '@/components/ProfilePosts';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import React from 'react';

// Server component to display a user's profile page
export default async function Profile({
  params,
  searchParams
}: {
  params: { username: string },
  searchParams: { tab?: string }
}) {

  // Extract username from dynamic route parameters
  const { username } = params;
  const { tab } = searchParams;

  // Get current user session
  const session = await getServerSession(authOptions);
  const isCurrentUser = session?.user?.username === username;

  try {
    // Fetch user data with related posts, followers, and following
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        fullName: true,
        bio: true,
        avatarUrl: true,
        pronouns: true,
        isVerified: true,
        accountType: true,
        posts: {
          where: {
            isArchived: false, // Only show non-archived posts
          },
          skip: 0,
          take: 20, // Limit to 20 posts for initial load
          orderBy: { createdAt: 'desc' }, // Sort posts by creation date (newest first)
          select: {
            id: true,
            caption: true,
            postType: true,
            createdAt: true,
            images: {
              select: {
                id: true,
                imageUrl: true,
                order: true,
              },
              orderBy: { order: 'asc' }, // Ensure images are in correct order
            },
            likes: {
              select: {
                id: true,
                userId: true,
              },
            },
            comments: {
              select: {
                id: true,
                createdAt: true,
                updatedAt: true,
                content: true,
                parentCommentId: true,
                author: {
                  select: safeUserSelect, // Safe user fields for comment authors
                },
              },
            },
          },
        },
        followers: {
          select: { id: true, followerId: true }, // Include followerId for checking if current user follows
        },
        following: {
          select: { id: true }, // Minimal data for counting
        },
      },
    });

    // Handle user not found
    if (!user) {
      notFound(); // Use Next.js notFound() for 404 page
    }

    // Check if current user is following this profile
    let isFollowing = false;
    if (session?.user?.id) {
      isFollowing = user.followers.some(follow => follow.followerId === session.user?.id);
    }

    // Fetch saved posts if viewing own profile
    let savedPosts: ExtendedPost[] = [];
    if (isCurrentUser && session?.user?.id && tab === 'saved') {
      const savedPostsData = await prisma.savedPost.findMany({
        where: { userId: session.user.id },
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: {
          post: {
            include: {
              author: {
                select: safeUserSelect,
              },
              images: {
                orderBy: { order: 'asc' },
              },
              likes: {
                select: {
                  id: true,
                  userId: true,
                },
              },
              comments: {
                select: {
                  id: true,
                  createdAt: true,
                  updatedAt: true,
                  content: true,
                  parentCommentId: true,
                  author: {
                    select: safeUserSelect,
                  },
                },
              },
            },
          },
        },
      });

      savedPosts = savedPostsData.map(savedPost => ({
        ...savedPost.post,
        savedAt: savedPost.createdAt,
        isSaved: true,
        // Ensure comments match the expected format
        comments: savedPost.post.comments.map(comment => ({
          ...comment,
          parentCommentId: comment.parentCommentId || '', // Convert null to empty string
          author: {
            id: comment.author.id,
            username: comment.author.username,
            avatarUrl: comment.author.avatarUrl,
          }
        }))
      }));
    }

    // Check if posts are liked by current user and format for component
    const postsWithLikeStatus: ExtendedPost[] = user.posts.map(post => ({
      ...post,
      isLiked: session?.user?.id
        ? post.likes.some(like => like.userId === session.user?.id)
        : false,
      // Ensure comments match the expected format
      comments: post.comments.map(comment => ({
        ...comment,
        parentCommentId: comment.parentCommentId || '', // Convert null to empty string
        author: {
          id: comment.author.id,
          username: comment.author.username,
          avatarUrl: comment.author.avatarUrl,
        }
      }))
    }));

    // Render profile page with user data
    return (
      <div className="container mx-auto">
        {/* Profile header with user details */}
        <ProfileContent
          userId={user.id}
          postsCount={user.posts.length}
          followersCount={user.followers.length}
          followingCount={user.following.length}
          username={user.username}
          fullName={user.fullName ?? ''}
          bio={user.bio}
          avatarUrl={user.avatarUrl ?? undefined}
          isFollowing={isFollowing}
          isVerified={user.isVerified ?? false}
          pronouns={user.pronouns}
        />

        {/* Navigation bar for profile sections */}
        <ProfileNavbar isCurrentUser={isCurrentUser} />

        {/* List of user's posts or saved posts based on URL */}
        {isCurrentUser && tab === 'saved' ? (
          <SavedPosts initialPosts={savedPosts} />
        ) : (
          <ProfilePosts
            initialPosts={postsWithLikeStatus}
            username={username}
          />
        )}
      </div>
    );
  } catch (error) {
    // Log error for debugging
    console.error('Error fetching profile:', error);

    // Return error UI
    return (
      <div className="container mx-auto text-center py-8">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p>Failed to load profile. Please try again later.</p>
      </div>
    );
  }
}
