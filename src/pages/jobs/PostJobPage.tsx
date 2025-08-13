import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, DollarSign, Calendar, MapPin, FileText, Upload, X, Plus,
  Clock, Star, Shield, Eye, Users, Tag, AlertCircle
} from 'lucide-react';
import { GlassmorphicCard } from '../../components/ui/GlassmorphicCard';
import { NeonButton } from '../../components/ui/NeonButton';
import { Input } from '../../components/ui/Input';
import { JobAttachment } from '../../types';
import { jobCategories, skillsList, countries } from '../../data/mockData';

interface JobFormData {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  budget: {
    min: number;
    max: number;
    currency: 'SOL' | 'USDC';
    type: 'fixed' | 'hourly';
  };
  timeline: {
    duration: number;
    unit: 'days' | 'weeks' | 'months';
    deadline?: Date;
  };
  location: {
    type: 'remote' | 'onsite' | 'hybrid';
    city?: string;
    country?: string;
  };
  requirements: string[];
  skills: string[];
  qualifications: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  visibility: 'public' | 'private' | 'invited_only';
}

const subcategoriesByCategory: Record<string, string[]> = {
  'Web Development': ['Frontend', 'Backend', 'Full Stack', 'WordPress', 'E-commerce'],
  'Mobile Development': ['iOS', 'Android', 'React Native', 'Flutter', 'Cross-platform'],
  'UI/UX Design': ['UI Design', 'UX Research', 'Prototyping', 'Mobile Design', 'Web Design'],
  'Blockchain Development': ['Smart Contracts', 'DeFi', 'NFTs', 'Web3', 'Token Development'],
  'Content Writing': ['Blog Writing', 'Technical Writing', 'Copywriting', 'SEO Writing', 'Social Media'],
  'Digital Marketing': ['SEO', 'SEM', 'Social Media', 'Email Marketing', 'Content Marketing']
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
};

const priorityIcons = {
  low: Clock,
  medium: Clock,
  high: AlertCircle,
  urgent: AlertCircle
};

