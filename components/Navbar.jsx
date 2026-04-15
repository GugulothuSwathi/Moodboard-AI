
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useTheme } from './ThemeProvider';
import {
  Sun, Moon, Sparkles, LayoutDashboard, LogIn, LogOut,
  Menu, X, User, ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { data: session } = useSession()
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const avatarSrc  = session?.user?.profileImage || session?.user?.image || null;
  const displayName = session?.user?.name || '';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${scrolled
          ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-sm border-b border-gray-100/80 dark:border-gray-800/80'
          : 'bg-transparent'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:shadow-brand-500/50 transition-shadow">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-display text-xl font-semibold">
              Mood<span className="gradient-text">Board</span>
            </span>
          </Link>

          {}
          <div className="hidden md:flex items-center gap-2">

            {}
            {session && (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                <LayoutDashboard size={15} />
                My Boards
              </Link>
            )}

            {}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-all"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'dark'
                ? <Sun size={18} className="rotate-0 transition-transform" />
                : <Moon size={18} className="rotate-0 transition-transform" />
              }
            </button>

            {}
            {session ? (
              <div className="relative" ref={dropdownRef}>
                {}
                <button
                  id="user-menu-btn"
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl
                             hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                  aria-label="User menu"
                >
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={displayName}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500/30"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-brand-400 flex items-center justify-center ring-2 ring-purple-500/30">
                      <span className="text-xs font-bold text-white">{initials}</span>
                    </div>
                  )}
                  <ChevronDown
                    size={14}
                    className={`text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {}
                {dropdownOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] w-56
                                  bg-white dark:bg-gray-900
                                  border border-gray-100 dark:border-gray-800
                                  rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/40
                                  overflow-hidden animate-fade-in z-50">

                    {}
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {displayName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {session.user?.email}
                      </p>
                    </div>

                    {}
                    <div className="py-1.5">
                      <Link
                        id="edit-profile-link"
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm
                                   text-gray-700 dark:text-gray-300
                                   hover:bg-gray-50 dark:hover:bg-gray-800
                                   hover:text-purple-600 dark:hover:text-purple-400
                                   transition-colors"
                      >
                        <User size={14} />
                        Edit Profile
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm
                                   text-gray-700 dark:text-gray-300
                                   hover:bg-gray-50 dark:hover:bg-gray-800
                                   hover:text-purple-600 dark:hover:text-purple-400
                                   transition-colors"
                      >
                        <LayoutDashboard size={14} />
                        My Boards
                      </Link>
                    </div>

                    {}
                    <div className="py-1.5 border-t border-gray-100 dark:border-gray-800">
                      <button
                        id="sign-out-btn"
                        onClick={() => { setDropdownOpen(false); signOut(); }}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm
                                   text-red-500 dark:text-red-400
                                   hover:bg-red-50 dark:hover:bg-red-950/40
                                   transition-colors"
                      >
                        <LogOut size={14} />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="btn-primary text-sm py-2 px-5"
              >
                <LogIn size={14} />
                Sign in with Google
              </button>
            )}
          </div>

          {}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 dark:border-gray-800 animate-fade-in">
            {session ? (
              <>
                <div className="flex items-center gap-3 px-2 py-3">
                  {avatarSrc ? (
                    <img src={avatarSrc} alt={displayName} className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-500/30" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-brand-400 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{initials}</span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{displayName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 truncate">{session.user?.email}</p>
                  </div>
                </div>
                <Link href="/profile" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-2 py-3 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-500">
                  <User size={15} /> Edit Profile
                </Link>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-2 py-3 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-500">
                  <LayoutDashboard size={15} /> My Boards
                </Link>
                <button onClick={() => signOut()} className="flex items-center gap-2 px-2 py-3 text-sm text-red-500">
                  <LogOut size={15} /> Sign out
                </button>
              </>
            ) : (
              <button onClick={() => signIn('google')} className="btn-primary w-full justify-center text-sm py-2.5">
                <LogIn size={14} /> Sign in with Google
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
