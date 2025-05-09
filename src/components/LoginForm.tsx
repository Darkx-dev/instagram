"use client";
import Instagram from "@/components/Instagram";
import Link from "next/link";
import React, { useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const [userdata, setUserdata] = useState({
        userOrEmail: "admin",
        password: "admin",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {

            let result = null;
            if (userdata.userOrEmail.match(RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"))) {
                result = await signIn("credentials", {
                    redirect: false,
                    email: userdata.userOrEmail,
                    password: userdata.password,
                });
            } else {
                result = await signIn("credentials", {
                    redirect: false,
                    username: userdata.userOrEmail,
                    password: userdata.password,
                });
            }

            if (result?.error) {
                setError(result.error);
                setLoading(false);
                return;
            }

            const session = await getSession();

            router.push(`/profile/${session?.user.username}`);
        } catch (err) {
            console.error(err);
            setError("An unexpected error occurred. Please try again.");
            setLoading(false);
        }
    };

    return (
        <>
            <div className="mb-10">
                <Instagram className="scale-[1.8]" />
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <input
                    type="text"
                    placeholder="Username or email"
                    className="placeholder:text-xs outline-0 border px-3 py-2 rounded-md w-[250px]"
                    value={userdata.userOrEmail}
                    onChange={(e) => setUserdata({ ...userdata, userOrEmail: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="placeholder:text-xs outline-0 border px-3 py-2 rounded-md w-[250px]"
                    value={userdata.password}
                    onChange={(e) => setUserdata({ ...userdata, password: e.target.value })}
                    required
                />
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-3 py-1 rounded-md w-[250px] font-medium disabled:opacity-50"
                    disabled={!userdata.userOrEmail || !userdata.password || loading}
                >
                    {loading ? "Logging in..." : "Log in"}
                </button>
            </form>
            <p className="text-sm mt-10">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-blue-500 font-medium">
                    Sign up
                </Link>
            </p>
        </>
    );
}