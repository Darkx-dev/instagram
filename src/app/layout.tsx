import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientSessionProvider from "@/components/ClientSessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Instagram Clone",
  description: "Instagram clone built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} max-md:flex-col-reverse flex h-screen max-h-screen overflow-hidden dark:text-white dark:bg-black`}
      >
        <ClientSessionProvider>
          {children}
        </ClientSessionProvider>
      </body>
    </html>
  );
}