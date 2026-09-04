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
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('javaascent_theme');if(t==='light'){document.documentElement.classList.remove('dark');document.documentElement.classList.add('light');}else{document.documentElement.classList.add('dark');document.documentElement.classList.remove('light');}}catch(e){document.documentElement.classList.add('dark');}})();`
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans transition-colors duration-200">
        <PlatformProvider>
          {children}
        </PlatformProvider>
      </body>
    </html>

  );
}
