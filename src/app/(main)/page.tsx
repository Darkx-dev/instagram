/* eslint-disable @next/next/no-img-element */
import Post from '@/components/Post';
import StoryPanel from '@/components/StoryPanel';
import { POSTS } from '@/data/dummy';
import React from 'react';

const Home = () => {

  return (
    <div className="flex justify-center overflow-x-hidden">
      <div className="flex w-full lg:max-w-[63.2rem] max-lg:max-w-[650px] py-6 px-2">
        <main className="flex-1 overflow-hidden lg:mr-12">
          <div className="mb-6 overflow-hidden">
            <StoryPanel />
          </div>

          <div className="overflow-hidden">
            {POSTS.map((post, index) => (
              <Post key={index} {...post} />
            ))}
          </div>
        </main>

        <aside className="w-80 max-lg:hidden pl-6 pt-4 lg:pr-2">
            <div className='flex text-sm items-center w-full'>
              <img src="https://i.pravatar.cc/150?img=52" alt="" className="w-11 h-11 object-cover rounded-full"/>
              <div className='ml-3 leading-tight'>
                <span className='font-medium'>darkx.dev</span>
                <p className='text-gray-400'>52 6F 73 68 61 6E</p>
              </div>
              <a className='text-blue-400 ml-auto text-xs font-medium' href="#">Switch</a>
            </div>
        </aside>
      </div>
    </div>
  );
};

export default Home;