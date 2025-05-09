"use client"
import React, { useState } from 'react';
import Instagram from './Instagram';
import { ROUTES } from '@/data/constants';
import { InstagramIcon } from 'lucide-react';
import { NavItem } from './NavItem';
import CreatePostModal from './CreatePostModal';
import { useSession } from 'next-auth/react';

export default function Navbar() {
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const { data: session } = useSession();
  return (
    <div className="border-r dark:border-zinc-700 xl:min-w-[245px] max-md:min-w-full md:h-screen md:py-10">
      <div className="logo px-6 max-md:hidden">
        <div className="max-xl:hidden">
          <Instagram />
        </div>
        <InstagramIcon className="xl:hidden" size={26} />
      </div>
      <div>
        <div className="max-md:hidden mt-9 px-3 space-y-2">
          <NavItem route={ROUTES.HOME} />
          <NavItem route={ROUTES.SEARCH} />
          <NavItem route={ROUTES.EXPLORE} />
          <NavItem route={ROUTES.REELS} />
          <NavItem route={ROUTES.INBOX} />
          <NavItem route={ROUTES.NOTIFICATION} />
          <NavItem route={ROUTES.CREATE} onClick={() => setShowCreatePostModal(true)} />
          <NavItem route={ROUTES.PROFILE} />
        </div>
        <div className="md:hidden flex w-full justify-between px-5 py-2">
          <NavItem route={ROUTES.HOME} />
          <NavItem route={ROUTES.EXPLORE} />
          <NavItem route={ROUTES.REELS} />
          <NavItem route={ROUTES.CREATE} />
          <NavItem route={ROUTES.PROFILE} />
        </div>
      </div>
      <div id='createPostModal'>
        {showCreatePostModal && session?.user.username && <CreatePostModal username={session?.user.username} onClose={() => setShowCreatePostModal(false)} />}
      </div>
    </div>
  );
}