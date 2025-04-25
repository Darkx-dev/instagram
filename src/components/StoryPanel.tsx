/* eslint-disable @next/next/no-img-element */
import { STORIES } from '@/data/dummy'
import React from 'react'


export default function StoryPanel({ className }: { className?: string }) {
  return (
    <div className={`overflow-x-auto scrollbar-hide ${className ?? 'w-full'}`}>
      <div className="flex gap-[16px] w-full">
        {STORIES.map((story, index: number) => (
          <StoryItem
            key={story.id}
            username={story.username}
            isViewed={story.isViewed}
            profilePic={`https://i.pravatar.cc/150?img=${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function StoryItem({
  profilePic,
  username,
  isViewed = false,
}: {
  profilePic: string;
  username: string;
  isViewed?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-[3px] shrink-0">
      <div
        className={`p-[2px] rounded-full ${isViewed
            ? 'bg-gray-400'
            : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600'
          }`}
      >
        <div className="bg-black p-[2px] rounded-full w-15 h-15">
          <img
            src={profilePic}
            alt={username}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
      <span className="text-xs text-white">
        {username.length > 11 ? `${username.slice(0, 10)}...` : username}
      </span>
    </div>
  );
}
