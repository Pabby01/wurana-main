
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Heart, 
  Share, 
  Clock, 
  RefreshCw, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  User,
  MessageSquare,
  Shield,
  Award,
  ThumbsUp,
  ChevronDown,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { NeonButton } from '../../components/ui/NeonButton';
import { GlassmorphicCard } from '../../components/ui/GlassmorphicCard';
import { Gig, GigPackage } from '../../types/gig';

// Mock data
const MOCK_GIG: Gig = {
  id: '1',
  userId: 'seller1',
  title: 'I will create a modern, professional logo design for your business',
  description: `Looking for a stunning logo that perfectly represents your brand? You've come to the right place!

**What you'll get:**
• Custom logo design tailored to your brand
• Multiple concepts to choose from  
• High-resolution files in various formats
• Commercial usage rights
• Fast delivery and unlimited revisions

**My Process:**
1. **Discovery**: We'll discuss your brand, target audience, and design preferences
2. **Concept Creation**: I'll create 3-5 initial concepts based on our discussion
3. **Refinement**: We'll work together to perfect your chosen design
4. **Final Delivery**: You'll receive all files in the formats you need

I have over 5 years of experience in graphic design and have helped 500+ businesses create memorable brands. My designs are modern, versatile, and timeless.

**Why choose me?**
✅ 100% original designs
✅ Fast 24-48 hour delivery
✅ Unlimited revisions until you're happy
✅ Professional communication
✅ Money-back guarantee

Ready to elevate your brand? Let's create something amazing together!`,
  category: 'graphics-design',
  subcategory: 'Logo Design',
  tags: ['logo', 'branding', 'design', 'business', 'modern'],
  images: [],
  videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  status: 'active',
  packages: [
    {
      id: 'pkg1',
      name: 'basic',
      type: 'basic',
      title: 'Basic Logo Package',
      description: 'Perfect for startups and small businesses',
      price: 0.15,
      currency: 'SOL',
      deliveryTime: 2,
      revisions: 3,
      features: [
        '1 custom logo concept',
        '3 revisions included',
        'High-resolution PNG & JPG',
        'Basic brand guidelines',
        'Commercial usage rights'
      ],
      isActive: true
    },
    {
      id: 'pkg2',
      name: 'standard',
      type: 'standard',
      title: 'Professional Logo Package',
      description: 'Most popular choice for growing businesses',
      price: 0.35,
      currency: 'SOL',
      deliveryTime: 3,
      revisions: 5,
      features: [
        '3 custom logo concepts',
        '5 revisions included',
        'All file formats (PNG, JPG, SVG, PDF)',
        'Complete brand guidelines',
        'Social media kit',
        'Vector source files',
        'Commercial usage rights'
      ],
      isActive: true
    },
    {
      id: 'pkg3',
      name: 'premium',
      type: 'premium',
      title: 'Complete Brand Identity',
      description: 'Everything you need for a complete rebrand',
      price: 0.75,
      currency: 'SOL',
      deliveryTime: 7,
      revisions: 10,
      features: [
        '5 custom logo concepts',
        '10 revisions included',
        'All file formats + source files',
        'Complete brand guidelines',
        'Business card design',
        'Letterhead design',
        'Social media templates',
        'Brand style guide',
        'Express 24-hour delivery',
        'Commercial usage rights'
      ],
      isActive: true
    }
  ],
  extras: [
    {
      id: 'extra1',
      name: 'express-delivery',
      description: 'Get your logo in 24 hours',
      price: 0.05,
      currency: 'SOL',
      deliveryTime: -1,
      isActive: true
    },
    {
      id: 'extra2',
      name: 'business-card',
      description: 'Matching business card design',
      price: 0.08,
      currency: 'SOL',
      deliveryTime: 1,
      isActive: true
    },
    {
      id: 'extra3',
      name: 'social-media-kit',
      description: 'Logo variations for social media',
      price: 0.12,
      currency: 'SOL',
      deliveryTime: 2,
      isActive: true
    }
  ],
  faq: [
    {
      id: 'faq1',
      question: 'What do you need from me to get started?',
      answer: 'I\'ll need your business name, a brief description of your business/industry, your target audience, any color preferences, and examples of logos you like or dislike.',
      order: 0
    },
    {
      id: 'faq2',
      question: 'Do you provide the source files?',
      answer: 'Yes! With the Standard and Premium packages, you\'ll receive vector source files (AI/EPS) that allow you to edit and resize your logo without quality loss.',
      order: 1
    },
    {
      id: 'faq3',
      question: 'How many revisions do I get?',
      answer: 'Basic: 3 revisions, Standard: 5 revisions, Premium: 10 revisions. Additional revisions can be purchased if needed.',
      order: 2
    },
    {
      id: 'faq4',
      question: 'Can I use the logo for commercial purposes?',
      answer: 'Absolutely! All packages include full commercial usage rights. You own the logo once the project is complete.',
      order: 3
    },
    {
      id: 'faq5',
      question: 'What if I\'m not satisfied with the design?',
      answer: 'I offer unlimited revisions within the package limits and a money-back guarantee if you\'re not completely satisfied.',
      order: 4
    }
  ],
  requirements: ['Business name and description', 'Industry/niche information', 'Target audience details', 'Color preferences (if any)', 'Style preferences or inspiration'],
  deliverables: ['High-resolution logo files', 'Vector source files', 'Brand guidelines', 'Usage instructions'],
  keywords: ['logo', 'design', 'branding', 'business', 'professional', 'modern', 'creative'],
  rating: 4.9,
  totalOrders: 156,
  totalEarnings: 45.2,
  impressions: 12450,
  clicks: 890,
  conversionRate: 7.2,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-20')
};

