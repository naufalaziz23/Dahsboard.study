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
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* 1. Welcoming Hero with Desk Graphic */}
      <OverviewHeader />

      {/* 2. Top Stats 4 Cards */}
      <StatsRow />

      {/* 3. Middle 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ContinueWritingCard />
        <TodaysFocusCard />
        <WeeklyActivityChart />
      </div>

      {/* 4. Bottom Projects and Deadlines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProjectsSummary />
        </div>
        <div className="lg:col-span-1">
          <UpcomingDeadlines />
        </div>
      </div>

      {/* 5. Motivational Quote Banner & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
