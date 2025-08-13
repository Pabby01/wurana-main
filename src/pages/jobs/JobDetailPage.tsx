/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, Calendar, DollarSign, Clock, Star, Users, Eye, BookmarkIcon,
  FileText, X, Send, MessageCircle, Shield, Award, Plus
} from 'lucide-react';
import { GlassmorphicCard } from '../../components/ui/GlassmorphicCard';
import { NeonButton } from '../../components/ui/NeonButton';
import { Input } from '../../components/ui/Input';
import { JobPosting, EnhancedBid, Milestone } from '../../types';
import { mockJobPostings, mockBids } from '../../data/mockData';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
};

export const JobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [job, setJob] = useState<JobPosting | null>(null);
  const [bids, setBids] = useState<EnhancedBid[]>([]);
  const [showBidForm, setShowBidForm] = useState(searchParams.get('action') === 'bid');
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'bids' | 'client'>('description');

  // Bid form state
  const [bidForm, setBidForm] = useState({
    amount: 0,
    currency: 'SOL' as 'SOL' | 'USDC',
    deliveryTime: 7,
    proposal: {
      content: '',
      timeline: {
        duration: 7,
        unit: 'days' as 'days' | 'weeks' | 'months',
        milestones: [] as Milestone[]
      },
      attachments: [],
      questions: [] as string[]
    }
  });

  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    amount: 0,
    dueDate: ''
  });
  const [newQuestion, setNewQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (jobId) {
      const foundJob = mockJobPostings.find(j => j.id === jobId);
      if (foundJob) {
        setJob(foundJob);
        setBids(mockBids.filter(b => b.jobId === jobId));
        setIsSaved(foundJob.savedBy.includes('current-user'));
        
        // Initialize bid form with job defaults
        setBidForm(prev => ({
          ...prev,
          currency: foundJob.budget.currency,
          amount: Math.round((foundJob.budget.min + foundJob.budget.max) / 2),
          deliveryTime: foundJob.timeline.duration,
          proposal: {
            ...prev.proposal,
            timeline: {
              duration: foundJob.timeline.duration,
              unit: foundJob.timeline.unit,
              milestones: []
            }
          }
        }));
      }
    }
  }, [jobId]);

  const handleSaveJob = () => {
    setIsSaved(!isSaved);
    // Here you would make an API call to save/unsave the job
  };

  const addMilestone = () => {
    if (newMilestone.title && newMilestone.amount > 0 && newMilestone.dueDate) {
      const milestone: Milestone = {
        id: `milestone-${Date.now()}`,
        title: newMilestone.title,
        description: newMilestone.description,
        amount: newMilestone.amount,
        dueDate: new Date(newMilestone.dueDate),
        status: 'pending'
      };

      setBidForm(prev => ({
        ...prev,
        proposal: {
          ...prev.proposal,
          timeline: {
            ...prev.proposal.timeline,
            milestones: [...prev.proposal.timeline.milestones, milestone]
          }
        }
      }));

      setNewMilestone({
        title: '',
        description: '',
        amount: 0,
        dueDate: ''
      });
    }
  };

  const removeMilestone = (milestoneId: string) => {
    setBidForm(prev => ({
      ...prev,
      proposal: {
        ...prev.proposal,
        timeline: {
          ...prev.proposal.timeline,
          milestones: prev.proposal.timeline.milestones.filter(m => m.id !== milestoneId)
        }
      }
    }));
  };

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setBidForm(prev => ({
        ...prev,
        proposal: {
          ...prev.proposal,
          questions: [...prev.proposal.questions, newQuestion.trim()]
        }
      }));
      setNewQuestion('');
    }
  };

  const removeQuestion = (index: number) => {
    setBidForm(prev => ({
      ...prev,
      proposal: {
        ...prev.proposal,
        questions: prev.proposal.questions.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmitBid = async () => {
    if (!bidForm.amount || !bidForm.proposal.content.trim()) return;

    setIsSubmitting(true);
    try {
      // Here you would submit the bid to your API
      console.log('Submitting bid:', bidForm);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - close form and show success message
      setShowBidForm(false);
      // You might want to show a success toast here
    } catch (error) {
      console.error('Error submitting bid:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatBudget = (job: JobPosting): string => {
    if (job.budget.min === job.budget.max) {
      return `${job.budget.min} ${job.budget.currency}`;
    }
    return `${job.budget.min}-${job.budget.max} ${job.budget.currency}`;
  };

  const formatTimeline = (job: JobPosting): string => {
    return `${job.timeline.duration} ${job.timeline.unit}`;
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

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Job not found</h1>
          <NeonButton variant="primary" onClick={() => navigate('/jobs')} className="mt-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </NeonButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <NeonButton
            variant="secondary"
            size="sm"
            onClick={() => navigate('/jobs')}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </NeonButton>
        </div>

        <div className="lg:flex lg:space-x-8">
          {/* Main Content */}
          <div className="lg:flex-1">
            {/* Job Header */}
            <GlassmorphicCard className="p-6 mb-6" opacity={0.2}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[job.priority]}`}>
                      {job.priority}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">{job.category}</span>
                    {job.subcategory && (
                      <>
                        <span>•</span>
                        <span>{job.subcategory}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>Posted {getTimeAgo(job.createdAt)}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <DollarSign className="w-5 h-5" />
                      <span className="font-semibold text-lg">{formatBudget(job)}</span>
                      {job.budget.type === 'hourly' && <span>/hour</span>}
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="w-5 h-5" />
                      <span>{formatTimeline(job)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-5 h-5" />
                      <span className="capitalize">{job.location.type}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{job.views} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{bids.length} proposals</span>
                    </div>
                    {job.timeline.deadline && (
                      <div className="flex items-center space-x-1 text-orange-600">
                        <Clock className="w-4 h-4" />
                        <span>Deadline: {job.timeline.deadline.toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={handleSaveJob}
                    className={`p-3 rounded-lg transition-colors ${
                      isSaved
                        ? 'text-purple-600 bg-purple-50 border border-purple-200'
                        : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50 border border-gray-200'
                    }`}
                  >
                    <BookmarkIcon className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                  <NeonButton
                    variant="primary"
                    onClick={() => setShowBidForm(true)}
                    className="px-6"
                  >
                    <Send className="w-4 h-4" />
                    Submit Proposal
                  </NeonButton>
                </div>
              </div>

              {job.skills.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Required Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map(skill => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </GlassmorphicCard>

            {/* Tab Navigation */}
            <div className="mb-6">
              <GlassmorphicCard className="p-1" opacity={0.2}>
                <div className="flex space-x-1">
                  {[
                    { id: 'description', label: 'Description', icon: FileText },
                    { id: 'bids', label: `Proposals (${bids.length})`, icon: Users },
                    { id: 'client', label: 'About Client', icon: Star }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </GlassmorphicCard>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'description' && (
                <motion.div
                  key="description"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <GlassmorphicCard className="p-6" opacity={0.2}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Project Description
                    </h3>
                    <div className="prose prose-purple max-w-none">
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {job.description}
                      </p>
                    </div>

                    {job.requirements.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-md font-semibold text-gray-900 mb-3">
                          Requirements
                        </h4>
                        <ul className="space-y-2">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-gray-700">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {job.qualifications.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-md font-semibold text-gray-900 mb-3">
                          Preferred Qualifications
                        </h4>
                        <ul className="space-y-2">
                          {job.qualifications.map((qual, index) => (
                            <li key={index} className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-gray-700">{qual}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {job.attachments.length > 0 && (
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-3">
                          Project Files
                        </h4>
                        <div className="space-y-2">
                          {job.attachments.map(attachment => (
                            <div
                              key={attachment.id}
                              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                              <FileText className="w-5 h-5 text-gray-600" />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{attachment.name}</p>
                                <p className="text-sm text-gray-600">
                                  {(attachment.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </GlassmorphicCard>
                </motion.div>
              )}

              {activeTab === 'bids' && (
                <motion.div
                  key="bids"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-4">
                    {bids.length === 0 ? (
                      <GlassmorphicCard className="p-12 text-center" opacity={0.2}>
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No proposals yet</h3>
                        <p className="text-gray-600 mb-4">
                          Be the first to submit a proposal for this job.
                        </p>
                        <NeonButton
                          variant="primary"
                          onClick={() => setShowBidForm(true)}
                        >
                          Submit First Proposal
                        </NeonButton>
                      </GlassmorphicCard>
                    ) : (
                      bids.map((bid, index) => (
                        <motion.div
                          key={bid.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <GlassmorphicCard className="p-6" opacity={0.2}>
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center overflow-hidden">
                                  {bid.freelancerProfile.avatar ? (
                                    <img
                                      src={bid.freelancerProfile.avatar}
                                      alt={bid.freelancerProfile.displayName}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-white font-semibold">
                                      {bid.freelancerProfile.displayName.charAt(0)}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">
                                    {bid.freelancerProfile.displayName}
                                  </h4>
                                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                                    <div className="flex items-center space-x-1">
                                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                      <span>{bid.freelancerProfile.rating}</span>
                                    </div>
                                    <span>•</span>
                                    <span>{bid.freelancerProfile.completedJobs} jobs completed</span>
                                    <span>•</span>
                                    <span>{bid.freelancerProfile.location}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-gray-900">
                                  {bid.amount} {bid.currency}
                                </p>
                                <p className="text-sm text-gray-600">
                                  in {bid.deliveryTime} days
                                </p>
                              </div>
                            </div>

                            <p className="text-gray-700 mb-4">{bid.proposal.content}</p>

                            {bid.proposal.timeline.milestones && bid.proposal.timeline.milestones.length > 0 && (
                              <div className="mb-4">
                                <h5 className="font-medium text-gray-900 mb-2">Project Milestones:</h5>
                                <div className="space-y-2">
                                  {bid.proposal.timeline.milestones.map((milestone, _idx) => (
                                    <div key={milestone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                      <div>
                                        <p className="font-medium">{milestone.title}</p>
                                        <p className="text-sm text-gray-600">{milestone.description}</p>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-medium">{milestone.amount} {bid.currency}</p>
                                        <p className="text-sm text-gray-600">
                                          {milestone.dueDate.toLocaleDateString()}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {bid.freelancerProfile.skills.length > 0 && (
                              <div className="mb-4">
                                <div className="flex flex-wrap gap-2">
                                  {bid.freelancerProfile.skills.slice(0, 6).map(skill => (
                                    <span
                                      key={skill}
                                      className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>Submitted {getTimeAgo(bid.createdAt)}</span>
                              <div className="flex items-center space-x-2">
                                <NeonButton variant="secondary" size="sm">
                                  <MessageCircle className="w-4 h-4" />
                                  Message
                                </NeonButton>
                                <NeonButton variant="primary" size="sm">
                                  View Profile
                                </NeonButton>
                              </div>
                            </div>
                          </GlassmorphicCard>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'client' && (
                <motion.div
                  key="client"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <GlassmorphicCard className="p-6" opacity={0.2}>
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xl">JS</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">John Smith</h3>
                        <div className="flex items-center space-x-3 text-sm text-gray-600 mb-2">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span>4.8 (23 reviews)</span>
                          </div>
                          <span>•</span>
                          <span>Member since 2023</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>San Francisco, CA</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">12</div>
                        <div className="text-sm text-gray-600">Jobs Posted</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">9</div>
                        <div className="text-sm text-gray-600">Jobs Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">$45.2K</div>
                        <div className="text-sm text-gray-600">Total Spent</div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Client Verification</h4>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-green-600">
                          <Shield className="w-5 h-5" />
                          <span>Identity Verified</span>
                        </div>
                        <div className="flex items-center space-x-2 text-green-600">
                          <Award className="w-5 h-5" />
                          <span>Payment Verified</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Recent Reviews</h4>
                      <div className="space-y-4">
                        {[
                          {
                            rating: 5,
                            comment: "Great client, clear requirements and fast communication.",
                            project: "Website Development",
                            date: "2 weeks ago"
                          },
                          {
                            rating: 4,
                            comment: "Professional and pays on time. Would work with again.",
                            project: "Mobile App Design",
                            date: "1 month ago"
                          }
                        ].map((review, index) => (
                          <div key={index} className="border-l-4 border-purple-200 pl-4">
                            <div className="flex items-center space-x-2 mb-1">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? 'text-yellow-500 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-medium">{review.project}</span>
                              <span className="text-sm text-gray-600">{review.date}</span>
                            </div>
                            <p className="text-gray-700 text-sm">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </GlassmorphicCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 mt-8 lg:mt-0">
            <div className="sticky top-8 space-y-6">
              {/* Quick Actions */}
              <GlassmorphicCard className="p-4" opacity={0.2}>
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <NeonButton
                    variant="primary"
                    onClick={() => setShowBidForm(true)}
                    className="w-full"
                  >
                    <Send className="w-4 h-4" />
                    Submit Proposal
                  </NeonButton>
                  <NeonButton variant="secondary" className="w-full">
                    <MessageCircle className="w-4 h-4" />
                    Contact Client
                  </NeonButton>
                  <button
                    onClick={handleSaveJob}
                    className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                      isSaved
                        ? 'border-purple-200 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-purple-200 text-gray-700'
                    }`}
                  >
                    <BookmarkIcon className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    <span>{isSaved ? 'Saved' : 'Save Job'}</span>
                  </button>
                </div>
              </GlassmorphicCard>

              {/* Job Stats */}
              <GlassmorphicCard className="p-4" opacity={0.2}>
                <h3 className="font-semibold text-gray-900 mb-4">Job Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Proposals</span>
                    <span className="font-medium">{bids.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Views</span>
                    <span className="font-medium">{job.views}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg. Bid</span>
                    <span className="font-medium">
                      {bids.length > 0 
                        ? `${Math.round(bids.reduce((sum, bid) => sum + bid.amount, 0) / bids.length)} ${job.budget.currency}`
                        : 'N/A'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      job.status === 'open' ? 'bg-green-100 text-green-800' :
                      job.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {job.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </GlassmorphicCard>

              {/* Similar Jobs */}
              <GlassmorphicCard className="p-4" opacity={0.2}>
                <h3 className="font-semibold text-gray-900 mb-4">Similar Jobs</h3>
                <div className="space-y-3">
                  {mockJobPostings
                    .filter(j => j.id !== job.id && j.category === job.category)
                    .slice(0, 3)
                    .map(similarJob => (
                      <div
                        key={similarJob.id}
                        className="p-3 border border-gray-200 rounded-lg hover:border-purple-200 transition-colors cursor-pointer"
                        onClick={() => navigate(`/jobs/${similarJob.id}`)}
                      >
                        <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                          {similarJob.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>{formatBudget(similarJob)}</span>
                          <span>{getTimeAgo(similarJob.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </GlassmorphicCard>
            </div>
          </div>
        </div>
      </div>

      {/* Bid Submission Modal */}
      <AnimatePresence>
        {showBidForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowBidForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Submit Your Proposal</h3>
                  <button
                    onClick={() => setShowBidForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Bid Amount */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Bid Amount *
                    </label>
                    <Input
                      type="number"
                      value={bidForm.amount}
                      onChange={(e) => setBidForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                      placeholder="Enter your bid amount"
                      min="0"
                      step="0.1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={bidForm.currency}
                      onChange={(e) => setBidForm(prev => ({ ...prev, currency: e.target.value as 'SOL' | 'USDC' }))}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="SOL">SOL</option>
                      <option value="USDC">USDC</option>
                    </select>
                  </div>
                </div>

                {/* Delivery Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Time *
                    </label>
                    <Input
                      type="number"
                      value={bidForm.deliveryTime}
                      onChange={(e) => setBidForm(prev => ({ ...prev, deliveryTime: parseInt(e.target.value) || 1 }))}
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Unit
                    </label>
                    <select
                      value={bidForm.proposal.timeline.unit}
                      onChange={(e) => setBidForm(prev => ({
                        ...prev,
                        proposal: {
                          ...prev.proposal,
                          timeline: {
                            ...prev.proposal.timeline,
                            unit: e.target.value as 'days' | 'weeks' | 'months'
                          }
                        }
                      }))}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                    </select>
                  </div>
                </div>

                {/* Proposal Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Proposal *
                  </label>
                  <textarea
                    value={bidForm.proposal.content}
                    onChange={(e) => setBidForm(prev => ({
                      ...prev,
                      proposal: { ...prev.proposal, content: e.target.value }
                    }))}
                    rows={6}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="Explain why you're the best fit for this project. Include your relevant experience, approach, and what makes your proposal unique..."
                    required
                  />
                </div>

                {/* Milestones */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Milestones (Optional)
                  </label>
                  
                  {bidForm.proposal.timeline.milestones.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {bidForm.proposal.timeline.milestones.map((milestone) => (
                        <div key={milestone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{milestone.title}</p>
                            <p className="text-sm text-gray-600">{milestone.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{milestone.amount} {bidForm.currency}</span>
                            <button
                              onClick={() => removeMilestone(milestone.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg">
                    <Input
                      placeholder="Milestone title"
                      value={newMilestone.title}
                      onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={newMilestone.amount}
                      onChange={(e) => setNewMilestone(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                    />
                    <Input
                      placeholder="Description"
                      value={newMilestone.description}
                      onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
                    />
                    <Input
                      type="date"
                      value={newMilestone.dueDate}
                      onChange={(e) => setNewMilestone(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                    <div className="md:col-span-2">
                      <NeonButton
                        variant="secondary"
                        size="sm"
                        onClick={addMilestone}
                        disabled={!newMilestone.title || newMilestone.amount <= 0}
                      >
                        <Plus className="w-4 h-4" />
                        Add Milestone
                      </NeonButton>
                    </div>
                  </div>
                </div>

                {/* Questions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Questions for Client (Optional)
                  </label>
                  
                  {bidForm.proposal.questions.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {bidForm.proposal.questions.map((question, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span>{question}</span>
                          <button
                            onClick={() => removeQuestion(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Input
                      placeholder="Ask a question about the project..."
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addQuestion()}
                      className="flex-1"
                    />
                    <NeonButton
                      variant="secondary"
                      size="sm"
                      onClick={addQuestion}
                      disabled={!newQuestion.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </NeonButton>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <p>You'll be able to edit your proposal until the client responds.</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <NeonButton
                      variant="secondary"
                      onClick={() => setShowBidForm(false)}
                    >
                      Cancel
                    </NeonButton>
                    <NeonButton
                      variant="primary"
                      onClick={handleSubmitBid}
                      disabled={isSubmitting || !bidForm.amount || !bidForm.proposal.content.trim()}
                      className="min-w-32"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Submitting...</span>
                        </div>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Proposal
                        </>
                      )}
                    </NeonButton>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
