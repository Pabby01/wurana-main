import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, List, Star, Clock, Bookmark, BookmarkCheck } from 'lucide-react';
import { NeonButton } from '../ui/NeonButton';
import { fetchGigs } from '../../services/api';
import { clsx } from 'clsx';
import { Card } from '../ui/Card';

// Define Service interface to match the expected structure
interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  seller: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
  };
  images: string[];
  tags: string[];
  deliveryTime: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

// Define the Gig interface based on API structure
interface GigFromAPI {
  id: string;
  title: string;
  description: string;
  rating: number;
  reviewCount: number;
  seller: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
  };
  images: string[];
  tags: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
  packages?: Array<{
    price: number;
    currency: string;
    deliveryTime: number;
  }>;
}

// Function to convert Gig to Service format
const convertGigToService = (gig: GigFromAPI): Service => ({
  id: gig.id,
  title: gig.title,
  description: gig.description,
  price: gig.packages?.[0]?.price || 0,
  currency: gig.packages?.[0]?.currency || 'SOL',
  rating: gig.rating,
  reviewCount: gig.reviewCount,
  seller: gig.seller,
  images: gig.images,
  tags: gig.tags,
  deliveryTime: gig.packages?.[0]?.deliveryTime || 0,
  category: gig.category,
  createdAt: gig.createdAt,
  updatedAt: gig.updatedAt
});

interface ServiceGridProps {
  searchTerm?: string;
  selectedCategory?: string;
  priceRange?: [number, number];
  sortBy?: 'price' | 'rating' | 'newest' | 'popular';
}

// Map component sortBy values to API sortBy values
const mapSortByToAPI = (sortBy: string): 'price' | 'rating' | 'deliveryTime' | 'createdAt' => {
  switch (sortBy) {
    case 'newest':
      return 'createdAt';
    case 'popular':
      return 'rating';
    case 'price':
      return 'price';
    case 'rating':
      return 'rating';
    default:
      return 'createdAt';
  }
};

export const ServiceGrid: React.FC<ServiceGridProps> = ({
  searchTerm = '',
  selectedCategory = '',
  priceRange,
  sortBy = 'newest'
}) => {
  const [gigs, setGigs] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [savedGigs, setSavedGigs] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadGigs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const filters = {
          search: searchTerm,
          category: selectedCategory,
          minPrice: priceRange?.[0],
          maxPrice: priceRange?.[1],
          sortBy: mapSortByToAPI(sortBy),
          page: currentPage,
          limit: 12
        };

        const response = await fetchGigs(filters);
        
        // Extract the data from the API response and convert gigs to services
        const services = response.data.gigs.map(convertGigToService);
        setGigs(services);
        setTotalPages(response.data.totalPages);
        setTotal(response.data.total);
        
      } catch (err) {
        console.error('Error fetching gigs:', err);
        setError('Failed to load services. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadGigs();
  }, [searchTerm, selectedCategory, priceRange, sortBy, currentPage]);

  const toggleSaveGig = (gigId: string) => {
    setSavedGigs(prev => 
      prev.includes(gigId) 
        ? prev.filter(id => id !== gigId)
        : [...prev, gigId]
    );
  };

  const formatPrice = (price: number, currency: string) => {
    return `${price} ${currency}`;
  };

  const getDeliveryText = (days: number) => {
    if (days === 1) return '1 day delivery';
    if (days < 7) return `${days} days delivery`;
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} delivery`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <NeonButton 
          onClick={() => window.location.reload()}
          variant="primary"
        >
          Try Again
        </NeonButton>
      </div>
    );
  }

  if (gigs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">No services found matching your criteria.</div>
        <p className="text-gray-400">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Toggle and Results Count */}
      <div className="flex items-center justify-between">
        <div className="text-gray-600">
          Showing {gigs.length} of {total} services
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={clsx(
              'p-2 rounded-lg transition-colors',
              viewMode === 'grid' 
                ? 'bg-purple-100 text-purple-600' 
                : 'text-gray-400 hover:text-gray-600'
            )}
            aria-label="Grid view"
            title="Grid view"
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={clsx(
              'p-2 rounded-lg transition-colors',
              viewMode === 'list' 
                ? 'bg-purple-100 text-purple-600' 
                : 'text-gray-400 hover:text-gray-600'
            )}
            aria-label="List view"
            title="List view"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Services Grid/List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={clsx(
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          )}
        >
          {gigs.map((service) => (
            <motion.div
              key={service.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                className={clsx(
                  'group hover:shadow-lg transition-all duration-300 cursor-pointer',
                  viewMode === 'list' && 'flex flex-row'
                )}
                hover
              >
                {/* Service Image */}
                <div className={clsx(
                  'relative overflow-hidden',
                  viewMode === 'grid' ? 'h-48' : 'w-48 h-32',
                  viewMode === 'grid' ? 'rounded-t-lg' : 'rounded-l-lg'
                )}>
                  {service.images.length > 0 ? (
                    <img
                      src={service.images[0]}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                      <div className="text-purple-400 text-4xl">🎨</div>
                    </div>
                  )}
                  
                  {/* Save Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveGig(service.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
                    aria-label={savedGigs.includes(service.id) ? 'Remove from saved' : 'Save service'}
                    title={savedGigs.includes(service.id) ? 'Remove from saved' : 'Save service'}
                  >
                    {savedGigs.includes(service.id) ? (
                      <BookmarkCheck className="w-4 h-4 text-purple-600" />
                    ) : (
                      <Bookmark className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>

                {/* Service Content */}
                <div className="p-4 flex-1">
                  {/* Seller Info */}
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden">
                      {service.seller.avatar ? (
                        <img
                          src={service.seller.avatar}
                          alt={service.seller.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            {service.seller.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">{service.seller.name}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">{service.seller.rating}</span>
                    </div>
                  </div>

                  {/* Service Title */}
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {service.title}
                  </h3>

                  {/* Service Description */}
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {service.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {service.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-full">
                        +{service.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Service Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{service.rating}</span>
                      <span>({service.reviewCount})</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{getDeliveryText(service.deliveryTime)}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-gray-900">
                      From {formatPrice(service.price, service.currency)}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <NeonButton
            variant="secondary"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </NeonButton>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={clsx(
                    'px-3 py-1 rounded-lg text-sm transition-colors',
                    currentPage === page
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <NeonButton
            variant="secondary"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </NeonButton>
        </div>
      )}
    </div>
  );
};