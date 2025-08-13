import React from 'react';
import { ServiceGrid } from '../marketplace/ServiceGrid';
import { GlassmorphicCard } from '../ui/GlassmorphicCard';

export const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassmorphicCard className="p-6">
          <h3 className="text-lg font-medium">Active Services</h3>
          <p className="text-3xl font-bold mt-2">12</p>
        </GlassmorphicCard>

        <GlassmorphicCard className="p-6">
          <h3 className="text-lg font-medium">Total Earnings</h3>
          <p className="text-3xl font-bold mt-2">$1,234</p>
        </GlassmorphicCard>

        <GlassmorphicCard className="p-6">
          <h3 className="text-lg font-medium">Rating</h3>
          <p className="text-3xl font-bold mt-2">4.8</p>
        </GlassmorphicCard>
      </div>

      {/* Active Services */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Your Active Services</h2>
        <ServiceGrid className="max-w-none" />
      </section>
    </div>
  );
};