const MOCK_REVIEWS = [
  {
    id: 'rev1',
    jobId: 'job1',
    reviewerId: 'buyer1',
    revieweeId: 'seller1',
    reviewer: {
      name: 'Sarah Johnson',
      avatar: '',
      country: 'United States'
    },
    rating: 5,
    comment: 'Absolutely amazing work! The designer understood exactly what I wanted and delivered beyond my expectations. The logo is perfect for my bakery business. Highly recommended!',
    createdAt: new Date('2024-02-10'),
    helpful: 15
  },
  {
    id: 'rev2',
    jobId: 'job2',
    reviewerId: 'buyer2',
    revieweeId: 'seller1',
    reviewer: {
      name: 'Michael Chen',
      avatar: '',
      country: 'Canada'
    },
    rating: 5,
    comment: 'Professional, fast, and creative. Got multiple concepts to choose from and the revisions were handled quickly. The final logo looks fantastic on our website and business cards.',
    createdAt: new Date('2024-02-05'),
    helpful: 12
  },
  {
    id: 'rev3',
    jobId: 'job3',
    reviewerId: 'buyer3',
    revieweeId: 'seller1',
    reviewer: {
      name: 'Emma Rodriguez',
      avatar: '',
      country: 'Spain'
    },
    rating: 4,
    comment: 'Great communication and beautiful design. Took a couple extra revisions to get it just right, but the seller was patient and professional throughout the process.',
    createdAt: new Date('2024-01-28'),
    helpful: 8
  },
  {
    id: 'rev4',
    jobId: 'job4',
    reviewerId: 'buyer4',
    revieweeId: 'seller1',
    reviewer: {
      name: 'David Kim',
      avatar: '',
      country: 'South Korea'
    },
    rating: 5,
    comment: 'Exceptional work! The logo perfectly captures our brand identity. The designer provided great suggestions and delivered high-quality files. Will definitely work with them again.',
    createdAt: new Date('2024-01-20'),
    helpful: 10
  }
];

const SELLER_INFO = {
  id: 'seller1',
  name: 'Alex Rivera',
  title: 'Professional Logo & Brand Designer',
  avatar: '',
  rating: 4.9,
  totalReviews: 156,
  level: 'Top Rated Seller',
  responseTime: '1 hour',
  lastDelivery: '1 day',
  memberSince: new Date('2020-03-15'),
  location: 'United States',
  languages: ['English', 'Spanish'],
  description: 'Professional graphic designer with 8+ years of experience. Specialized in logo design, branding, and visual identity. Helped 500+ businesses create memorable brands.',
  skills: ['Logo Design', 'Brand Identity', 'Graphic Design', 'Adobe Illustrator', 'Photoshop'],
  badges: ['Top Rated', 'Fast Delivery', 'Excellent Communication']
};

