"use client"
import Instagram from '@/components/Instagram';
import Link from 'next/link';
import React, { useState } from 'react';

export default function Login() {
  const [userdata, setUserdata] = useState({
    userOrEmail: '',
    password: '',
  });
  // const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Login attempt with username: ${userdata.userOrEmail}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className='mb-10'>
        <Instagram className='scale-[1.8]' />
      </div>
      <form action="#" method="post" className='flex flex-col gap-2'>
        <input type='text' placeholder='Username or email' className='placeholder:text-xs outline-0 border px-3 py-2 rounded-md w-[250px]' value={userdata.userOrEmail} onChange={(e) => setUserdata({ ...userdata, userOrEmail: e.target.value })} />
        <input type='password' placeholder='Password' className='placeholder:text-xs outline-0 border px-3 py-2 rounded-md w-[250px]' value={userdata.password} onChange={(e) => setUserdata({ ...userdata, password: e.target.value })} />
        <button className='bg-blue-500 text-white px-3 py-1 rounded-md w-[250px] font-medium disabled:opacity-50' onClick={handleSubmit} disabled={!userdata.userOrEmail || !userdata.password}>Log in</button>
      </form>
      <p className='text-sm mt-10'>Don&apos;t have an account? <Link href="/signup" className='text-blue-500 font-medium'>Sign up</Link></p>
    </div>
  );
}