import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Star, MapPin, DollarSign, Calendar, Filter } from 'lucide-react';
import { clsx } from 'clsx';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterSection {
  id: string;
  title: string;
  type: 'checkbox' | 'range' | 'select' | 'rating';
  options?: FilterOption[];
  min?: number;
  max?: number;
  value?: any;
}

interface FilterPanelProps {
  sections: FilterSection[];
  onFilterChange: (sectionId: string, value: any) => void;
  className?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  sections,
  onFilterChange,
  className
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.map(s => s.id))
  );
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const renderRatingFilter = () => (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((rating) => (
        <motion.label
          key={rating}
          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
          whileHover={{ x: 2 }}
        >
          <input type="checkbox" className="rounded border-gray-300" />
          <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={clsx(
                  'w-4 h-4',
                  i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                )}
              />
            ))}
            <span className="text-sm text-gray-600">& up</span>
          </div>
        </motion.label>
      ))}
    </div>
  );

  const renderPriceRange = () => (
    <div className="space-y-4">
      <div className="px-2">
        <input
          type="range"
          min={0}
          max={1000}
          value={priceRange[1]}
          onChange={(e) => {
            const newRange = [priceRange[0], parseInt(e.target.value)];
            setPriceRange(newRange);
            onFilterChange('price', newRange);
          }}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>${priceRange[0]}</span>
        <span>${priceRange[1]}+</span>
      </div>
    </div>
  );

  return (
    <div className={clsx('bg-white rounded-xl shadow-lg p-6', className)}>
      <div className="flex items-center space-x-2 mb-6">
        <Filter className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-lg text-gray-900">Filters</h3>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.id} className="border-b border-gray-200 pb-4 last:border-b-0">
            <motion.button
              onClick={() => toggleSection(section.id)}
              className="flex items-center justify-between w-full text-left"
              whileHover={{ x: 2 }}
            >
              <span className="font-medium text-gray-900">{section.title}</span>
              <motion.div
                animate={{ rotate: expandedSections.has(section.id) ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {expandedSections.has(section.id) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 overflow-hidden"
                >
                  {section.type === 'checkbox' && section.options && (
                    <div className="space-y-2">
                      {section.options.map((option) => (
                        <motion.label
                          key={option.id}
                          className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                          whileHover={{ x: 2 }}
                        >
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              onChange={(e) => onFilterChange(section.id, {
                                ...section.value,
                                [option.id]: e.target.checked
                              })}
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                          </div>
                          {option.count && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {option.count}
                            </span>
                          )}
                        </motion.label>
                      ))}
                    </div>
                  )}

                  {section.type === 'rating' && renderRatingFilter()}
                  {section.type === 'range' && renderPriceRange()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-300"
      >
        Apply Filters
      </motion.button>
    </div>
  );
};