import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Filter,
  Calendar,
  User,
  MessageCircle,
  Flag,
  ChevronDown,
  BarChart3,
  TrendingUp,
  Award,
  Camera,
  Clock,
  ThumbsUp,
  Search,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { NeonButton } from "../../components/ui/NeonButton";
import { Input } from "../../components/ui/Input";
import { clsx } from "clsx";

interface Review {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  artisanId: string;
  artisanName: string;
  artisanAvatar: string;
  rating: number;
  comment: string;
  projectType: string;
  projectTitle: string;
  date: string;
  response?: string;
  responseDate?: string;
  images?: string[];
  helpful: number;
  verified: boolean;
  type: "received" | "given";
}

interface RatingDistribution {
  [key: number]: number;
}

const mockReviews: Review[] = [
  {
    id: "1",
    clientId: "client1",
    clientName: "Sarah Johnson",
    clientAvatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=40&h=40&fit=crop&crop=face",
    artisanId: "artisan1",
    artisanName: "Michael Chen",
    artisanAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    rating: 5,
    comment:
      "Absolutely incredible work! Michael transformed my living room into a masterpiece. His attention to detail and creativity exceeded all expectations. The project was completed on time and within budget.",
    projectType: "Interior Design",
    projectTitle: "Modern Living Room Makeover",
    date: "2024-01-15",
    response:
      "Thank you so much, Sarah! It was a pleasure working on your living room. I'm thrilled you love the final result!",
    responseDate: "2024-01-16",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=150&fit=crop",
    ],
    helpful: 12,
    verified: true,
    type: "received",
  },
  {
    id: "2",
    clientId: "client2",
    clientName: "David Rodriguez",
    clientAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    artisanId: "artisan1",
    artisanName: "Michael Chen",
    artisanAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    rating: 4,
    comment:
      "Great communication and professional work. The kitchen renovation looks amazing. Only minor delay in delivery but overall very satisfied.",
    projectType: "Kitchen Renovation",
    projectTitle: "Modern Kitchen Remodel",
    date: "2024-01-10",
    images: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=150&fit=crop",
    ],
    helpful: 8,
    verified: true,
    type: "received",
  },
  {
    id: "3",
    clientId: "client3",
    clientName: "Emily Watson",
    clientAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    artisanId: "artisan2",
    artisanName: "Lisa Thompson",
    artisanAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face",
    rating: 5,
    comment:
      "Lisa created the most beautiful custom furniture for my home office. Her craftsmanship is exceptional and she really understood my vision.",
    projectType: "Custom Furniture",
    projectTitle: "Home Office Setup",
    date: "2024-01-08",
    helpful: 15,
    verified: true,
    type: "given",
  },
  {
    id: "4",
    clientId: "client4",
    clientName: "James Wilson",
    clientAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
    artisanId: "artisan1",
    artisanName: "Michael Chen",
    artisanAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    rating: 3,
    comment:
      "Decent work but took longer than expected. The final result was good but communication could have been better throughout the project.",
    projectType: "Bathroom Renovation",
    projectTitle: "Master Bathroom Update",
    date: "2024-01-05",
    helpful: 3,
    verified: true,
    type: "received",
  },
];

