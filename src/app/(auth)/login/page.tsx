import LoginForm from '@/components/LoginForm';
import { authOptions } from '@/configs/next-auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react'

async function Login() {
  const session = await getServerSession(authOptions);

  if (session) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <LoginForm />
    </div>
  );
}

export default Login