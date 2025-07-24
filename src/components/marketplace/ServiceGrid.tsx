import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, List, Star, MapPin, Clock, Bookmark, BookmarkCheck } from 'lucide-react';
import { Card } from '../ui/Card';
import { NeonButton } from '../ui/NeonButton';
import { FilterPanel } from '../ui/FilterPanel';
import { clsx } from 'clsx';

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  artisan: {
    name: string;
    avatar: string;
    rating: number;
    location: string;
  };
  image: string;
  category: string;
  deliveryTime: string;
  badges: number;
}

const mockServices: Service[] = [
  {
    id: '1',
    title: 'Custom Leather Handbags',
    description: 'Handcrafted leather bags with traditional techniques',
    price: 0.5,
    currency: 'SOL',
    artisan: {
      name: 'Adunni Okafor',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      rating: 4.9,
      location: 'Lagos, Nigeria'
    },
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    category: 'Fashion',
    deliveryTime: '3-5 days',
    badges: 12
  },
  {
    id: '2',
    title: 'Handcrafted Wooden Furniture',
    description: 'Handcrafted wooden furniture with traditional techniques',
    price: 70,
    currency: 'USDC',
    artisan: {
      name: 'Aluko Oluwafemi',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      rating: 4.9,
      location: 'Ibadan, Nigeria'
    },
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    category: 'Woodworking',
    deliveryTime: '15-25 days',
    badges: 12
  },
  {
    id: '3',
    title: 'Custom Leather Handbags',
    description: 'Handcrafted leather bags with traditional techniques',
    price: 0.5,
    currency: 'SOL',
    artisan: {
      name: 'Adunni Okafor',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      rating: 4.9,
      location: 'Lagos, Nigeria'
    },
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    category: 'Fashion',
    deliveryTime: '3-5 days',
    badges: 12
  },
  {
    id: '1',
    title: 'Custom Leather Handbags',
    description: 'Handcrafted leather bags with traditional techniques',
    price: 0.5,
    currency: 'SOL',
    artisan: {
      name: 'Adunni Okafor',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      rating: 4.9,
      location: 'Lagos, Nigeria'
    },
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    category: 'Fashion',
    deliveryTime: '3-5 days',
    badges: 12
  },
  {
    id: '1',
    title: 'Custom Leather Handbags',
    description: 'Handcrafted leather bags with traditional techniques',
    price: 0.5,
    currency: 'SOL',
    artisan: {
      name: 'Adunni Okafor',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      rating: 4.9,
      location: 'Lagos, Nigeria'
    },
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    category: 'Fashion',
    deliveryTime: '3-5 days',
    badges: 12
  },
  {
    id: '1',
    title: 'Custom Leather Handbags',
    description: 'Handcrafted leather bags with traditional techniques',
    price: 0.5,
    currency: 'SOL',
    artisan: {
      name: 'Adunni Okafor',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      rating: 4.9,
      location: 'Lagos, Nigeria'
    },
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    category: 'Fashion',
    deliveryTime: '3-5 days',
    badges: 12
  },
  {
    id: '1',
    title: 'Custom Leather Handbags',
    description: 'Handcrafted leather bags with traditional techniques',
    price: 0.5,
    currency: 'SOL',
    artisan: {
      name: 'Adunni Okafor',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      rating: 4.9,
      location: 'Lagos, Nigeria'
    },
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    category: 'Fashion',
    deliveryTime: '3-5 days',
    badges: 12
  },
  // Add more mock services...
];

