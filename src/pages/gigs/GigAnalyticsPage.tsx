import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { GigAnalytics } from '../../components/gigs/GigAnalytics';
import { Gig, GigAnalytics as GigAnalyticsType } from '../../types/gig';

// Mock data - in real app this would come from API
const MOCK_GIG: Gig = {
  id: '1',
  userId: 'user1',
  title: 'I will create a modern, professional logo design for your business',
  description: 'Professional logo design with unlimited revisions...',
  category: 'graphics-design',
  subcategory: 'Logo Design',
  tags: ['logo', 'branding', 'design', 'business', 'modern'],
  images: [],
  status: 'active',
  packages: [
    {
      id: 'pkg1',
      name: 'basic',
      type: 'basic',
      title: 'Basic Logo Package',
      description: 'Perfect for startups',
      price: 0.15,
      currency: 'SOL',
      deliveryTime: 2,
      revisions: 3,
      features: ['1 logo concept', '3 revisions'],
      isActive: true
    }
  ],
  extras: [],
  faq: [],
  requirements: [],
  deliverables: [],
  keywords: [],
  rating: 4.9,
  totalOrders: 156,
  totalEarnings: 45.2,
  impressions: 12450,
  clicks: 890,
  conversionRate: 7.2,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-20')
};

const MOCK_ANALYTICS: GigAnalyticsType[] = [
  { gigId: '1', period: 'day', impressions: 125, clicks: 12, orders: 2, revenue: 0.3, conversionRate: 9.6, date: new Date('2024-02-20') },
  { gigId: '1', period: 'day', impressions: 98, clicks: 8, orders: 1, revenue: 0.15, conversionRate: 8.2, date: new Date('2024-02-19') },
  { gigId: '1', period: 'day', impressions: 156, clicks: 15, orders: 3, revenue: 0.45, conversionRate: 9.6, date: new Date('2024-02-18') },
  { gigId: '1', period: 'day', impressions: 134, clicks: 11, orders: 1, revenue: 0.15, conversionRate: 8.2, date: new Date('2024-02-17') },
  { gigId: '1', period: 'day', impressions: 187, clicks: 19, orders: 4, revenue: 0.6, conversionRate: 10.2, date: new Date('2024-02-16') },
  { gigId: '1', period: 'day', impressions: 142, clicks: 13, orders: 2, revenue: 0.3, conversionRate: 9.2, date: new Date('2024-02-15') },
  { gigId: '1', period: 'day', impressions: 178, clicks: 16, orders: 2, revenue: 0.3, conversionRate: 9.0, date: new Date('2024-02-14') }
];

export const GigAnalyticsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // In a real app, you'd fetch the gig data and analytics based on the ID
  const gig = MOCK_GIG;
  const analytics = MOCK_ANALYTICS;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/gigs/manage`)}
            className="flex items-center text-white/70 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gigs
          </button>
        </div>

        <GigAnalytics gig={gig} analytics={analytics} />
      </div>
    </div>
  );
};
