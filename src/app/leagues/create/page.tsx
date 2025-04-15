'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { LeagueCreate } from '@/components/league/LeagueCreate';

export default function CreateLeaguePage() {
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New League</h1>
        <p className="mt-2 text-gray-600">
          Create a new fantasy league and invite your friends to join.
        </p>
      </div>
      
      <LeagueCreate />
    </MainLayout>
  );
}
