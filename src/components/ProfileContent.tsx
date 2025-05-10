"use client";
/* eslint-disable @next/next/no-img-element */
import { followUser, unfollowUser } from '@/lib/api';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useState } from 'react';
import EditProfileModal from './EditProfileModal';

interface PageProps {
    userId: string;
    postsCount: number | null;
    followersCount: number | null;
    followingCount: number | null;
    bio: string | null;
    username: string;
    fullName: string;
    avatarUrl?: string;
    isFollowing?: boolean;
    isVerified?: boolean;
    pronouns?: string | null;
}

export default function ProfileContent({
    userId,
    postsCount,
    followersCount,
    followingCount,
    bio,
    avatarUrl = 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/3d_4.png',
    fullName,
    username,
    isFollowing = false,
    isVerified = false,
    pronouns
}: PageProps) {
    const { data: session } = useSession();
    const [following, setFollowing] = useState(isFollowing);
    const [followerCount, setFollowerCount] = useState(followersCount || 0);
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const isCurrentUser = session?.user?.username === username;

    const handleFollowToggle = async () => {
        if (!session?.user) {
            // Redirect to login if not authenticated
            window.location.href = '/login';
            return;
        }

        setLoading(true);
        try {
            if (following) {
                await unfollowUser(username);
                setFollowing(false);
                setFollowerCount(prev => prev - 1);
            } else {
                await followUser(username);
                setFollowing(true);
                setFollowerCount(prev => prev + 1);
            }
        } catch (error) {
            console.error('Error toggling follow status:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex items-center pb-12">
                <div className='mx-24'>
                    <img
                        src={avatarUrl}
                        alt={`${username}'s profile picture`}
                        className="max-w-[150px] max-h-[150px] aspect-square object-cover rounded-full"
                    />
                </div>
                <div>
                    <div className='flex items-center gap-4'>
                        <h3 className='text-xl flex items-center'>
                            {username}
                            {isVerified && (
                                <span className="ml-1 text-blue-500">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#3897f0" />
                                    </svg>
                                </span>
                            )}
                        </h3>
                        {isCurrentUser ? (
                            // <button
                            //     onClick={() => setShowEditModal(true)}
                            //     className='px-3 py-2 bg-zinc-700 rounded-lg tracking-wide text-sm'
                            // >
                            //     Edit profile
                            // </button>
                            <Link
                                href={`/profile/${username}/edit`}
                                className='px-3 py-2 bg-zinc-700 rounded-lg tracking-wide text-sm'
                            >
                                Edit profile
                            </Link>
                        ) : (
                            <button
                                onClick={handleFollowToggle}
                                disabled={loading}
                                className={`px-3 py-2 rounded-lg tracking-wide text-sm ${following
                                        ? 'bg-zinc-700'
                                        : 'bg-blue-500 hover:bg-blue-600'
                                    }`}
                            >
                                {loading ? 'Loading...' : following ? 'Following' : 'Follow'}
                            </button>
                        )}
                    </div>
                    <div className='flex gap-10 my-4'>
                        <p> {postsCount} <span className='text-zinc-400'>posts</span></p>
                        <p> {followerCount} <span className='text-zinc-400'>followers</span></p>
                        <p> {followingCount} <span className='text-zinc-400'>following</span></p>
                    </div>
                    <p className='text-sm font-medium leading-tight'>{fullName}</p>
                    {pronouns && <p className='text-sm text-zinc-400 leading-tight'>{pronouns}</p>}
                    {bio && (
                        <p className='text-sm leading-tight mt-2'>
                            {bio}
                        </p>
                    )}
                </div>
            </div>

            {showEditModal && (
                <EditProfileModal
                    onClose={() => setShowEditModal(false)}
                    user={{
                        fullName,
                        bio: bio || '',
                        avatarUrl,
                        pronouns: pronouns || '',
                        username
                    }}
                />
            )}
        </>
    );
}
