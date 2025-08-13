import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  X, 
  Plus, 
  Minus, 
  Eye, 
  Save,
  Check,
  Tag,
  Image as ImageIcon,
  Video,
  Package,
  HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NeonButton } from '../../components/ui/NeonButton';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { GlassmorphicCard } from '../../components/ui/GlassmorphicCard';
import { CreateGigData, GigPackage, GigExtra, GigFAQ } from '../../types/gig';

const CATEGORIES = [
  { id: 'graphics-design', name: 'Graphics & Design', subcategories: ['Logo Design', 'Web Design', 'Illustration', 'Print Design'] },
  { id: 'digital-marketing', name: 'Digital Marketing', subcategories: ['Social Media', 'SEO', 'Content Marketing', 'Email Marketing'] },
  { id: 'writing-translation', name: 'Writing & Translation', subcategories: ['Content Writing', 'Copywriting', 'Translation', 'Proofreading'] },
  { id: 'video-animation', name: 'Video & Animation', subcategories: ['Video Editing', 'Animation', '3D Modeling', 'Motion Graphics'] },
  { id: 'programming-tech', name: 'Programming & Tech', subcategories: ['Web Development', 'Mobile Apps', 'Desktop Apps', 'Blockchain'] },
  { id: 'business', name: 'Business', subcategories: ['Business Plans', 'Market Research', 'Presentations', 'Legal Consulting'] }
];

const STEPS = [
  { id: 1, name: 'Overview', description: 'Basic gig information' },
  { id: 2, name: 'Pricing', description: 'Packages and pricing' },
  { id: 3, name: 'Description & FAQ', description: 'Detailed description' },
  { id: 4, name: 'Requirements', description: 'What you need from buyers' },
  { id: 5, name: 'Gallery', description: 'Images and videos' },
  { id: 6, name: 'Publish', description: 'Review and publish' }
];

