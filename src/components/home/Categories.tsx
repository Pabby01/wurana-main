import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Scissors, Hammer, Shirt, Home, Gift, Camera, Music } from 'lucide-react';
import { Card } from '../ui/Card';

const categories = [
  {
    icon: Palette,
    name: "Art & Design",
    count: 1250,
    color: "from-pink-500 to-rose-500",
    description: "Paintings, illustrations, digital art"
  },
  {
    icon: Scissors,
    name: "Fashion & Accessories",
    count: 890,
    color: "from-purple-500 to-indigo-500",
    description: "Clothing, jewelry, handbags"
  },
  {
    icon: Hammer,
    name: "Woodworking",
    count: 650,
    color: "from-amber-500 to-orange-500",
    description: "Furniture, carvings, decorative items"
  },
  {
    icon: Shirt,
    name: "Textiles",
    count: 720,
    color: "from-teal-500 to-cyan-500",
    description: "Weaving, embroidery, traditional fabrics"
  },
  {
    icon: Home,
    name: "Home Decor",
    count: 540,
    color: "from-green-500 to-emerald-500",
    description: "Ceramics, pottery, home accessories"
  },
  {
    icon: Gift,
    name: "Handmade Gifts",
    count: 430,
    color: "from-red-500 to-pink-500",
    description: "Custom gifts, personalized items"
  },
  {
    icon: Camera,
    name: "Photography",
    count: 380,
    color: "from-blue-500 to-indigo-500",
    description: "Portrait, event, product photography"
  },
  {
    icon: Music,
    name: "Music & Audio",
    count: 290,
    color: "from-violet-500 to-purple-500",
    description: "Instrument making, audio production"
  }
];

export const Categories: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Explore <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Categories</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Discover talented artisans across diverse creative disciplines
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card hover className="p-6 text-center space-y-4 cursor-pointer group">
                <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-purple-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {category.description}
                  </p>
                  <div className="text-sm font-medium text-purple-600">
                    {category.count.toLocaleString()} services
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <button className="text-purple-600 font-semibold hover:text-purple-700 transition-colors">
            View All Categories →
          </button>
        </motion.div>
      </div>
    </section>
  );
};