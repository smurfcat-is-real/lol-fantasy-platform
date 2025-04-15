'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/store';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();
  const currentLeague = useStore((state) => state.currentLeague);
  const currentTeam = useStore((state) => state.currentTeam);
  
  // Function to check if a link is active
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };
  
  // Get the active link style
  const getNavLinkClass = (path: string) => {
    const baseClass = "block px-3 py-2 rounded-md text-sm font-medium";
    return isActive(path)
      ? `${baseClass} bg-indigo-100 text-indigo-700`
      : `${baseClass} text-gray-700 hover:bg-gray-100`;
  };
  
  return (
    <aside className="w-64 bg-white shadow-md min-h-screen p-4">
      <nav className="space-y-6">
        <div>
          <h3 className="text-xs uppercase text-gray-500 font-semibold tracking-wider">
            General
          </h3>
          <div className="mt-2 space-y-1">
            <Link 
              href="/dashboard" 
              className={getNavLinkClass('/dashboard')}
            >
              Dashboard
            </Link>
            <Link 
              href="/leagues" 
              className={getNavLinkClass('/leagues')}
            >
              My Leagues
            </Link>
          </div>
        </div>
        
        {currentLeague && (
          <div>
            <h3 className="text-xs uppercase text-gray-500 font-semibold tracking-wider">
              {currentLeague.name}
            </h3>
            <div className="mt-2 space-y-1">
              <Link 
                href={`/leagues/${currentLeague.id}`} 
                className={getNavLinkClass(`/leagues/${currentLeague.id}`)}
              >
                Overview
              </Link>
              
              {currentTeam && (
                <>
                  <Link 
                    href={`/leagues/${currentLeague.id}/team`} 
                    className={getNavLinkClass(`/leagues/${currentLeague.id}/team`)}
                  >
                    My Team
                  </Link>
                  <Link 
                    href={`/leagues/${currentLeague.id}/market`} 
                    className={getNavLinkClass(`/leagues/${currentLeague.id}/market`)}
                  >
                    Transfer Market
                  </Link>
                </>
              )}
              
              <Link 
                href={`/leagues/${currentLeague.id}/standings`} 
                className={getNavLinkClass(`/leagues/${currentLeague.id}/standings`)}
              >
                Standings
              </Link>
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
}