export const CreateGigPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<CreateGigData>({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    tags: [],
    images: [],
    videoUrl: '',
    packages: [
      {
        name: 'basic',
        type: 'basic',
        title: '',
        description: '',
        price: 0,
        currency: 'SOL',
        deliveryTime: 1,
        revisions: 1,
        features: ['']
      },
      {
        name: 'standard',
        type: 'standard',
        title: '',
        description: '',
        price: 0,
        currency: 'SOL',
        deliveryTime: 3,
        revisions: 2,
        features: ['']
      },
      {
        name: 'premium',
        type: 'premium',
        title: '',
        description: '',
        price: 0,
        currency: 'SOL',
        deliveryTime: 7,
        revisions: 3,
        features: ['']
      }
    ],
    extras: [],
    faq: [],
    requirements: [''],
    deliverables: [''],
    keywords: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.subcategory) newErrors.subcategory = 'Subcategory is required';
        if (formData.tags.length === 0) newErrors.tags = 'At least one tag is required';
        break;
      case 2:
        if (!formData.packages[0].title.trim()) newErrors.basicTitle = 'Basic package title is required';
        if (formData.packages[0].price <= 0) newErrors.basicPrice = 'Basic package price must be greater than 0';
        break;
      case 3:
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        break;
      case 5:
        if (formData.images.length === 0) newErrors.images = 'At least one image is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    // Show success message
  };

  const handlePublish = async () => {
    if (STEPS.every((_, index) => validateStep(index + 1))) {
      setIsSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSaving(false);
      navigate('/gigs/manage');
    }
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim()) && formData.tags.length < 5) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag.trim()] }));
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      tags: prev.tags.filter((_, i) => i !== index) 
    }));
  };

  const updatePackage = (index: number, field: keyof GigPackage, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.map((pkg, i) => 
        i === index ? { ...pkg, [field]: value } : pkg
      )
    }));
  };

  const addExtra = () => {
    const newExtra: Omit<GigExtra, 'id' | 'isActive'> = {
      name: '',
      description: '',
      price: 0,
      currency: 'SOL',
      deliveryTime: 1
    };
    setFormData(prev => ({ ...prev, extras: [...prev.extras, newExtra] }));
  };

  const updateExtra = (index: number, field: keyof GigExtra, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      extras: prev.extras.map((extra, i) => 
        i === index ? { ...extra, [field]: value } : extra
      )
    }));
  };

  const removeExtra = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      extras: prev.extras.filter((_, i) => i !== index) 
    }));
  };

  const addFAQ = () => {
    const newFAQ: Omit<GigFAQ, 'id'> = {
      question: '',
      answer: '',
      order: formData.faq.length
    };
    setFormData(prev => ({ ...prev, faq: [...prev.faq, newFAQ] }));
  };

  const updateFAQ = (index: number, field: keyof GigFAQ, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      faq: prev.faq.map((faq, i) => 
        i === index ? { ...faq, [field]: value } : faq
      )
    }));
  };

  const removeFAQ = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      faq: prev.faq.filter((_, i) => i !== index) 
    }));
  };

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files).slice(0, 5 - formData.images.length);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      images: prev.images.filter((_, i) => i !== index) 
    }));
  };

  const selectedCategory = CATEGORIES.find(cat => cat.id === formData.category);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Overview
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Gig Overview</h3>
              <div className="space-y-4">
                <Input
                  label="Gig Title"
                  placeholder="I will create a professional logo design..."
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  error={errors.title}
                  className="bg-white/10 border-white/20 text-white placeholder-white/60"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value, subcategory: '' }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="">Select a category</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id} className="text-gray-900">{cat.name}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Subcategory</label>
                    <select
                      value={formData.subcategory}
                      onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                      disabled={!selectedCategory}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:opacity-50"
                    >
                      <option value="">Select a subcategory</option>
                      {selectedCategory?.subcategories.map(sub => (
                        <option key={sub} value={sub} className="text-gray-900">{sub}</option>
                      ))}
                    </select>
                    {errors.subcategory && <p className="text-red-400 text-sm mt-1">{errors.subcategory}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Tags (up to 5)</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-purple-500/20 border border-purple-500/30 px-3 py-1 rounded-full text-white text-sm flex items-center gap-2"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                        <button
                          onClick={() => removeTag(index)}
                          className="hover:text-red-400 transition-colors"
                          aria-label={`Remove ${tag} tag`}
                          title={`Remove ${tag} tag`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.span>
                    ))}
                  </div>
                  <Input
                    placeholder="Type a tag and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                    className="bg-white/10 border-white/20 text-white placeholder-white/60"
                  />
                  {errors.tags && <p className="text-red-400 text-sm mt-1">{errors.tags}</p>}
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Pricing
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Pricing & Packages</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {formData.packages.map((pkg) => (
                <Card key={pkg.type} className="bg-white/10 border-white/20 p-6" gradient>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-white capitalize">{pkg.type}</h4>
                      <Package className="w-5 h-5 text-purple-400" />
                    </div>
                    
                    <Input
                      label="Package Title"
                      value={pkg.title}
                      onChange={(e) => updatePackage(formData.packages.indexOf(pkg), 'title', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-white/60"
                      error={pkg.type === 'basic' ? errors.basicTitle : undefined}
                    />
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Price"
                        type="number"
                        value={pkg.price}
                        onChange={(e) => updatePackage(formData.packages.indexOf(pkg), 'price', parseFloat(e.target.value) || 0)}
                        className="bg-white/10 border-white/20 text-white"
                        error={pkg.type === 'basic' ? errors.basicPrice : undefined}
                      />
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">Currency</label>
                        <select
                          value={pkg.currency}
                          onChange={(e) => updatePackage(formData.packages.indexOf(pkg), 'currency', e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                        >
                          <option value="SOL" className="text-gray-900">SOL</option>
                          <option value="USDC" className="text-gray-900">USDC</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Delivery Days"
                        type="number"
                        value={pkg.deliveryTime}
                        onChange={(e) => updatePackage(formData.packages.indexOf(pkg), 'deliveryTime', parseInt(e.target.value) || 1)}
                        className="bg-white/10 border-white/20 text-white"
                      />
                      <Input
                        label="Revisions"
                        type="number"
                        value={pkg.revisions}
                        onChange={(e) => updatePackage(formData.packages.indexOf(pkg), 'revisions', parseInt(e.target.value) || 1)}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">Features</label>
                      {pkg.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 mb-2">
                          <Input
                            value={feature}
                            onChange={(e) => {
                              const newFeatures = [...pkg.features];
                              newFeatures[featureIndex] = e.target.value;
                              updatePackage(formData.packages.indexOf(pkg), 'features', newFeatures);
                            }}
                            className="bg-white/10 border-white/20 text-white placeholder-white/60 flex-1"
                            placeholder="Feature description"
                          />
                          {pkg.features.length > 1 && (
                            <button
                              onClick={() => {
                                const newFeatures = pkg.features.filter((_, i) => i !== featureIndex);
                                updatePackage(formData.packages.indexOf(pkg), 'features', newFeatures);
                              }}
                              className="text-red-400 hover:text-red-300"
                              aria-label="Remove feature"
                              title="Remove feature"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => updatePackage(formData.packages.indexOf(pkg), 'features', [...pkg.features, ''])}
                        className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-sm"
                        aria-label="Add feature"
                        title="Add feature"
                      >
                        <Plus className="w-4 h-4" />
                        Add feature
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Gig Extras */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white">Gig Extras</h4>
                <NeonButton
                  variant="secondary"
                  size="sm"
                  onClick={addExtra}
                  aria-label="Add extra service"
                  title="Add extra service"
                >
                  <Plus className="w-4 h-4" />
                  Add Extra
                </NeonButton>
              </div>
              
              {formData.extras.map((extra, index) => (
                <Card key={index} className="bg-white/10 border-white/20 p-4 mb-4" gradient>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input
                      label="Extra Name"
                      value={extra.name}
                      onChange={(e) => updateExtra(index, 'name', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-white/60"
                    />
                    <Input
                      label="Price"
                      type="number"
                      value={extra.price}
                      onChange={(e) => updateExtra(index, 'price', parseFloat(e.target.value) || 0)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                    <Input
                      label="Extra Days"
                      type="number"
                      value={extra.deliveryTime}
                      onChange={(e) => updateExtra(index, 'deliveryTime', parseInt(e.target.value) || 1)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                    <div className="flex items-end">
                      <button
                        onClick={() => removeExtra(index)}
                        className="text-red-400 hover:text-red-300 p-2 rounded-lg bg-red-500/10 border border-red-500/20"
                        aria-label="Remove extra service"
                        title="Remove extra service"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Input
                      label="Description"
                      value={extra.description}
                      onChange={(e) => updateExtra(index, 'description', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-white/60"
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3: // Description & FAQ
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Description & FAQ</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-white/90 mb-2">Gig Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={10}
                  placeholder="Describe your service in detail. What will you deliver? What makes your service unique?"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                />
                {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">Frequently Asked Questions</h4>
                  <NeonButton
                    variant="secondary"
                    size="sm"
                    onClick={addFAQ}
                    aria-label="Add FAQ"
                    title="Add FAQ"
                  >
                    <Plus className="w-4 h-4" />
                    Add FAQ
                  </NeonButton>
                </div>
                
                {formData.faq.map((faq, index) => (
                  <Card key={index} className="bg-white/10 border-white/20 p-4 mb-4" gradient>
                    <div className="flex items-start justify-between mb-4">
                      <HelpCircle className="w-5 h-5 text-purple-400 mt-1" />
                      <button
                        onClick={() => removeFAQ(index)}
                        className="text-red-400 hover:text-red-300"
                        aria-label="Remove FAQ"
                        title="Remove FAQ"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <Input
                        label="Question"
                        value={faq.question}
                        onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-white/60"
                        placeholder="What question do buyers frequently ask?"
                      />
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">Answer</label>
                        <textarea
                          value={faq.answer}
                          onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                          rows={3}
                          placeholder="Provide a clear and helpful answer..."
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 4: // Requirements
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Buyer Requirements</h3>
              <p className="text-white/70 mb-6">Tell buyers what information or files you need to get started.</p>
              
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-white">Requirements</h4>
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={req}
                      onChange={(e) => {
                        const newReqs = [...formData.requirements];
                        newReqs[index] = e.target.value;
                        setFormData(prev => ({ ...prev, requirements: newReqs }));
                      }}
                      className="bg-white/10 border-white/20 text-white placeholder-white/60 flex-1"
                      placeholder="What do you need from the buyer?"
                    />
                    {formData.requirements.length > 1 && (
                      <button
                        onClick={() => {
                          const newReqs = formData.requirements.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, requirements: newReqs }));
                        }}
                        className="text-red-400 hover:text-red-300"
                        aria-label="Remove requirement"
                        title="Remove requirement"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setFormData(prev => ({ ...prev, requirements: [...prev.requirements, ''] }))}
                  className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  aria-label="Add requirement"
                  title="Add requirement"
                >
                  <Plus className="w-4 h-4" />
                  Add requirement
                </button>
              </div>

              <div className="space-y-4 mt-8">
                <h4 className="text-md font-semibold text-white">What will you deliver?</h4>
                {formData.deliverables.map((del, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={del}
                      onChange={(e) => {
                        const newDels = [...formData.deliverables];
                        newDels[index] = e.target.value;
                        setFormData(prev => ({ ...prev, deliverables: newDels }));
                      }}
                      className="bg-white/10 border-white/20 text-white placeholder-white/60 flex-1"
                      placeholder="What will you deliver to the buyer?"
                    />
                    {formData.deliverables.length > 1 && (
                      <button
                        onClick={() => {
                          const newDels = formData.deliverables.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, deliverables: newDels }));
                        }}
                        className="text-red-400 hover:text-red-300"
                        aria-label="Remove deliverable"
                        title="Remove deliverable"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setFormData(prev => ({ ...prev, deliverables: [...prev.deliverables, ''] }))}
                  className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  aria-label="Add deliverable"
                  title="Add deliverable"
                >
                  <Plus className="w-4 h-4" />
                  Add deliverable
                </button>
              </div>
            </div>
          </div>
        );

      case 5: // Gallery
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Gig Gallery</h3>
              <p className="text-white/70 mb-6">Add images and videos to showcase your work. First image will be your gig cover.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Images (up to 5)</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Gig image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label={`Remove image ${index + 1}`}
                          title={`Remove image ${index + 1}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-2 left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded">
                            Cover
                          </div>
                        )}
                      </div>
                    ))}
                    {formData.images.length < 5 && (
                      <label className="w-full h-32 border-2 border-dashed border-white/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition-colors">
                        <ImageIcon className="w-8 h-8 text-white/50 mb-2" />
                        <span className="text-white/70 text-sm">Add Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleImageUpload(e.target.files)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  {errors.images && <p className="text-red-400 text-sm mt-1">{errors.images}</p>}
                </div>

                <div>
                  <Input
                    label="Video URL (optional)"
                    icon={<Video className="w-4 h-4" />}
                    placeholder="https://youtube.com/watch?v=..."
                    value={formData.videoUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder-white/60"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 6: // Publish
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Review & Publish</h3>
              <div className="bg-white/10 border border-white/20 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-2">{formData.title}</h4>
                <p className="text-white/70 mb-4">{formData.category} › {formData.subcategory}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {formData.packages.filter(pkg => pkg.title.trim()).map((pkg) => (
                    <div key={pkg.type} className="bg-white/5 rounded-lg p-4">
                      <h5 className="font-semibold text-white capitalize mb-1">{pkg.type}</h5>
                      <p className="text-white/70 text-sm mb-2">{pkg.title}</p>
                      <p className="text-purple-400 font-semibold">{pkg.price} {pkg.currency}</p>
                      <p className="text-white/70 text-sm">{pkg.deliveryTime} days delivery</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-purple-500/20 border border-purple-500/30 px-2 py-1 rounded text-white/70 text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {formData.images.length > 0 && (
                  <div className="mb-4">
                    <p className="text-white/70 text-sm mb-2">{formData.images.length} image(s) uploaded</p>
                  </div>
                )}

                <div className="flex items-center text-green-400 mb-4">
                  <Check className="w-5 h-5 mr-2" />
                  <span>Ready to publish!</span>
                </div>

                <p className="text-white/70 text-sm">
                  Once published, your gig will be reviewed by our team and will be live within 24 hours.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isPreview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8">
        {/* Preview implementation would go here */}
        <div className="max-w-4xl mx-auto px-4">
          <Card className="p-8 bg-white">
            <h1>Gig Preview</h1>
            <button onClick={() => setIsPreview(false)} className="mt-4 text-purple-600">
              Back to Editor
            </button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/gigs/manage')}
            className="flex items-center text-white/70 hover:text-white mb-4 transition-colors"
            aria-label="Back to Gigs"
            title="Back to Gigs"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gigs
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">Create New Gig</h1>
          <p className="text-white/70">Follow the steps to create your perfect gig</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Progress Steps */}
          <div className="lg:col-span-1">
            <GlassmorphicCard className="p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-white mb-4">Progress</h3>
              <div className="space-y-4">
                {STEPS.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all cursor-pointer ${
                      currentStep === step.id
                        ? 'bg-purple-500/20 border border-purple-500/30'
                        : currentStep > step.id
                        ? 'bg-green-500/20 border border-green-500/30'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                    onClick={() => {
                      if (step.id < currentStep || validateStep(currentStep)) {
                        setCurrentStep(step.id);
                      }
                    }}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        currentStep === step.id
                          ? 'bg-purple-500 text-white'
                          : currentStep > step.id
                          ? 'bg-green-500 text-white'
                          : 'bg-white/10 text-white/70'
                      }`}
                    >
                      {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${
                        currentStep >= step.id ? 'text-white' : 'text-white/70'
                      }`}>
                        {step.name}
                      </p>
                      <p className="text-xs text-white/50">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/20">
                <NeonButton
                  variant="secondary"
                  size="sm"
                  onClick={handleSaveDraft}
                  loading={isSaving}
                  className="w-full mb-2"
                  aria-label="Save draft"
                  title="Save draft"
                >
                  <Save className="w-4 h-4" />
                  Save Draft
                </NeonButton>
                <button
                  onClick={() => setIsPreview(true)}
                  className="w-full text-white/70 hover:text-white text-sm flex items-center justify-center py-2"
                  aria-label="Preview gig"
                  title="Preview gig"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </button>
              </div>
            </GlassmorphicCard>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <GlassmorphicCard className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/20">
                <div>
                  {currentStep > 1 && (
                    <button
                      onClick={handlePrevious}
                      className="flex items-center text-white/70 hover:text-white transition-colors"
                      aria-label="Previous step"
                      title="Previous step"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </button>
                  )}
                </div>
                
                <div>
                  {currentStep < STEPS.length ? (
                    <NeonButton 
                      onClick={handleNext}
                      aria-label="Next step"
                      title="Next step"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </NeonButton>
                  ) : (
                    <NeonButton
                      onClick={handlePublish}
                      loading={isSaving}
                      variant="accent"
                      aria-label="Publish gig"
                      title="Publish gig"
                    >
                      Publish Gig
                    </NeonButton>
                  )}
                </div>
              </div>
            </GlassmorphicCard>
          </div>
        </div>
      </div>
    </div>
  );
};
