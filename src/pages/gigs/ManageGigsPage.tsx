import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Pause, 
  Play, 
  Copy, 
  Trash2,
  TrendingUp,
  Star,
  MessageSquare,
  DollarSign,
  Users,
  BarChart3
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { NeonButton } from '../../components/ui/NeonButton';
import { Input } from '../../components/ui/Input';
import { GlassmorphicCard } from '../../components/ui/GlassmorphicCard';
import { Gig } from '../../types/gig';

// Mock data for demonstration
const MOCK_GIGS: Gig[] = [
  {
    id: '1',
    userId: 'user1',
    title: 'I will create a modern logo design for your business',
    description: 'Professional logo design with unlimited revisions...',
    category: 'graphics-design',
    subcategory: 'Logo Design',
    tags: ['logo', 'branding', 'design'],
    images: [],
    status: 'active',
    packages: [
      {
        id: 'pkg1',
        name: 'basic',
        type: 'basic',
        title: 'Basic Logo',
        description: 'Simple logo design',
        price: 0.1,
        currency: 'SOL',
        deliveryTime: 3,
        revisions: 2,
        features: ['Logo design', '2 revisions'],
        isActive: true
      }
    ],
    extras: [],
    faq: [],
    requirements: [],
    deliverables: [],
    keywords: [],
    rating: 4.8,
    totalOrders: 156,
    totalEarnings: 15.6,
    impressions: 12450,
    clicks: 890,
    conversionRate: 7.2,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    userId: 'user1',
    title: 'I will develop a responsive website using React',
    description: 'Modern, fast, and responsive web development...',
    category: 'programming-tech',
    subcategory: 'Web Development',
    tags: ['react', 'website', 'frontend'],
    images: [],
    status: 'active',
    packages: [
      {
        id: 'pkg2',
        name: 'basic',
        type: 'basic',
        title: 'Landing Page',
        description: 'Single page website',
        price: 2.5,
        currency: 'SOL',
        deliveryTime: 7,
        revisions: 3,
        features: ['Responsive design', 'Modern UI'],
        isActive: true
      }
    ],
    extras: [],
    faq: [],
    requirements: [],
    deliverables: [],
    keywords: [],
    rating: 4.9,
    totalOrders: 89,
    totalEarnings: 222.5,
    impressions: 8930,
    clicks: 567,
    conversionRate: 6.3,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-10')
  },
  {
    id: '3',
    userId: 'user1',
    title: 'I will write engaging blog content for your website',
    description: 'SEO-optimized blog posts and articles...',
    category: 'writing-translation',
    subcategory: 'Content Writing',
    tags: ['writing', 'blog', 'seo'],
    images: [],
    status: 'paused',
    packages: [
      {
        id: 'pkg3',
        name: 'basic',
        type: 'basic',
        title: 'Blog Post',
        description: '500-word blog post',
        price: 0.05,
        currency: 'SOL',
        deliveryTime: 2,
        revisions: 1,
        features: ['SEO optimized', 'Engaging content'],
        isActive: true
      }
    ],
    extras: [],
    faq: [],
    requirements: [],
    deliverables: [],
    keywords: [],
    rating: 4.6,
    totalOrders: 234,
    totalEarnings: 11.7,
    impressions: 15670,
    clicks: 1234,
    conversionRate: 7.9,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-02-15')
  }
];

const FILTER_OPTIONS = [
  { value: 'all', label: 'All Gigs' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'draft', label: 'Draft' }
];

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'orders', label: 'Most Orders' },
  { value: 'earnings', label: 'Highest Earnings' },
  { value: 'rating', label: 'Highest Rating' }
];

