import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter, Calendar, DollarSign, Clock, Star, Eye, MessageCircle,
  Edit3, Trash2, AlertCircle, CheckCircle, XCircle, ArrowUpDown
} from 'lucide-react';
import { GlassmorphicCard } from '../../components/ui/GlassmorphicCard';
import { NeonButton } from '../../components/ui/NeonButton';
import { Input } from '../../components/ui/Input';
import { EnhancedBid, JobPosting } from '../../types';
import { mockBids, mockJobPostings } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

type BidStatus = 'all' | 'pending' | 'accepted' | 'rejected';
type SortOption = 'newest' | 'oldest' | 'amount_high' | 'amount_low' | 'status';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
};

const statusIcons = {
  pending: Clock,
  accepted: CheckCircle,
  rejected: XCircle
};

export const BidManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<BidStatus>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - in real app, this would come from API
  const bidsWithJobs = useMemo(() => {
    return mockBids.map(bid => ({
      ...bid,
      job: mockJobPostings.find(job => job.id === bid.jobId)!
    }));
  }, []);

  const filteredAndSortedBids = useMemo(() => {
    let bids = bidsWithJobs;

    // Apply search filter
    if (searchTerm) {
      bids = bids.filter(bid =>
        bid.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.job.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.proposal.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (selectedStatus !== 'all') {
      bids = bids.filter(bid => bid.status === selectedStatus);
    }

    // Apply sorting
    switch (sortBy) {
      case 'oldest':
        return bids.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'amount_high':
        return bids.sort((a, b) => b.amount - a.amount);
      case 'amount_low':
        return bids.sort((a, b) => a.amount - b.amount);
      case 'status':
        return bids.sort((a, b) => a.status.localeCompare(b.status));
      case 'newest':
      default:
        return bids.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [bidsWithJobs, searchTerm, selectedStatus, sortBy]);

  const bidStats = useMemo(() => {
    const stats = {
      total: bidsWithJobs.length,
      pending: bidsWithJobs.filter(b => b.status === 'pending').length,
      accepted: bidsWithJobs.filter(b => b.status === 'accepted').length,
      rejected: bidsWithJobs.filter(b => b.status === 'rejected').length,
      totalValue: bidsWithJobs.reduce((sum, bid) => sum + bid.amount, 0)
    };
    return stats;
  }, [bidsWithJobs]);

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just submitted';
    }
  };

  const handleWithdrawBid = (bidId: string) => {
    // Here you would make an API call to withdraw the bid
    console.log('Withdrawing bid:', bidId);
  };

  const handleEditBid = (bidId: string) => {
    const bid = bidsWithJobs.find(b => b.id === bidId);
    if (bid) {
      navigate(`/jobs/${bid.job.id}?action=edit_bid&bidId=${bidId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            My Proposals
          </h1>
          <p className="text-gray-600">
            Track and manage all your submitted proposals
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <GlassmorphicCard className="p-6 text-center" opacity={0.2}>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {bidStats.total}
            </div>
            <div className="text-sm text-gray-600">Total Proposals</div>
          </GlassmorphicCard>
          
          <GlassmorphicCard className="p-6 text-center" opacity={0.2}>
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {bidStats.pending}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </GlassmorphicCard>
          
          <GlassmorphicCard className="p-6 text-center" opacity={0.2}>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {bidStats.accepted}
            </div>
            <div className="text-sm text-gray-600">Accepted</div>
          </GlassmorphicCard>
          
          <GlassmorphicCard className="p-6 text-center" opacity={0.2}>
            <div className="text-3xl font-bold text-red-600 mb-2">
              {bidStats.rejected}
            </div>
            <div className="text-sm text-gray-600">Rejected</div>
          </GlassmorphicCard>
          
          <GlassmorphicCard className="p-6 text-center" opacity={0.2}>
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {bidStats.totalValue.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Total Value (SOL)</div>
          </GlassmorphicCard>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <GlassmorphicCard className="p-6" opacity={0.2}>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search proposals by job title or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-4">
                {/* Status Filter */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as BidStatus)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>

                {/* Sort Options */}
                <div className="flex items-center space-x-2">
                  <ArrowUpDown className="w-4 h-4 text-gray-600" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="amount_high">Highest Amount</option>
                    <option value="amount_low">Lowest Amount</option>
                    <option value="status">By Status</option>
                  </select>
                </div>

                <NeonButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4" />
                  {showFilters ? 'Hide' : 'Show'} Filters
                </NeonButton>
              </div>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-6 pt-6 border-t border-gray-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount Range
                      </label>
                      <div className="flex space-x-2">
                        <Input placeholder="Min" type="number" />
                        <Input placeholder="Max" type="number" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Range
                      </label>
                      <div className="flex space-x-2">
                        <Input type="date" />
                        <Input type="date" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                        <option value="">All Categories</option>
                        <option value="web-development">Web Development</option>
                        <option value="design">Design</option>
                        <option value="writing">Writing</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassmorphicCard>
        </div>

        {/* Bids List */}
        {filteredAndSortedBids.length === 0 ? (
          <GlassmorphicCard className="p-12 text-center" opacity={0.2}>
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No proposals found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedStatus !== 'all' 
                ? 'Try adjusting your search terms or filters.'
                : 'You haven\'t submitted any proposals yet. Start browsing jobs to find opportunities!'
              }
            </p>
            <NeonButton
              variant="primary"
              onClick={() => navigate('/jobs')}
            >
              Browse Jobs
            </NeonButton>
          </GlassmorphicCard>
        ) : (
          <div className="space-y-6">
            {filteredAndSortedBids.map((bid, index) => {
              const StatusIcon = statusIcons[bid.status];
              
              return (
                <motion.div
                  key={bid.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassmorphicCard className="p-6 hover:shadow-lg transition-shadow" opacity={0.2}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 
                            className="text-xl font-semibold text-gray-900 hover:text-purple-600 transition-colors cursor-pointer"
                            onClick={() => navigate(`/jobs/${bid.job.id}`)}
                          >
                            {bid.job.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[bid.status]}`}>
                            <StatusIcon className="w-3 h-3 inline mr-1" />
                            {bid.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span>{bid.job.category}</span>
                          <span>•</span>
                          <span>Submitted {getTimeAgo(bid.createdAt)}</span>
                          <span>•</span>
                          <span>Client: John Smith</span>
                        </div>

                        <div className="flex items-center space-x-6 mb-4">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-gray-600" />
                            <span className="font-semibold text-lg">
                              {bid.amount} {bid.currency}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{bid.deliveryTime} days delivery</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Eye className="w-4 h-4" />
                            <span>{bid.job.views} job views</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-700 line-clamp-3">{bid.proposal.content}</p>
                    </div>

                    {bid.proposal.timeline.milestones && bid.proposal.timeline.milestones.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                          <Clock className="w-4 h-4" />
                          <span>{bid.proposal.timeline.milestones.length} milestones planned</span>
                        </div>
                      </div>
                    )}

                    {bid.freelancerProfile.skills.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {bid.freelancerProfile.skills.slice(0, 4).map(skill => (
                            <span
                              key={skill}
                              className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                          {bid.freelancerProfile.skills.length > 4 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{bid.freelancerProfile.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {bid.status === 'accepted' && (
                          <div className="flex items-center space-x-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Proposal Accepted!</span>
                          </div>
                        )}
                        {bid.status === 'rejected' && bid.feedback && (
                          <div className="flex items-center space-x-1 text-red-600">
                            <XCircle className="w-4 h-4" />
                            <span className="text-sm">Client feedback available</span>
                          </div>
                        )}
                        {bid.isShortlisted && bid.status === 'pending' && (
                          <div className="flex items-center space-x-1 text-yellow-600">
                            <Star className="w-4 h-4" />
                            <span className="text-sm font-medium">Shortlisted</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <NeonButton
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate(`/chat?project=${bid.job.id}`)}
                        >
                          <MessageCircle className="w-4 h-4" />
                          Message
                        </NeonButton>
                        
                        {bid.status === 'pending' && (
                          <>
                            <NeonButton
                              variant="secondary"
                              size="sm"
                              onClick={() => handleEditBid(bid.id)}
                            >
                              <Edit3 className="w-4 h-4" />
                              Edit
                            </NeonButton>
                            <button
                              onClick={() => handleWithdrawBid(bid.id)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        
                        <NeonButton
                          variant="primary"
                          size="sm"
                          onClick={() => navigate(`/jobs/${bid.job.id}`)}
                        >
                          View Job
                        </NeonButton>
                      </div>
                    </div>

                    {bid.status === 'rejected' && bid.feedback && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                      >
                        <div className="flex items-start space-x-2">
                          <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-red-800 mb-1">Client Feedback:</p>
                            <p className="text-sm text-red-700">{bid.feedback}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {bid.negotiationHistory && bid.negotiationHistory.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <MessageCircle className="w-4 h-4 text-blue-600" />
                          <p className="text-sm font-medium text-blue-800">
                            Negotiation History ({bid.negotiationHistory.length} messages)
                          </p>
                        </div>
                        <div className="space-y-2">
                          {bid.negotiationHistory.slice(0, 2).map((nego, idx) => (
                            <div key={nego.id} className="text-sm">
                              <span className="font-medium">
                                {nego.fromUserId === 'current-user' ? 'You' : 'Client'}:
                              </span>
                              <span className="ml-2 text-gray-700">{nego.message}</span>
                            </div>
                          ))}
                          {bid.negotiationHistory.length > 2 && (
                            <button className="text-sm text-blue-600 hover:text-blue-700">
                              View all messages →
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </GlassmorphicCard>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Load More */}
        {filteredAndSortedBids.length >= 10 && (
          <div className="mt-8 text-center">
            <NeonButton variant="secondary">
              Load More Proposals
            </NeonButton>
          </div>
        )}
      </div>
    </div>
  );
};
