"use client"
import Instagram from '@/components/Instagram';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function Signup() {
    const [userdata, setUserdata] = useState({
        email: '',
        password: '',
        fullName: '',
        username: ''
    });
    // const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/signup', userdata);
            console.log(response);
            // Redirect to the homepage ("/") on successful signup
            router.push('/');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className='w-full flex justify-center items-center'>
            <div className="flex flex-col items-center justify-center h-fit w-[310px] border pt-12 pb-5">
                <div className='mb-10'>
                    <Instagram className='scale-[1.8]' />
                </div>
                <form action="#" method="post" className='flex flex-col gap-2'>
                    <input type='text' placeholder='Email' className='placeholder:text-xs outline-0 border px-3 py-2 rounded-md w-[250px]' value={userdata.email} onChange={(e) => setUserdata({ ...userdata, email: e.target.value })} />
                    <input type='password' placeholder='Password' className='placeholder:text-xs outline-0 border px-3 py-2 rounded-md w-[250px]' value={userdata.password} onChange={(e) => setUserdata({ ...userdata, password: e.target.value })} />
                    <input type='text' placeholder='Full Name' className='placeholder:text-xs outline-0 border px-3 py-2 rounded-md w-[250px]' value={userdata.fullName} onChange={(e) => setUserdata({ ...userdata, fullName: e.target.value })} />
                    <input type='text' placeholder='Username' className='placeholder:text-xs outline-0 border px-3 py-2 rounded-md w-[250px]' value={userdata.username} onChange={(e) => setUserdata({ ...userdata, username: e.target.value })} />
                    <button className='bg-blue-500 text-white px-3 py-1 rounded-md w-[250px] font-medium disabled:opacity-50' disabled={!userdata.username || !userdata.password || !userdata.email || !userdata.fullName} onClick={handleSubmit}>Sign up</button>
                </form>
                <p className='text-xs text-zinc-500 px-8 text-center mt-5'>This is not a real Instagram and doesn&apos;t actually do anything except for looking good.</p>
                <p className='text-sm mt-5'>Have an account? <Link href="/login" className='text-blue-500 font-medium'>Login</Link></p>
            </div>
        </div>
    );
}