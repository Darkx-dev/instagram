/* eslint-disable @next/next/no-img-element */
import React from 'react'

export default function ProfileContent() {
    return (
        <div className="flex justify-center items-center">
            <div className='mr-20'>
                <img src="https://i.pravatar.cc/150?img=52" alt="" className="max-w-[150px] max-h-[150px] object-cover rounded-full" />
            </div>
            <div>
                <h3 className='text-xl '>darkx.doe.23</h3>
                <div className='flex gap-10 my-4'>
                    <p> 2 <span className='text-zinc-400'>posts</span></p>
                    <p> 66 <span className='text-zinc-400'>followers</span></p>
                    <p> 285 <span className='text-zinc-400'>following</span></p>
                </div>
                <p className='text-sm leading-tight'>52 6F 73 68 61 6E</p>
                <p className='text-sm leading-tight'>
                    राधे राधे <br />
                    darkx.dev.23@gmail.com
                </p>
            </div>
        </div>
    )
}