export const ReviewsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"received" | "given">("received");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedProjectType, setSelectedProjectType] = useState<string | null>(
    null
  );
  const [sortBy, setSortBy] = useState<"date" | "rating">("date");
  const [searchTerm, setSearchTerm] = useState("");
  const [showResponseModal, setShowResponseModal] = useState<string | null>(
    null
  );
  const [responseText, setResponseText] = useState("");

  const filteredReviews = useMemo(() => {
    return mockReviews
      .filter((review) => {
        if (review.type !== activeTab) return false;
        if (selectedRating && review.rating !== selectedRating) return false;
        if (selectedProjectType && review.projectType !== selectedProjectType)
          return false;
        if (
          searchTerm &&
          !review.comment.toLowerCase().includes(searchTerm.toLowerCase())
        )
          return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "date") {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return b.rating - a.rating;
      });
  }, [activeTab, selectedRating, selectedProjectType, sortBy, searchTerm]);

  const receivedReviews = mockReviews.filter((r) => r.type === "received");
  const givenReviews = mockReviews.filter((r) => r.type === "given");

  const averageRating =
    receivedReviews.reduce((sum, review) => sum + review.rating, 0) /
    receivedReviews.length;

  const ratingDistribution: RatingDistribution = receivedReviews.reduce(
    (acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    },
    {} as RatingDistribution
  );

  const projectTypes = Array.from(
    new Set(mockReviews.map((r) => r.projectType))
  );

  const StarRating = ({
    rating,
    size = "sm",
  }: {
    rating: number;
    size?: "sm" | "md" | "lg";
  }) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={clsx(
              sizeClasses[size],
              i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
            )}
          />
        ))}
      </div>
    );
  };

  const RatingDistributionChart = () => (
    <Card className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <BarChart3 className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Rating Distribution
        </h3>
      </div>
      <div className="space-y-3">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingDistribution[rating] || 0;
          const percentage =
            receivedReviews.length > 0
              ? (count / receivedReviews.length) * 100
              : 0;

          return (
            <div key={rating} className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 w-16">
                <span className="text-sm font-medium">{rating}</span>
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: rating * 0.1 }}
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
                />
              </div>
              <span className="text-sm text-gray-600 w-8">{count}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );

  const ReviewCard = ({ review }: { review: Review }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4">
            <img
              src={
                activeTab === "received"
                  ? review.clientAvatar
                  : review.artisanAvatar
              }
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-semibold text-gray-900">
                  {activeTab === "received"
                    ? review.clientName
                    : review.artisanName}
                </h4>
                {review.verified && (
                  <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                    <Award className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3 mb-2">
                <StarRating rating={review.rating} />
                <span className="text-sm text-gray-500">
                  {review.projectType}
                </span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowResponseModal(review.id)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Flag className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <h5 className="font-medium text-gray-900 mb-2">
            {review.projectTitle}
          </h5>
          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
        </div>

        {review.images && review.images.length > 0 && (
          <div className="flex space-x-2 mb-4 overflow-x-auto">
            {review.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Project ${index + 1}`}
                className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
              />
            ))}
          </div>
        )}

        {review.response && (
          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <div className="flex items-center space-x-2 mb-2">
              <MessageCircle className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-900">
                Response from Artisan
              </span>
              <span className="text-xs text-gray-500">
                {review.responseDate}
              </span>
            </div>
            <p className="text-sm text-gray-700">{review.response}</p>
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
              <ThumbsUp className="w-4 h-4" />
              <span>Helpful ({review.helpful})</span>
            </button>
          </div>
          {activeTab === "received" && !review.response && (
            <NeonButton
              size="sm"
              onClick={() => setShowResponseModal(review.id)}
              className="text-xs"
            >
              Respond
            </NeonButton>
          )}
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 mt-16 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Reviews & Feedback
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Manage your reviews, respond to feedback, and track your reputation
          </p>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-3">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </h3>
              <p className="text-sm text-gray-600">Average Rating</p>
              <StarRating rating={Math.round(averageRating)} />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-3">
                <MessageCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {receivedReviews.length}
              </h3>
              <p className="text-sm text-gray-600">Reviews Received</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {givenReviews.length}
              </h3>
              <p className="text-sm text-gray-600">Reviews Given</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mb-3">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {Math.round(
                  (receivedReviews.filter((r) => r.rating >= 4).length /
                    receivedReviews.length) *
                    100
                )}
                %
              </h3>
              <p className="text-sm text-gray-600">Positive Reviews</p>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <RatingDistributionChart />

            {/* Filters */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-lg text-gray-900">Filters</h3>
              </div>

              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search reviews..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedRating(null)}
                    className={clsx(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                      selectedRating === null
                        ? "bg-purple-100 text-purple-700"
                        : "hover:bg-gray-50"
                    )}
                  >
                    All Ratings
                  </button>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setSelectedRating(rating)}
                      className={clsx(
                        "w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors",
                        selectedRating === rating
                          ? "bg-purple-100 text-purple-700"
                          : "hover:bg-gray-50"
                      )}
                    >
                      <StarRating rating={rating} />
                      <span>& up</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Project Type Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Type
                </label>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedProjectType(null)}
                    className={clsx(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                      selectedProjectType === null
                        ? "bg-purple-100 text-purple-700"
                        : "hover:bg-gray-50"
                    )}
                  >
                    All Types
                  </button>
                  {projectTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedProjectType(type)}
                      className={clsx(
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                        selectedProjectType === type
                          ? "bg-purple-100 text-purple-700"
                          : "hover:bg-gray-50"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "date" | "rating")
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="date">Most Recent</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
              <button
                onClick={() => setActiveTab("received")}
                className={clsx(
                  "flex-1 px-6 py-3 rounded-md font-medium text-sm transition-all duration-200",
                  activeTab === "received"
                    ? "bg-white text-purple-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                Reviews Received ({receivedReviews.length})
              </button>
              <button
                onClick={() => setActiveTab("given")}
                className={clsx(
                  "flex-1 px-6 py-3 rounded-md font-medium text-sm transition-all duration-200",
                  activeTab === "given"
                    ? "bg-white text-purple-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                Reviews Given ({givenReviews.length})
              </button>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No reviews found
                    </h3>
                    <p className="text-gray-500">
                      {activeTab === "received"
                        ? "You haven't received any reviews yet"
                        : "You haven't given any reviews yet"}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Response Modal */}
      <AnimatePresence>
        {showResponseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Respond to Review
              </h3>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Write your response..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={4}
              />
              <div className="flex space-x-3 mt-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowResponseModal(null);
                    setResponseText("");
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <NeonButton
                  onClick={() => {
                    setShowResponseModal(null);
                    setResponseText("");
                  }}
                  className="flex-1"
                >
                  Send Response
                </NeonButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
