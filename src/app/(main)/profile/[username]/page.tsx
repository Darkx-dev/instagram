import ProfileContent from '@/components/ProfileContent';
import ProfileNavbar from '@/components/ProfileNavbar';
import ProfilePosts from '@/components/ProfilePosts';
import prisma from '@/lib/prisma';
import React from 'react';

export default async function Profile({ params }: { params: Promise<{ username: string }> }) {
    const username = (await params).username;
    const user = await prisma.user.findUnique({
        where: { username },
        include: {
            posts: {
                skip: 0,
                take: 20,
                include: {
                    images: true,
                    likes: true,
                    comments: true
                }
            },
            followers: true, following: true
        }
    })
    console.log(user)
    return (
        <>
            <ProfileContent postsCount={user?.posts.length ?? 0} followersCount={user?.followers.length ?? 0} followingCount={user?.following.length ?? 0} username={username} fullName={user?.fullName ?? ""} bio={user?.bio ?? ""} />
            <ProfileNavbar />
            <ProfilePosts initialPosts={user?.posts ?? []} />
        </>

    )
}
