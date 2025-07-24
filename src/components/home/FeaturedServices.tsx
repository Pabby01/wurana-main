import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Verified } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

const featuredServices = [
  {
    id: 1,
    title: "Custom Leather Handbags",
    artisan: {
      name: "Adunni Okafor",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      rating: 4.9,
      verified: true,
      location: "Lagos, Nigeria"
    },
    price: 0.5,
    currency: "SOL",
    image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
    deliveryTime: "3-5 days",
    category: "Fashion & Accessories",
    badges: 12
  },
  {
    id: 2,
    title: "Traditional Wood Carvings",
    artisan: {
      name: "Kwame Asante",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      rating: 4.8,
      verified: true,
      location: "Accra, Ghana"
    },
    price: 1.2,
    currency: "SOL",
    image: "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
    deliveryTime: "1-2 weeks",
    category: "Art & Crafts",
    badges: 8
  },
  {
    id: 3,
    title: "Handwoven Textiles",
    artisan: {
      name: "Fatima Al-Zahra",
      avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      rating: 5.0,
      verified: true,
      location: "Marrakech, Morocco"
    },
    price: 0.8,
    currency: "SOL",
    image: "https://images.pexels.com/photos/1350560/pexels-photo-1350560.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
    deliveryTime: "5-7 days",
    category: "Textiles",
    badges: 15
  },
  {
    id: 4,
    title: "Ceramic Pottery Set",
    artisan: {
      name: "Maria Santos",
      avatar: "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      rating: 4.7,
      verified: true,
      location: "São Paulo, Brazil"
    },
    price: 0.6,
    currency: "SOL",
    image: "https://images.pexels.com/photos/1350778/pexels-photo-1350778.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
    deliveryTime: "4-6 days",
    category: "Ceramics",
    badges: 10
  }
];

export const FeaturedServices: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Featured <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Services</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Discover exceptional craftsmanship from verified artisans around the world
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card hover className="overflow-hidden">
                <div className="relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-gray-700">
                    {service.category}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                    {service.title}
                  </h3>

                  <div className="flex items-center space-x-3">
                    <img
                      src={service.artisan.avatar}
                      alt={service.artisan.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1">
                        <span className="font-medium text-gray-900 truncate">
                          {service.artisan.name}
                        </span>
                        {service.artisan.verified && (
                          <Verified className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{service.artisan.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium text-gray-900">{service.artisan.rating}</span>
                      <span className="text-gray-500">({service.badges} badges)</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{service.deliveryTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Starting at</div>
                      <div className="font-bold text-lg text-gray-900">
                        {service.price} {service.currency}
                      </div>
                    </div>
                    <Button variant="primary" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button variant="outline" size="lg">
            View All Services
          </Button>
        </motion.div>
      </div>
    </section>
  );
};