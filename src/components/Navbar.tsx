'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Code2, 
  Flame, 
  CheckCircle2, 
  LayoutDashboard, 
  BookOpen, 
  History, 
  ShieldCheck, 
  Sun, 
  Moon, 
  Sparkles,
  GraduationCap,
  LogIn,
  UserPlus,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';

export function Navbar() {
  const pathname = usePathname();
  const { user, userProgress, logout, theme, toggleTheme } = usePlatform();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Problems', href: '/problems', icon: BookOpen },
    { name: 'Basic Practice', href: '/basic-practice', icon: GraduationCap },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Submissions', href: '/submissions', icon: History },
    { name: 'Admin', href: '/admin', icon: ShieldCheck }
  ];

  const solvedCount = userProgress?.solvedProblemIds?.length ?? 0;
  const streakCount = userProgress?.currentStreak ?? 0;

  const initials = user
    ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || 'U'
    : 'GL';

  const displayName = user
    ? `${user.firstName} ${user.lastName}`
    : 'Guest Learner';

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-indigo-600 p-0.5 shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-lg">
                ☕
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg tracking-tight text-white font-mono">
                  Java<span className="text-amber-400">Ascent</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
                  JAVA 17 LTS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wide">Java DSA & AI Learning Platform</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Widgets */}
        <div className="flex items-center space-x-3">
          {/* Daily Challenge Pill */}
          <Link
            href="/problems/two-sum-target"
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium hover:border-amber-500/60 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Daily Challenge</span>
          </Link>

          {/* Streak Counter */}
          <div 
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-orange-950/40 border border-orange-500/30 text-orange-400 text-xs font-semibold"
            title={`Current Streak: ${streakCount} days | Longest: ${userProgress?.longestStreak ?? 0} days`}
          >
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-bounce" />
            <span>{streakCount} d</span>
          </div>

          {/* Solved Count */}
          <div 
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-semibold"
            title={`Solved ${solvedCount} problems`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{solvedCount} solved</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-lg transition-colors border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-amber-500 dark:hover:text-amber-400"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>


          {/* User Auth Section */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 pl-2.5 pr-2 py-1 rounded-full border border-slate-700 bg-slate-800/80 hover:border-indigo-500/50 transition-colors"
              >
                <span className="text-xs font-medium text-slate-200 hidden lg:inline max-w-[120px] truncate">
                  {displayName}
                </span>
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow">
                  {initials}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0d1220] border border-slate-800 shadow-2xl py-2 z-50 divide-y divide-slate-800/80">
                  <div className="px-4 py-2.5">
                    <p className="text-xs font-semibold text-white truncate">{displayName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <div className="mt-2 flex items-center space-x-2 text-[10px] font-mono text-emerald-400">
                      <span>✓ {solvedCount} Solved</span>
                      <span>•</span>
                      <span className="text-orange-400">🔥 {streakCount}d Streak</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-indigo-400" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                      <span>Progress Dashboard</span>
                    </Link>
                    <Link
                      href="/submissions"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                    >
                      <History className="w-4 h-4 text-indigo-400" />
                      <span>My Submissions</span>
                    </Link>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/auth/login"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/auth/signup"
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 shadow-md shadow-orange-500/20 transition-all"
              >
                <UserPlus className="w-3.5 h-3.5 text-slate-950" />
                <span>Create Account</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-800 ml-1"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#090d16] px-4 py-3 space-y-1.5 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{link.name}</span>
                {link.name === 'Basic Practice' && (
                  <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-400 font-mono">
                    249 Ex
                  </span>
                )}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-3.5 py-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Appearance</span>
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </header>

  );
}
