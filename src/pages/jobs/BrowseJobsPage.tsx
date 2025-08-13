import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Filter, MapPin, Calendar, DollarSign, Clock, BookmarkIcon,
  Eye, Users, AlertCircle, Briefcase, ArrowUpDown, X
} from 'lucide-react';
import { GlassmorphicCard } from '../../components/ui/GlassmorphicCard';
import { NeonButton } from '../../components/ui/NeonButton';
import { Input } from '../../components/ui/Input';
import { JobPosting, JobFilter } from '../../types';
import { mockJobPostings, jobCategories, skillsList } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

type SortOption = 'newest' | 'oldest' | 'budget_high' | 'budget_low' | 'deadline';
type LocationType = 'remote' | 'onsite' | 'hybrid';
type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

const priorityColors: Record<PriorityLevel, string> = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
};

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'budget_high', label: 'Highest Budget' },
  { value: 'budget_low', label: 'Lowest Budget' },
  { value: 'deadline', label: 'Urgent Deadline' }
];

export const BrowseJobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState<string[]>(['1', '2']); // Mock saved jobs
  const [filters, setFilters] = useState<JobFilter>({
    sortBy: 'newest'
  });

  const filteredAndSortedJobs = useMemo(() => {
    let jobs = mockJobPostings;

    // Apply search filter
    if (searchTerm) {
      jobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      jobs = jobs.filter(job => filters.categories!.includes(job.category));
    }

    // Apply budget filter
    if (filters.budgetRange) {
      jobs = jobs.filter(job =>
        job.budget.max >= filters.budgetRange!.min &&
        job.budget.min <= filters.budgetRange!.max &&
        job.budget.currency === filters.budgetRange!.currency
      );
    }

    // Apply location filter
    if (filters.location) {
      jobs = jobs.filter(job => {
        if (filters.location!.type && job.location.type !== filters.location!.type) {
          return false;
        }
        if (filters.location!.countries && filters.location!.countries.length > 0 && job.location.country) {
          return filters.location!.countries.includes(job.location.country);
        }
        return true;
      });
    }

    // Apply timeline filter
    if (filters.timeline) {
      jobs = jobs.filter(job => {
        const jobDurationInDays = job.timeline.unit === 'days' ? job.timeline.duration :
          job.timeline.unit === 'weeks' ? job.timeline.duration * 7 :
            job.timeline.duration * 30;
        const minDays = filters.timeline!.unit === 'days' ? filters.timeline!.min :
          filters.timeline!.unit === 'weeks' ? filters.timeline!.min * 7 :
            filters.timeline!.min * 30;
        const maxDays = filters.timeline!.unit === 'days' ? filters.timeline!.max :
          filters.timeline!.unit === 'weeks' ? filters.timeline!.max * 7 :
            filters.timeline!.max * 30;
        return jobDurationInDays >= minDays && jobDurationInDays <= maxDays;
      });
    }

    // Apply skills filter
    if (filters.skills && filters.skills.length > 0) {
      jobs = jobs.filter(job =>
        filters.skills!.some(skill => job.skills.includes(skill))
      );
    }

    // Apply priority filter
    if (filters.priority && filters.priority.length > 0) {
      jobs = jobs.filter(job => filters.priority!.includes(job.priority));
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'oldest':
        return jobs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'budget_high':
        return jobs.sort((a, b) => b.budget.max - a.budget.max);
      case 'budget_low':
        return jobs.sort((a, b) => a.budget.min - b.budget.min);
      case 'deadline':
        return jobs.sort((a, b) => {
          if (!a.timeline.deadline && !b.timeline.deadline) return 0;
          if (!a.timeline.deadline) return 1;
          if (!b.timeline.deadline) return -1;
          return new Date(a.timeline.deadline).getTime() - new Date(b.timeline.deadline).getTime();
        });
      case 'newest':
      default:
        return jobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [searchTerm, filters]);

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs(prev =>
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const clearFilters = () => {
    setFilters({ sortBy: 'newest' });
  };

  const formatTimeline = (job: JobPosting): string => {
    return `${job.timeline.duration} ${job.timeline.unit}`;
  };

  const formatBudget = (job: JobPosting): string => {
    if (job.budget.min === job.budget.max) {
      return `${job.budget.min} ${job.budget.currency}`;
    }
    return `${job.budget.min}-${job.budget.max} ${job.budget.currency}`;
  };

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
      return 'Just posted';
    }
  };

  const activeFiltersCount = [
    filters.categories?.length || 0,
    filters.budgetRange ? 1 : 0,
    filters.location?.type ? 1 : 0,
    filters.timeline ? 1 : 0,
    filters.skills?.length || 0,
    filters.priority?.length || 0
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Browse Jobs
          </h1>
          <p className="text-gray-600">
            Find your next freelance opportunity from {filteredAndSortedJobs.length} available jobs
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <GlassmorphicCard className="p-6" opacity={0.2}>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search jobs by title, skills, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <ArrowUpDown className="w-4 h-4 text-gray-600" />
                  <select
                    value={filters.sortBy || 'newest'}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as SortOption }))}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <NeonButton
                  variant={showFilters ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="relative"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </NeonButton>
              </div>
            </div>
          </GlassmorphicCard>
        </div>

        <div className="lg:flex lg:space-x-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-80 mb-8 lg:mb-0"
            >
              <GlassmorphicCard className="p-6 sticky top-8" opacity={0.2}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                  <div className="flex items-center space-x-2">
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-purple-600 hover:text-purple-700"
                      >
                        Clear all
                      </button>
                    )}
                    <button
                      onClick={() => setShowFilters(false)}
                      className="lg:hidden text-gray-500 hover:text-gray-700"
                      aria-label="Close filters"
                      title="Close filters"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categories
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {jobCategories.map(category => (
                        <label key={category} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={filters.categories?.includes(category) || false}
                            onChange={(e) => {
                              const categories = filters.categories || [];
                              if (e.target.checked) {
                                setFilters(prev => ({ ...prev, categories: [...categories, category] }));
                              } else {
                                setFilters(prev => ({ ...prev, categories: categories.filter(c => c !== category) }));
                              }
                            }}
                            className="text-purple-600 rounded"
                          />
                          <span className="text-sm">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Budget Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range
                    </label>
                    <div className="space-y-3">
                      <select
                        value={filters.budgetRange?.currency || 'SOL'}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          budgetRange: {
                            ...prev.budgetRange,
                            min: prev.budgetRange?.min || 0,
                            max: prev.budgetRange?.max || 100,
                            currency: e.target.value as 'SOL' | 'USDC'
                          }
                        }))}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      >
                        <option value="SOL">SOL</option>
                        <option value="USDC">USDC</option>
                      </select>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={filters.budgetRange?.min || ''}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            budgetRange: {
                              ...prev.budgetRange,
                              min: parseFloat(e.target.value) || 0,
                              max: prev.budgetRange?.max || 100,
                              currency: prev.budgetRange?.currency || 'SOL'
                            }
                          }))}
                          className="text-sm"
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          value={filters.budgetRange?.max || ''}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            budgetRange: {
                              ...prev.budgetRange,
                              min: prev.budgetRange?.min || 0,
                              max: parseFloat(e.target.value) || 100,
                              currency: prev.budgetRange?.currency || 'SOL'
                            }
                          }))}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Work Location
                    </label>
                    <div className="space-y-2">
                      {(['remote', 'onsite', 'hybrid'] as LocationType[]).map(type => (
                        <label key={type} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="locationType"
                            checked={filters.location?.type === type}
                            onChange={() => setFilters(prev => ({
                              ...prev,
                              location: { ...prev.location, type: type }
                            }))}
                            className="text-purple-600"
                          />
                          <span className="text-sm capitalize">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Skills Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Required Skills
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {skillsList.slice(0, 20).map(skill => (
                        <label key={skill} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={filters.skills?.includes(skill) || false}
                            onChange={(e) => {
                              const skills = filters.skills || [];
                              if (e.target.checked) {
                                setFilters(prev => ({ ...prev, skills: [...skills, skill] }));
                              } else {
                                setFilters(prev => ({ ...prev, skills: skills.filter(s => s !== skill) }));
                              }
                            }}
                            className="text-purple-600 rounded"
                          />
                          <span className="text-sm">{skill}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Priority Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority Level
                    </label>
                    <div className="space-y-2">
                      {(Object.keys(priorityColors) as PriorityLevel[]).map(priority => (
                        <label key={priority} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={filters.priority?.includes(priority) || false}
                            onChange={(e) => {
                              const priorities = filters.priority || [];
                              if (e.target.checked) {
                                setFilters(prev => ({ ...prev, priority: [...priorities, priority] }));
                              } else {
                                setFilters(prev => ({ ...prev, priority: priorities.filter(p => p !== priority) }));
                              }
                            }}
                            className="text-purple-600 rounded"
                          />
                          <span className="text-sm capitalize">{priority}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassmorphicCard>
            </motion.div>
          )}

          {/* Job Listings */}
          <div className="flex-1">
            {filteredAndSortedJobs.length === 0 ? (
              <GlassmorphicCard className="p-12 text-center" opacity={0.2}>
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or filters to find more opportunities.
                </p>
                <NeonButton
                  variant="primary"
                  onClick={() => {
                    setSearchTerm('');
                    clearFilters();
                  }}
                >
                  Clear all filters
                </NeonButton>
              </GlassmorphicCard>
            ) : (
              <div className="space-y-6">
                {filteredAndSortedJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlassmorphicCard className="p-6 hover:shadow-lg transition-shadow cursor-pointer" opacity={0.2} hover>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 
                              className="text-xl font-semibold text-gray-900 hover:text-purple-600 transition-colors cursor-pointer"
                              onClick={() => navigate(`/jobs/${job.id}`)}
                            >
                              {job.title}
                            </h3>
                            <button
                              onClick={() => toggleSaveJob(job.id)}
                              className={`ml-4 p-2 rounded-lg transition-colors ${
                                savedJobs.includes(job.id)
                                  ? 'text-purple-600 bg-purple-50'
                                  : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'
                              }`}
                              aria-label={savedJobs.includes(job.id) ? 'Remove from saved jobs' : 'Save job'}
                              title={savedJobs.includes(job.id) ? 'Remove from saved jobs' : 'Save job'}
                            >
                              <BookmarkIcon className={`w-5 h-5 ${savedJobs.includes(job.id) ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <span className="font-medium">{job.category}</span>
                            {job.subcategory && (
                              <>
                                <span>•</span>
                                <span>{job.subcategory}</span>
                              </>
                            )}
                            <span>•</span>
                            <span>{getTimeAgo(job.createdAt)}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[job.priority]}`}>
                              {job.priority}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>

                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-medium">{formatBudget(job)}</span>
                          {job.budget.type === 'hourly' && <span className="text-sm">/hour</span>}
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{formatTimeline(job)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="capitalize">{job.location.type}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Eye className="w-4 h-4" />
                          <span>{job.views} views</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{job.bids.length} proposals</span>
                        </div>
                      </div>

                      {job.skills.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {job.skills.slice(0, 6).map(skill => (
                              <span
                                key={skill}
                                className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                            {job.skills.length > 6 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{job.skills.length - 6} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {job.timeline.deadline && (
                            <div className="flex items-center space-x-1 text-orange-600">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">
                                Deadline: {job.timeline.deadline.toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {job.priority === 'urgent' && (
                            <div className="flex items-center space-x-1 text-red-600">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">Urgent</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <NeonButton
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate(`/jobs/${job.id}`)}
                          >
                            View Details
                          </NeonButton>
                          <NeonButton
                            variant="primary"
                            size="sm"
                            onClick={() => navigate(`/jobs/${job.id}?action=bid`)}
                          >
                            Submit Proposal
                          </NeonButton>
                        </div>
                      </div>
                    </GlassmorphicCard>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {filteredAndSortedJobs.length > 0 && filteredAndSortedJobs.length >= 10 && (
              <div className="mt-8 text-center">
                <NeonButton variant="secondary">
                  Load More Jobs
                </NeonButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};