export const GigDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [selectedPackage, setSelectedPackage] = useState<GigPackage>(MOCK_GIG.packages[1]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  
  // Mock images for gallery
  const mockImages = [
    'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2339&q=80'
  ];

  const toggleExtra = (extraId: string) => {
    setSelectedExtras(prev => 
      prev.includes(extraId)
        ? prev.filter(id => id !== extraId)
        : [...prev, extraId]
    );
  };

  const calculateTotalPrice = () => {
    const packagePrice = selectedPackage.price;
    const extrasPrice = selectedExtras.reduce((total, extraId) => {
      const extra = MOCK_GIG.extras.find(e => e.id === extraId);
      return total + (extra?.price || 0);
    }, 0);
    return packagePrice + extrasPrice;
  };

  const calculateTotalDeliveryTime = () => {
    const packageTime = selectedPackage.deliveryTime;
    const extrasTime = selectedExtras.reduce((total, extraId) => {
      const extra = MOCK_GIG.extras.find(e => e.id === extraId);
      if (extra?.deliveryTime === -1) return total; // Express delivery doesn't add time
      return total + (extra?.deliveryTime || 0);
    }, 0);
    return packageTime + extrasTime;
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: MOCK_GIG.title,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Show toast notification
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % mockImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + mockImages.length) % mockImages.length);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-white/70 mb-6">
          <button 
            onClick={() => navigate('/marketplace')} 
            className="hover:text-white"
            aria-label="Go to marketplace"
            title="Go to marketplace"
          >
            Marketplace
          </button>
          <span>/</span>
          <button 
            onClick={() => navigate('/marketplace?category=graphics-design')} 
            className="hover:text-white"
            aria-label="Go to Graphics & Design category"
            title="Go to Graphics & Design category"
          >
            Graphics & Design
          </button>
          <span>/</span>
          <span className="text-white">Logo Design</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <GlassmorphicCard className="overflow-hidden">
              <div className="relative">
                <div className="aspect-video bg-gradient-to-r from-purple-600 to-blue-600">
                  {mockImages.length > 0 ? (
                    <img
                      src={mockImages[currentImageIndex]}
                      alt="Gig showcase"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🎨</div>
                        <p>Portfolio examples coming soon</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Gallery Navigation */}
                {mockImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                      aria-label="Previous image"
                      title="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                      aria-label="Next image"
                      title="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Dots indicator */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {mockImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                          title={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Actions */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-2 rounded-full transition-colors ${
                      isLiked 
                        ? 'bg-red-500 text-white' 
                        : 'bg-black/50 text-white hover:bg-black/70'
                    }`}
                    aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
                    title={isLiked ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                    aria-label="Share this gig"
                    title="Share this gig"
                  >
                    <Share className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Thumbnail strip */}
              {mockImages.length > 1 && (
                <div className="p-4 flex space-x-3 overflow-x-auto">
                  {mockImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex ? 'border-purple-400' : 'border-transparent'
                      }`}
                      aria-label={`View image ${index + 1}`}
                      title={`View image ${index + 1}`}
                    >
                      <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </GlassmorphicCard>

            {/* Gig Title and Info */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">{MOCK_GIG.title}</h1>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(MOCK_GIG.rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-white font-semibold">{MOCK_GIG.rating}</span>
                  <span className="ml-1 text-white/70">({MOCK_GIG.totalOrders} reviews)</span>
                </div>
                
                <div className="text-white/70">
                  {MOCK_GIG.totalOrders} orders in queue
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {MOCK_GIG.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-white/80 text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Seller Info Card */}
            <GlassmorphicCard className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white">{SELLER_INFO.name}</h3>
                  <p className="text-white/70">{SELLER_INFO.title}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-white font-semibold">{SELLER_INFO.rating}</span>
                      <span className="text-white/70 ml-1">({SELLER_INFO.totalReviews})</span>
                    </div>
                    <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-green-400 text-xs">
                      {SELLER_INFO.level}
                    </span>
                  </div>
                </div>
                <NeonButton
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/sellers/${SELLER_INFO.id}`)}
                >
                  View Profile
                </NeonButton>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
                <div className="text-center">
                  <p className="text-white/70 text-sm">Response Time</p>
                  <p className="text-white font-semibold">{SELLER_INFO.responseTime}</p>
                </div>
                <div className="text-center">
                  <p className="text-white/70 text-sm">Last Delivery</p>
                  <p className="text-white font-semibold">{SELLER_INFO.lastDelivery}</p>
                </div>
                <div className="text-center">
                  <p className="text-white/70 text-sm">Orders in Queue</p>
                  <p className="text-white font-semibold">{MOCK_GIG.totalOrders}</p>
                </div>
              </div>
            </GlassmorphicCard>

            {/* Description */}
            <GlassmorphicCard className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">About This Gig</h2>
              <div className="text-white/80 whitespace-pre-line leading-relaxed">
                {showFullDescription 
                  ? MOCK_GIG.description 
                  : MOCK_GIG.description.substring(0, 500) + (MOCK_GIG.description.length > 500 ? '...' : '')
                }
              </div>
              {MOCK_GIG.description.length > 500 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-3 text-purple-400 hover:text-purple-300 font-medium flex items-center"
                  aria-label={showFullDescription ? 'Show less description' : 'Show more description'}
                  title={showFullDescription ? 'Show less description' : 'Show more description'}
                >
                  {showFullDescription ? 'Show less' : 'Show more'}
                  <ChevronDown className={`w-4 h-4 ml-1 transform transition-transform ${showFullDescription ? 'rotate-180' : ''}`} />
                </button>
              )}
            </GlassmorphicCard>

            {/* FAQ Section */}
            <GlassmorphicCard className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {MOCK_GIG.faq.map((faq) => (
                  <div key={faq.id} className="border border-white/20 rounded-lg">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                      aria-label={`Toggle FAQ: ${faq.question}`}
                      title={`Toggle FAQ: ${faq.question}`}
                    >
                      <span className="text-white font-medium">{faq.question}</span>
                      <ChevronDown className={`w-5 h-5 text-white transition-transform ${
                        expandedFAQ === faq.id ? 'rotate-180' : ''
                      }`} />
                    </button>
                    <AnimatePresence>
                      {expandedFAQ === faq.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-4 pb-4"
                        >
                          <p className="text-white/70">{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </GlassmorphicCard>

            {/* Reviews */}
            <GlassmorphicCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Reviews ({MOCK_REVIEWS.length})</h2>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                  <span className="text-white font-semibold">{MOCK_GIG.rating}</span>
                  <span className="text-white/70 ml-1">({SELLER_INFO.totalReviews} reviews)</span>
                </div>
              </div>

              <div className="space-y-6">
                {MOCK_REVIEWS.map((review) => (
                  <div key={review.id} className="border-b border-white/20 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-white">{review.reviewer.name}</h4>
                          <span className="text-white/70 text-sm">{review.reviewer.country}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-white/80 mb-3">{review.comment}</p>
                        <div className="flex items-center space-x-4 text-sm text-white/70">
                          <span>{formatDate(review.createdAt)}</span>
                          <button 
                            className="flex items-center hover:text-white"
                            aria-label={`Mark review as helpful (${review.helpful} people found this helpful)`}
                            title={`Mark review as helpful (${review.helpful} people found this helpful)`}
                          >
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            Helpful ({review.helpful})
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-6">
                <button 
                  className="text-purple-400 hover:text-purple-300 font-medium"
                  aria-label="See all reviews"
                  title="See all reviews"
                >
                  See all reviews
                </button>
              </div>
            </GlassmorphicCard>
          </div>

          {/* Sidebar - Package Selection */}
          <div className="space-y-6 sticky top-8">
            {/* Package Selector */}
            <GlassmorphicCard className="p-6">
              {/* Package Tabs */}
              <div className="flex border-b border-white/20 mb-6">
                {MOCK_GIG.packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`flex-1 py-3 text-center font-medium transition-colors ${
                      selectedPackage.id === pkg.id
                        ? 'text-white border-b-2 border-purple-400'
                        : 'text-white/70 hover:text-white'
                    }`}
                    aria-label={`Select ${pkg.type} package`}
                    title={`Select ${pkg.type} package`}
                  >
                    {pkg.type.charAt(0).toUpperCase() + pkg.type.slice(1)}
                  </button>
                ))}
              </div>

              {/* Selected Package Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">{selectedPackage.title}</h3>
                <p className="text-white/70 text-sm mb-4">{selectedPackage.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-white">
                    {selectedPackage.price} {selectedPackage.currency}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-white/70">
                      <Clock className="w-4 h-4 mr-1" />
                      {calculateTotalDeliveryTime()} days
                    </div>
                    <div className="flex items-center text-white/70 mt-1">
                      <RefreshCw className="w-4 h-4 mr-1" />
                      {selectedPackage.revisions} revisions
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-2 mb-6">
                  {selectedPackage.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-white/80 text-sm">
                      <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Extras */}
              {MOCK_GIG.extras.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Add Extra Services</h4>
                  <div className="space-y-3">
                    {MOCK_GIG.extras.map((extra) => (
                      <div
                        key={extra.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedExtras.includes(extra.id)
                            ? 'border-purple-400 bg-purple-500/10'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                        onClick={() => toggleExtra(extra.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedExtras.includes(extra.id)}
                                onChange={() => toggleExtra(extra.id)}
                                className="mr-2 rounded border-white/30 bg-transparent"
                                aria-label={`Add ${extra.name} extra service`}
                              />
                              <span className="text-white text-sm font-medium">{extra.name}</span>
                            </div>
                            <p className="text-white/70 text-xs mt-1">{extra.description}</p>
                          </div>
                          <div className="text-right ml-3">
                            <div className="text-white font-semibold">+{extra.price} {extra.currency}</div>
                            {extra.deliveryTime > 0 && (
                              <div className="text-white/70 text-xs">+{extra.deliveryTime} days</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total and CTA */}
              <div className="border-t border-white/20 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white font-semibold">Total:</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">
                      {calculateTotalPrice().toFixed(3)} {selectedPackage.currency}
                    </div>
                    <div className="text-white/70 text-sm">
                      {calculateTotalDeliveryTime()} days delivery
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <NeonButton
                    className="w-full"
                    onClick={() => navigate(`/checkout/gig/${id}?package=${selectedPackage.id}&extras=${selectedExtras.join(',')}`)}
                  >
                    Continue ({calculateTotalPrice().toFixed(3)} {selectedPackage.currency})
                  </NeonButton>
                  
                  <button className="w-full py-3 border border-white/30 text-white rounded-lg hover:bg-white/5 transition-colors">
                    Compare Packages
                  </button>
                </div>
              </div>
            </GlassmorphicCard>

            {/* Contact Seller */}
            <GlassmorphicCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Contact Seller</h3>
              <div className="space-y-3">
                <NeonButton
                  variant="secondary"
                  className="w-full"
                  onClick={() => navigate(`/chat?user=${SELLER_INFO.id}`)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message Seller
                </NeonButton>
                <div className="text-center">
                  <p className="text-white/70 text-sm">Usually responds in {SELLER_INFO.responseTime}</p>
                </div>
              </div>
            </GlassmorphicCard>

            {/* Trust & Safety */}
            <GlassmorphicCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Trust & Safety</h3>
              <div className="space-y-3 text-sm text-white/70">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-green-400" />
                  Verified seller
                </div>
                <div className="flex items-center">
                  <Award className="w-4 h-4 mr-2 text-yellow-400" />
                  Top rated seller
                </div>
                <div className="flex items-center">
                  <RefreshCw className="w-4 h-4 mr-2 text-blue-400" />
                  Money-back guarantee
                </div>
              </div>
            </GlassmorphicCard>
          </div>
        </div>
      </div>
    </div>
  );
};