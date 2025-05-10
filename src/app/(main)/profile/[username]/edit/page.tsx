import EditProfileForm from '@/components/EditProfileForm';
import { authOptions } from '@/configs/next-auth';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function EditProfilePage({
  params
}: {
  params: { username: string }
}) {
  // Get the current user session
  const session = await getServerSession(authOptions);

  // If not logged in, redirect to login
  if (!session?.user?.id) {
    redirect('/login');
  }

  const { username } = params;

  // Check if the user is trying to edit their own profile
  if (session.user.username !== username) {
    // Redirect to their own profile edit page
    redirect(`/profile/${session.user.username}/edit`);
  }

  // Fetch user data from database
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
    },
  });

  // If user not found, redirect to 404
  if (!user) {
    redirect('/404');
  }

  return <EditProfileForm user={user} />;
}