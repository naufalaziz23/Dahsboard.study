'use client';

import React from 'react';
import OverviewHeader from '@/components/dashboard/OverviewHeader';
import StatsRow from '@/components/dashboard/StatsRow';
import ContinueWritingCard from '@/components/dashboard/ContinueWritingCard';
import TodaysFocusCard from '@/components/dashboard/TodaysFocusCard';
import WeeklyActivityChart from '@/components/dashboard/WeeklyActivityChart';
import ProjectsSummary from '@/components/dashboard/ProjectsSummary';
import UpcomingDeadlines from '@/components/dashboard/UpcomingDeadlines';
import MotivationalQuoteBanner from '@/components/dashboard/MotivationalQuoteBanner';
import QuickActions from '@/components/dashboard/QuickActions';

export default function OverviewPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-5 pb-16">
      {/* 1. Hero Welcome Header */}
      <OverviewHeader />

      {/* 2. Top Stats Row — 4 cards */}
      <StatsRow />

      {/* 3. Middle 3-Column Activity Grid — equal height cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        <ContinueWritingCard />
        <TodaysFocusCard />
        <WeeklyActivityChart />
      </div>

      {/* 4. Bottom: Projects Summary (2/3 width) + Upcoming Deadlines (1/3 width) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        <div className="lg:col-span-2">
          <ProjectsSummary />
        </div>
        <div className="lg:col-span-1">
          <UpcomingDeadlines />
        </div>
      </div>

      {/* 5. Motivational Banner (2/3) + Quick Actions (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        <div className="lg:col-span-2">
          <MotivationalQuoteBanner />
        </div>
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}