const filterSections = [
  {
    id: 'category',
    title: 'Category',
    type: 'checkbox' as const,
    options: [
      { id: 'fashion', label: 'Fashion & Accessories', count: 234 },
      { id: 'art', label: 'Art & Design', count: 189 },
      { id: 'woodwork', label: 'Woodworking', count: 156 },
      { id: 'textiles', label: 'Textiles', count: 143 }
    ]
  },
  {
    id: 'experience',
    title: 'Experience Level',
    type: 'checkbox' as const,
    options: [
      { id: 'junior', label: 'Junior (0-2 years)', count: 89 },
      { id: 'mid', label: 'Mid-level (2-5 years)', count: 156 },
      { id: 'senior', label: 'Senior (5+ years)', count: 234 }
    ]
  },
  {
    id: 'rating',
    title: 'Rating',
    type: 'rating' as const
  },
  {
    id: 'price',
    title: 'Price Range',
    type: 'range' as const,
    min: 0,
    max: 1000
  }
];

interface ServiceGridProps {
  className?: string;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({ className }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [savedServices, setSavedServices] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({});

  const toggleSaveService = (serviceId: string) => {
    const newSaved = new Set(savedServices);
    if (newSaved.has(serviceId)) {
      newSaved.delete(serviceId);
    } else {
      newSaved.add(serviceId);
    }
    setSavedServices(newSaved);
  };

  const handleFilterChange = (sectionId: string, value: unknown) => {
    setFilters({ ...filters, [sectionId]: value });
  };

  const ServiceCard: React.FC<{ service: Service; isListView?: boolean }> = ({ 
    service, 
    isListView = false 
  }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className={clsx(
        isListView ? 'w-full' : 'w-full'
      )}
    >
      <Card hover className={clsx(
        'overflow-hidden cursor-pointer',
        isListView ? 'flex' : 'block'
      )}>
        <div className={clsx(
          'relative',
          isListView ? 'w-48 flex-shrink-0' : 'w-full'
        )}>
          <img
            src={service.image}
            alt={service.title}
            className={clsx(
              'object-cover',
              isListView ? 'w-full h-32' : 'w-full h-48'
            )}
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveService(service.id);
            }}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
          >
            {savedServices.has(service.id) ? (
              <BookmarkCheck className="w-4 h-4 text-purple-600" />
            ) : (
              <Bookmark className="w-4 h-4 text-gray-600" />
            )}
          </motion.button>
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-gray-700">
            {service.category}
          </div>
        </div>

        <div className={clsx(
          'p-6 space-y-4',
          isListView ? 'flex-1' : 'w-full'
        )}>
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
            {service.title}
          </h3>

          {isListView && (
            <p className="text-gray-600 text-sm line-clamp-2">
              {service.description}
            </p>
          )}

          <div className="flex items-center space-x-3">
            <img
              src={service.artisan.avatar}
              alt={service.artisan.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate text-sm">
                {service.artisan.name}
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{service.artisan.location}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-medium text-gray-900 text-sm">{service.artisan.rating}</span>
              <span className="text-gray-500 text-sm">({service.badges})</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{service.deliveryTime}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              <div className="text-xs text-gray-500">Starting at</div>
              <div className="font-bold text-lg text-gray-900">
                {service.price} {service.currency}
              </div>
            </div>
            <NeonButton variant="primary" size="sm">
              View Details
            </NeonButton>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className={clsx('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8', className)}>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-80 flex-shrink-0 mt-7">
          <FilterPanel
            sections={filterSections}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Controls */}
          <div className="flex items-center justify-between mt-9 mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                Showing {mockServices.length} services
              </span>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('grid')}
                className={clsx(
                  'p-2 rounded-lg transition-colors',
                  viewMode === 'grid'
                    ? 'bg-purple-100 text-purple-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                )}
              >
                <Grid className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('list')}
                className={clsx(
                  'p-2 rounded-lg transition-colors',
                  viewMode === 'list'
                    ? 'bg-purple-100 text-purple-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                )}
              >
                <List className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Services Grid/List */}
          <motion.div
            layout
            className={clsx(
              'gap-6',
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                : 'flex flex-col space-y-4'
            )}
          >
            <AnimatePresence>
              {mockServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isListView={viewMode === 'list'}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Load More */}
          <div className="text-center mt-12">
            <NeonButton variant="secondary" size="lg">
              Load More Services
            </NeonButton>
          </div>
        </div>
      </div>
    </div>
  );
};