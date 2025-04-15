'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl">LoL Fantasy</span>
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/dashboard"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Dashboard
              </Link>
              <Link
                href="/leagues"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Leagues
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">
                  {session.user.name || session.user.email}
                </span>
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-indigo-700 hover:bg-indigo-800 px-3 py-2 rounded text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link 
                  href="/auth/signin" 
                  className="bg-indigo-700 hover:bg-indigo-800 px-3 py-2 rounded text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/register" 
                  className="bg-white text-indigo-600 hover:bg-gray-100 px-3 py-2 rounded text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