export const ManageGigsPage: React.FC = () => {
  const navigate = useNavigate();
  const [gigs, setGigs] = useState<Gig[]>(MOCK_GIGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showDropdownId, setShowDropdownId] = useState<string | null>(null);

  // Filter and sort gigs
  const filteredGigs = gigs
    .filter(gig => {
      const matchesSearch = gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           gig.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || gig.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'orders':
          return b.totalOrders - a.totalOrders;
        case 'earnings':
          return b.totalEarnings - a.totalEarnings;
        case 'rating':
          return b.rating - a.rating;
        case 'recent':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

  const handleToggleStatus = (gigId: string) => {
    setGigs(prev => prev.map(gig => 
      gig.id === gigId 
        ? { ...gig, status: gig.status === 'active' ? 'paused' : 'active' } 
        : gig
    ));
  };

  const handleDuplicate = (gigId: string) => {
    const originalGig = gigs.find(gig => gig.id === gigId);
    if (originalGig) {
      const newGig: Gig = {
        ...originalGig,
        id: `${originalGig.id}-copy-${Date.now()}`,
        title: `${originalGig.title} (Copy)`,
        status: 'draft',
        totalOrders: 0,
        totalEarnings: 0,
        impressions: 0,
        clicks: 0,
        conversionRate: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setGigs(prev => [newGig, ...prev]);
    }
    setShowDropdownId(null);
  };

  const handleDelete = (gigId: string) => {
    if (window.confirm('Are you sure you want to delete this gig?')) {
      setGigs(prev => prev.filter(gig => gig.id !== gigId));
    }
    setShowDropdownId(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'paused':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'draft':
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const totalEarnings = gigs.reduce((sum, gig) => sum + gig.totalEarnings, 0);
  const totalOrders = gigs.reduce((sum, gig) => sum + gig.totalOrders, 0);
  const activeGigs = gigs.filter(gig => gig.status === 'active').length;
  const avgRating = gigs.length > 0 ? gigs.reduce((sum, gig) => sum + gig.rating, 0) / gigs.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Manage Your Gigs</h1>
            <p className="text-white/70">Monitor performance and manage your services</p>
          </div>
          <div className="mt-4 lg:mt-0">
            <NeonButton
              onClick={() => navigate('/gigs/create')}
              variant="accent"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create New Gig
            </NeonButton>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GlassmorphicCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total Earnings</p>
                <p className="text-2xl font-bold text-white">{totalEarnings.toFixed(2)} SOL</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400 text-sm">+12.5% this month</span>
            </div>
          </GlassmorphicCard>

          <GlassmorphicCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-white">{totalOrders}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400 text-sm">+8 this week</span>
            </div>
          </GlassmorphicCard>

          <GlassmorphicCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Active Gigs</p>
                <p className="text-2xl font-bold text-white">{activeGigs}</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-white/70 text-sm">of {gigs.length} total</span>
            </div>
          </GlassmorphicCard>

          <GlassmorphicCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Average Rating</p>
                <p className="text-2xl font-bold text-white">{avgRating.toFixed(1)}</p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
              <span className="text-yellow-400 text-sm">Excellent</span>
            </div>
          </GlassmorphicCard>
        </div>

        {/* Filters and Search */}
        <GlassmorphicCard className="p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search your gigs..."
                icon={<Search className="w-4 h-4" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-white/60"
              />
            </div>
            
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-purple-500"
              >
                {FILTER_OPTIONS.map(option => (
                  <option key={option.value} value={option.value} className="text-gray-900">
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-purple-500"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value} className="text-gray-900">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </GlassmorphicCard>

        {/* Gigs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredGigs.map((gig) => (
            <motion.div
              key={gig.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GlassmorphicCard className="overflow-hidden hover:scale-105 transition-transform duration-300">
                {/* Gig Image */}
                <div className="relative h-48 bg-gradient-to-r from-purple-500 to-blue-500">
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-4xl mb-2">📸</div>
                      <p className="text-sm opacity-75">No image uploaded</p>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(gig.status)}`}>
                      {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
                    </span>
                  </div>

                  {/* Actions Dropdown */}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => setShowDropdownId(showDropdownId === gig.id ? null : gig.id)}
                      className="p-2 bg-black/30 rounded-full text-white hover:bg-black/50 transition-colors"
                      aria-label="More options"
                      title="More options"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    
                    {showDropdownId === gig.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-10 min-w-[150px]"
                      >
                        <Link
                          to={`/gigs/${gig.id}`}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowDropdownId(null)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Gig
                        </Link>
                        <Link
                          to={`/gigs/${gig.id}/edit`}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowDropdownId(null)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(gig.id)}
                          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                          {gig.status === 'active' ? (
                            <>
                              <Pause className="w-4 h-4 mr-2" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Activate
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleDuplicate(gig.id)}
                          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </button>
                        <hr className="my-1" />
                        <button
                          onClick={() => handleDelete(gig.id)}
                          className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  {/* Title and Category */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                      {gig.title}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {gig.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} › {gig.subcategory}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {gig.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-white/70"
                      >
                        {tag}
                      </span>
                    ))}
                    {gig.tags.length > 3 && (
                      <span className="px-2 py-1 bg-white/10 border border-white/20 rounded text-xs text-white/70">
                        +{gig.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-white/70 text-xs">Orders</p>
                      <p className="text-white font-semibold">{gig.totalOrders}</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-xs">Earnings</p>
                      <p className="text-white font-semibold">{gig.totalEarnings.toFixed(2)} SOL</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-xs">Rating</p>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                        <span className="text-white font-semibold">{gig.rating}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-white/70 text-xs">Views</p>
                      <p className="text-white font-semibold">{gig.impressions.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/70 text-xs">Starting at</p>
                      <p className="text-white font-bold">
                        {Math.min(...gig.packages.map(pkg => pkg.price))} {gig.packages[0]?.currency}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/gigs/${gig.id}/orders`}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                        title="View Orders"
                        aria-label="View Orders"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/gigs/${gig.id}/analytics`}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                        title="View Analytics"
                        aria-label="View Analytics"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </GlassmorphicCard>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredGigs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <GlassmorphicCard className="p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-white mb-2">No gigs found</h3>
              <p className="text-white/70 mb-6">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first gig to start earning'}
              </p>
              {(!searchTerm && statusFilter === 'all') && (
                <NeonButton
                  onClick={() => navigate('/gigs/create')}
                  variant="accent"
                >
                  Create Your First Gig
                </NeonButton>
              )}
            </GlassmorphicCard>
          </motion.div>
        )}
      </div>
    </div>
  );
};