export const PostJobPage: React.FC = () => {
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    budget: {
      min: 0,
      max: 0,
      currency: 'SOL',
      type: 'fixed'
    },
    timeline: {
      duration: 1,
      unit: 'weeks'
    },
    location: {
      type: 'remote'
    },
    requirements: [],
    skills: [],
    qualifications: [],
    priority: 'medium',
    visibility: 'public'
  });

  const [attachments, setAttachments] = useState<JobAttachment[]>([]);
  const [newRequirement, setNewRequirement] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newQualification, setNewQualification] = useState('');
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, title: 'Basic Info', icon: FileText },
    { id: 2, title: 'Budget & Timeline', icon: DollarSign },
    { id: 3, title: 'Requirements', icon: Star },
    { id: 4, title: 'Review & Publish', icon: Eye }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const attachment: JobAttachment = {
          id: `att-${Date.now()}-${Math.random()}`,
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type,
          size: file.size,
          uploadedAt: new Date()
        };
        setAttachments(prev => [...prev, attachment]);
      });
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const addRequirement = () => {
    if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  const removeRequirement = (requirement: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(r => r !== requirement)
    }));
  };

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
    setNewSkill('');
    setShowSkillSuggestions(false);
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addQualification = () => {
    if (newQualification.trim() && !formData.qualifications.includes(newQualification.trim())) {
      setFormData(prev => ({
        ...prev,
        qualifications: [...prev.qualifications, newQualification.trim()]
      }));
      setNewQualification('');
    }
  };

  const removeQualification = (qualification: string) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter(q => q !== qualification)
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Here you would submit the job posting to your API
      console.log('Submitting job:', formData, attachments);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      // Redirect to job listing or show success message
    } catch (error) {
      console.error('Error posting job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Post a New Job
          </h1>
          <p className="text-gray-600">
            Find the perfect freelancer for your project
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <GlassmorphicCard className="p-4" opacity={0.2}>
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        currentStep >= step.id
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      <step.icon className="w-5 h-5" />
                    </div>
                    <div className="ml-3">
                      <p className={`font-medium ${
                        currentStep >= step.id ? 'text-purple-600' : 'text-gray-600'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-px mx-4 ${
                      currentStep > step.id ? 'bg-purple-600' : 'bg-gray-300'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </GlassmorphicCard>
        </div>

        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GlassmorphicCard className="p-6" opacity={0.2}>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Basic Information
                </h2>
                
                <div className="space-y-6">
                  <Input
                    label="Job Title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Modern E-commerce Website Development"
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={6}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      placeholder="Describe your project in detail, including specific requirements, deliverables, and expectations..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          category: e.target.value,
                          subcategory: '' // Reset subcategory
                        }))}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        required
                      >
                        <option value="">Select category</option>
                        {jobCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subcategory
                      </label>
                      <select
                        value={formData.subcategory}
                        onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        disabled={!formData.category || !subcategoriesByCategory[formData.category]}
                      >
                        <option value="">Select subcategory</option>
                        {formData.category && subcategoriesByCategory[formData.category]?.map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority Level
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(priorityColors).map(([priority]) => {
                          const IconComponent = priorityIcons[priority as keyof typeof priorityIcons];
                          return (
                            <button
                              key={priority}
                              onClick={() => setFormData(prev => ({ ...prev, priority: priority as JobFormData['priority'] }))}
                              className={`p-3 rounded-lg border transition-all duration-200 ${
                                formData.priority === priority
                                  ? 'border-purple-500 bg-purple-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              aria-label={`Set priority to ${priority}`}
                              title={`Set priority to ${priority}`}
                            >
                              <div className="flex items-center space-x-2">
                                <IconComponent className="w-4 h-4" />
                                <span className="font-medium capitalize">{priority}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Visibility
                      </label>
                      <div className="space-y-2">
                        {[
                          { value: 'public', label: 'Public', icon: Users, desc: 'Visible to all freelancers' },
                          { value: 'private', label: 'Private', icon: Shield, desc: 'Only invited freelancers' },
                          { value: 'invited_only', label: 'Invite Only', icon: Tag, desc: 'Handpicked freelancers' }
                        ].map(option => (
                          <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              value={option.value}
                              checked={formData.visibility === option.value}
                              onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value as JobFormData['visibility'] }))}
                              className="text-purple-600"
                            />
                            <option.icon className="w-4 h-4 text-gray-600" />
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-sm text-gray-600">{option.desc}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* File Attachments */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Files (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-purple-500 transition-colors">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">Click to upload files or drag and drop</p>
                          <p className="text-sm text-gray-500 mt-1">
                            PDF, DOC, images up to 10MB each
                          </p>
                        </div>
                      </label>
                    </div>

                    {attachments.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {attachments.map(attachment => (
                          <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <FileText className="w-5 h-5 text-gray-600" />
                              <div>
                                <p className="font-medium">{attachment.name}</p>
                                <p className="text-sm text-gray-600">{formatFileSize(attachment.size)}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeAttachment(attachment.id)}
                              className="text-red-600 hover:text-red-700"
                              aria-label={`Remove ${attachment.name}`}
                              title={`Remove ${attachment.name}`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </GlassmorphicCard>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GlassmorphicCard className="p-6" opacity={0.2}>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Budget & Timeline
                </h2>

                <div className="space-y-6">
                  {/* Budget Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Type *
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center space-x-3 cursor-pointer p-4 border rounded-lg hover:border-purple-500 transition-colors">
                        <input
                          type="radio"
                          value="fixed"
                          checked={formData.budget.type === 'fixed'}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            budget: { ...prev.budget, type: e.target.value as 'fixed' | 'hourly' }
                          }))}
                          className="text-purple-600"
                        />
                        <div>
                          <div className="font-medium">Fixed Price</div>
                          <div className="text-sm text-gray-600">One-time payment for the entire project</div>
                        </div>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer p-4 border rounded-lg hover:border-purple-500 transition-colors">
                        <input
                          type="radio"
                          value="hourly"
                          checked={formData.budget.type === 'hourly'}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            budget: { ...prev.budget, type: e.target.value as 'fixed' | 'hourly' }
                          }))}
                          className="text-purple-600"
                        />
                        <div>
                          <div className="font-medium">Hourly Rate</div>
                          <div className="text-sm text-gray-600">Pay based on time worked</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Budget Range */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {formData.budget.type === 'hourly' ? 'Min Rate' : 'Min Budget'} *
                      </label>
                      <Input
                        type="number"
                        value={formData.budget.min}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          budget: { ...prev.budget, min: parseFloat(e.target.value) || 0 }
                        }))}
                        placeholder="0"
                        min="0"
                        step="0.1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {formData.budget.type === 'hourly' ? 'Max Rate' : 'Max Budget'} *
                      </label>
                      <Input
                        type="number"
                        value={formData.budget.max}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          budget: { ...prev.budget, max: parseFloat(e.target.value) || 0 }
                        }))}
                        placeholder="0"
                        min={formData.budget.min.toString()}
                        step="0.1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency *
                      </label>
                      <select
                        value={formData.budget.currency}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          budget: { ...prev.budget, currency: e.target.value as 'SOL' | 'USDC' }
                        }))}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        required
                      >
                        <option value="SOL">SOL</option>
                        <option value="USDC">USDC</option>
                      </select>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Duration *
                      </label>
                      <Input
                        type="number"
                        value={formData.timeline.duration}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          timeline: { ...prev.timeline, duration: parseInt(e.target.value) || 1 }
                        }))}
                        min="1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time Unit *
                      </label>
                      <select
                        value={formData.timeline.unit}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          timeline: { ...prev.timeline, unit: e.target.value as 'days' | 'weeks' | 'months' }
                        }))}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        required
                      >
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Deadline (Optional)
                    </label>
                    <Input
                      type="datetime-local"
                      value={formData.timeline.deadline?.toISOString().slice(0, 16) || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        timeline: { ...prev.timeline, deadline: e.target.value ? new Date(e.target.value) : undefined }
                      }))}
                    />
                  </div>

                  {/* Location Preferences */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Work Location *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { value: 'remote', label: 'Remote', desc: 'Work from anywhere' },
                        { value: 'onsite', label: 'On-site', desc: 'Work from specific location' },
                        { value: 'hybrid', label: 'Hybrid', desc: 'Mix of remote and on-site' }
                      ].map(option => (
                        <label key={option.value} className="flex items-start space-x-3 cursor-pointer p-4 border rounded-lg hover:border-purple-500 transition-colors">
                          <input
                            type="radio"
                            value={option.value}
                            checked={formData.location.type === option.value}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              location: { ...prev.location, type: e.target.value as JobFormData['location']['type'] }
                            }))}
                            className="mt-1 text-purple-600"
                          />
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-sm text-gray-600">{option.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {formData.location.type !== 'remote' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="City"
                        value={formData.location.city || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          location: { ...prev.location, city: e.target.value }
                        }))}
                        placeholder="e.g., San Francisco"
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <select
                          value={formData.location.country || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            location: { ...prev.location, country: e.target.value }
                          }))}
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        >
                          <option value="">Select country</option>
                          {countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </GlassmorphicCard>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GlassmorphicCard className="p-6" opacity={0.2}>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Requirements & Skills
                </h2>

                <div className="space-y-6">
                  {/* Required Skills */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Required Skills
                    </label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {formData.skills.map(skill => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border border-purple-200"
                        >
                          {skill}
                          <button
                            onClick={() => removeSkill(skill)}
                            className="ml-2 text-purple-500 hover:text-purple-700"
                            aria-label={`Remove ${skill} skill`}
                            title={`Remove ${skill} skill`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="relative">
                      <Input
                        placeholder="Add a required skill..."
                        value={newSkill}
                        onChange={(e) => {
                          setNewSkill(e.target.value);
                          setShowSkillSuggestions(e.target.value.length > 0);
                        }}
                        onKeyPress={(e) => e.key === 'Enter' && addSkill(newSkill)}
                      />
                      {showSkillSuggestions && newSkill && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                          {skillsList
                            .filter(skill =>
                              skill.toLowerCase().includes(newSkill.toLowerCase()) &&
                              !formData.skills.includes(skill)
                            )
                            .map(skill => (
                              <button
                                key={skill}
                                onClick={() => addSkill(skill)}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                              >
                                {skill}
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Project Requirements */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Requirements
                    </label>
                    <div className="space-y-2 mb-4">
                      {formData.requirements.map((req, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span>{req}</span>
                          <button
                            onClick={() => removeRequirement(req)}
                            className="text-red-600 hover:text-red-700"
                            aria-label={`Remove requirement: ${req}`}
                            title={`Remove requirement: ${req}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a project requirement..."
                        value={newRequirement}
                        onChange={(e) => setNewRequirement(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                        className="flex-1"
                      />
                      <NeonButton
                        variant="secondary"
                        size="sm"
                        onClick={addRequirement}
                        aria-label="Add requirement"
                        title="Add requirement"
                      >
                        <Plus className="w-4 h-4" />
                      </NeonButton>
                    </div>
                  </div>

                  {/* Qualifications */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Qualifications
                    </label>
                    <div className="space-y-2 mb-4">
                      {formData.qualifications.map((qual, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span>{qual}</span>
                          <button
                            onClick={() => removeQualification(qual)}
                            className="text-red-600 hover:text-red-700"
                            aria-label={`Remove qualification: ${qual}`}
                            title={`Remove qualification: ${qual}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a preferred qualification..."
                        value={newQualification}
                        onChange={(e) => setNewQualification(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addQualification()}
                        className="flex-1"
                      />
                      <NeonButton
                        variant="secondary"
                        size="sm"
                        onClick={addQualification}
                        aria-label="Add qualification"
                        title="Add qualification"
                      >
                        <Plus className="w-4 h-4" />
                      </NeonButton>
                    </div>
                  </div>
                </div>
              </GlassmorphicCard>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GlassmorphicCard className="p-6" opacity={0.2}>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Review & Publish
                </h2>

                <div className="space-y-6">
                  {/* Job Preview */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{formData.title}</h3>
                        <p className="text-gray-600">{formData.category} {formData.subcategory && `• ${formData.subcategory}`}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[formData.priority]}`}>
                        {formData.priority}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-4">{formData.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-gray-600" />
                        <span>
                          {formData.budget.min}-{formData.budget.max} {formData.budget.currency}
                          {formData.budget.type === 'hourly' ? '/hour' : ''}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span>{formData.timeline.duration} {formData.timeline.unit}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-600" />
                        <span className="capitalize">{formData.location.type}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4 text-gray-600" />
                        <span className="capitalize">{formData.visibility}</span>
                      </div>
                    </div>

                    {formData.skills.length > 0 && (
                      <div className="mb-4">
                        <p className="font-medium text-gray-900 mb-2">Required Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.skills.map(skill => (
                            <span key={skill} className="px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.requirements.length > 0 && (
                      <div>
                        <p className="font-medium text-gray-900 mb-2">Requirements:</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                          {formData.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Submit Actions */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <p className="font-medium text-yellow-800">Ready to publish?</p>
                    </div>
                    <p className="text-yellow-700 text-sm">
                      Your job will be visible to freelancers based on your visibility settings. 
                      You can edit or close the job at any time after publishing.
                    </p>
                  </div>
                </div>
              </GlassmorphicCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <NeonButton
            variant="secondary"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}
          >
            Previous
          </NeonButton>

          {currentStep < 4 ? (
            <NeonButton
              variant="primary"
              onClick={nextStep}
              disabled={
                (currentStep === 1 && (!formData.title || !formData.description || !formData.category)) ||
                (currentStep === 2 && (formData.budget.min <= 0 || formData.budget.max <= 0 || formData.budget.max < formData.budget.min))
              }
            >
              Next
            </NeonButton>
          ) : (
            <NeonButton
              variant="accent"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="min-w-32"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Publishing...</span>
                </div>
              ) : (
                <>
                  <Briefcase className="w-4 h-4" />
                  Publish Job
                </>
              )}
            </NeonButton>
          )}
        </div>
      </div>
    </div>
  );
};