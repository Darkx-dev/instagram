import ProfileContent from '@/components/ProfileContent';
import ProfileNavbar from '@/components/ProfileNavbar';
import ProfilePosts from '@/components/ProfilePosts';
import prisma from '@/lib/prisma';
import { safeUserSelect } from '@/lib/prismaSelects';
import { notFound } from 'next/navigation';
import React from 'react';;

// Server component to display a user's profile page
export default async function Profile({ params }: { params: Promise<{ username: string }> }) {
  // Extract username from dynamic route parameters
  const username = (await params).username;

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
        posts: {
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
                content: true,
                author: {
                  select: safeUserSelect, // Safe user fields for comment authors
                },
              },
            },
          },
        },
        followers: {
          select: { id: true }, // Minimal data for counting
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

    // Render profile page with user data
    return (
      <div className="container mx-auto">
        {/* Profile header with user details */}
        <ProfileContent
          postsCount={user.posts.length}
          followersCount={user.followers.length}
          followingCount={user.following.length}
          username={user.username}
          fullName={user.fullName ?? ''}
          bio={user.bio ?? ''}
        />
        {/* Navigation bar for profile sections */}
        <ProfileNavbar />
        {/* List of user's posts */}
        <ProfilePosts initialPosts={user.posts.map(post => ({
          ...post,
          comments: post.comments.map(comment => ({
            ...comment,
            updatedAt: comment.createdAt, // Fallback to createdAt if updatedAt is missing
            parentCommentId: '', // Default empty string for parentCommentId
          }))
        }))} />
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
