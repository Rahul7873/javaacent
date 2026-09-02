import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { PlatformProvider } from '@/context/PlatformContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'JavaAscent — Dedicated Java 17 Coding & AI Learning Platform',
  description: 'Master Java 17 algorithms and the Collections Framework with native javac sandboxed compilation, Monaco editor, and a 6-level Socratic AI tutor.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#070a13] text-slate-100 font-sans">
        <PlatformProvider>
          {children}
        </PlatformProvider>
      </body>
    </html>
  );
}
