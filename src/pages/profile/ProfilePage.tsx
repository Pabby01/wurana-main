 
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Camera,
  Edit3,
  MapPin,
  Star,
  Award,
  Plus,
  Upload,
  X,
  Save,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Tag,
  Trash2,
  Check,
} from "lucide-react";
import { GlassmorphicCard } from "../../components/ui/GlassmorphicCard";
import { NeonButton } from "../../components/ui/NeonButton";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../contexts/AuthContext";
import { PortfolioItem, NFTBadge } from "../../types";

interface ProfileFormData {
  displayName: string;
  bio: string;
  location: {
    city: string;
    country: string;
  };
  skills: string[];
  email: string;
  phone: string;
  serviceCategories: string[];
}

// Mock data for development
const mockPortfolio: PortfolioItem[] = [
  {
    id: "1",
    title: "Custom Mobile App Design",
    description:
      "A beautiful e-commerce mobile app with modern UI/UX design principles.",
    imageUrl: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=400",
    ipfsHash: "QmX1...",
    category: "Mobile Design",
  },
  {
    id: "2",
    title: "Brand Identity Package",
    description:
      "Complete branding solution including logo, colors, and typography.",
    imageUrl: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=400",
    ipfsHash: "QmY2...",
    category: "Branding",
  },
  {
    id: "3",
    title: "Web Development Project",
    description: "Full-stack web application with React and Node.js.",
    imageUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400",
    ipfsHash: "QmZ3...",
    category: "Web Development",
  },
];

const mockBadges: NFTBadge[] = [
  {
    id: "1",
    name: "Quality Master",
    description: "Consistently delivers high-quality work",
    imageUrl: "🏆",
    mintAddress: "mint1...",
    earnedAt: new Date("2024-01-15"),
    category: "quality",
  },
  {
    id: "2",
    name: "Reliable Partner",
    description: "Always meets deadlines and commitments",
    imageUrl: "⭐",
    mintAddress: "mint2...",
    earnedAt: new Date("2024-02-20"),
    category: "reliability",
  },
  {
    id: "3",
    name: "Communication Expert",
    description: "Excellent communication throughout projects",
    imageUrl: "💬",
    mintAddress: "mint3...",
    earnedAt: new Date("2024-03-10"),
    category: "communication",
  },
];

const serviceCategories = [
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Graphic Design",
  "Content Writing",
  "Digital Marketing",
  "SEO",
  "Video Editing",
  "Photography",
  "Translation",
  "Virtual Assistant",
  "Data Entry",
  "Social Media Management",
  "Blockchain Development",
  "AI/ML",
  "DevOps",
  "Cybersecurity",
  "Business Consulting",
];

const skillSuggestions = [
  "React",
  "Node.js",
  "Python",
  "JavaScript",
  "TypeScript",
  "Solana",
  "Rust",
  "Figma",
  "Adobe Creative Suite",
  "WordPress",
  "Shopify",
  "MongoDB",
  "PostgreSQL",
  "AWS",
  "Docker",
  "Git",
  "API Development",
  "Mobile App Development",
  "UI Design",
  "UX Research",
  "SEO Optimization",
];

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "info" | "portfolio" | "badges" | "services"
  >("info");
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);

  // Form state
  const [formData, setFormData] = useState<ProfileFormData>({
    displayName: user?.name || "John Doe",
    bio: "Passionate developer with 5+ years of experience in web and mobile development. I love creating beautiful, functional applications that solve real-world problems.",
    location: {
      city: "San Francisco",
      country: "USA",
    },
    skills: ["React", "Node.js", "TypeScript", "Solana", "UI/UX Design"],
    email: user?.email || "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    serviceCategories: [
      "Web Development",
      "Mobile Development",
      "UI/UX Design",
    ],
  });

  // Portfolio form state
  const [portfolioForm, setPortfolioForm] = useState({
    title: "",
    description: "",
    category: "",
    imageFile: null as File | null,
  });

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(mockPortfolio);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleSaveProfile = async () => {
    try {
      // Here you would make an API call to save the profile data
      console.log("Saving profile:", formData);
      setIsEditing(false);
      // Show success toast
    } catch (error) {
      console.error("Error saving profile:", error);
      // Show error toast
    }
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }
    setNewSkill("");
    setShowSkillSuggestions(false);
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const toggleServiceCategory = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceCategories: prev.serviceCategories.includes(category)
        ? prev.serviceCategories.filter((c) => c !== category)
        : [...prev.serviceCategories, category],
    }));
  };

  const handlePortfolioSubmit = async () => {
    if (
      portfolioForm.title &&
      portfolioForm.description &&
      portfolioForm.category
    ) {
      const newItem: PortfolioItem = {
        id: Date.now().toString(),
        title: portfolioForm.title,
        description: portfolioForm.description,
        category: portfolioForm.category,
        imageUrl: portfolioForm.imageFile
          ? URL.createObjectURL(portfolioForm.imageFile)
          : "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=400",
        ipfsHash: `QmNew${Date.now()}`,
      };
      setPortfolio((prev) => [...prev, newItem]);
      setPortfolioForm({
        title: "",
        description: "",
        category: "",
        imageFile: null,
      });
      setShowPortfolioForm(false);
    }
  };

  const deletePortfolioItem = (id: string) => {
    setPortfolio((prev) => prev.filter((item) => item.id !== id));
  };

  const tabs = [
    { id: "info", label: "Personal Info", icon: User },
    { id: "portfolio", label: "Portfolio", icon: Briefcase },
    { id: "badges", label: "Achievements", icon: Award },
    { id: "services", label: "Services", icon: Tag },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Profile Management
          </h1>
          <p className="text-gray-600">
            Manage your profile, portfolio, and services
          </p>
        </div>

        {/* Profile Header */}
        <GlassmorphicCard className="mb-8 p-6" opacity={0.2}>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              <button
                onClick={() => setShowAvatarUpload(true)}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {formData.displayName}
                </h2>
                <div className="flex items-center space-x-1 text-yellow-500">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-semibold">4.9</span>
                  <span className="text-gray-600">(47 reviews)</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-gray-600 mb-3">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {formData.location.city}, {formData.location.country}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span>{formData.email}</span>
                </div>
              </div>
              <p className="text-gray-700 max-w-2xl">{formData.bio}</p>
            </div>

            <div className="flex space-x-3">
              <NeonButton
                variant={isEditing ? "secondary" : "primary"}
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit3 className="w-4 h-4" />
                {isEditing ? "Cancel" : "Edit Profile"}
              </NeonButton>
              {isEditing && (
                <NeonButton
                  variant="accent"
                  size="sm"
                  onClick={handleSaveProfile}
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </NeonButton>
              )}
            </div>
          </div>
        </GlassmorphicCard>

        {/* Tab Navigation */}
        <div className="mb-8">
          <GlassmorphicCard className="p-1" opacity={0.2}>
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </GlassmorphicCard>
        </div>

        {/* Content based on active tab */}
        <AnimatePresence mode="wait">
          {activeTab === "info" && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Information */}
                <GlassmorphicCard className="p-6" opacity={0.2}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Basic Information
                  </h3>
                  <div className="space-y-4">
                    <Input
                      label="Display Name"
                      value={formData.displayName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          displayName: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        rows={4}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors disabled:bg-gray-50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="City"
                        value={formData.location.city}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            location: {
                              ...prev.location,
                              city: e.target.value,
                            },
                          }))
                        }
                        disabled={!isEditing}
                      />
                      <Input
                        label="Country"
                        value={formData.location.country}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            location: {
                              ...prev.location,
                              country: e.target.value,
                            },
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </GlassmorphicCard>

                {/* Contact Information */}
                <GlassmorphicCard className="p-6" opacity={0.2}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <Input
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                      icon={<Mail className="w-4 h-4" />}
                    />
                    <Input
                      label="Phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                      icon={<Phone className="w-4 h-4" />}
                    />
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          Member since: {new Date().getFullYear() - 1}
                        </span>
                      </div>
                    </div>
                  </div>
                </GlassmorphicCard>

                {/* Skills */}
                <GlassmorphicCard className="p-6 lg:col-span-2" opacity={0.2}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Skills & Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.skills.map((skill) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border border-purple-200"
                      >
                        {skill}
                        {isEditing && (
                          <button
                            onClick={() => removeSkill(skill)}
                            className="ml-2 text-purple-500 hover:text-purple-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </motion.span>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="relative">
                      <Input
                        placeholder="Add a new skill..."
                        value={newSkill}
                        onChange={(e) => {
                          setNewSkill(e.target.value);
                          setShowSkillSuggestions(e.target.value.length > 0);
                        }}
                        onKeyPress={(e) =>
                          e.key === "Enter" && addSkill(newSkill)
                        }
                      />
                      {showSkillSuggestions && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                          {skillSuggestions
                            .filter(
                              (skill) =>
                                skill
                                  .toLowerCase()
                                  .includes(newSkill.toLowerCase()) &&
                                !formData.skills.includes(skill)
                            )
                            .map((skill) => (
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
                  )}
                </GlassmorphicCard>
              </div>
            </motion.div>
          )}

          {activeTab === "portfolio" && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Portfolio
                </h3>
                <NeonButton
                  variant="primary"
                  size="sm"
                  onClick={() => setShowPortfolioForm(true)}
                >
                  <Plus className="w-4 h-4" />
                  Add Project
                </NeonButton>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <GlassmorphicCard
                      className="p-0 overflow-hidden hover:shadow-xl transition-shadow"
                      opacity={0.2}
                      hover
                    >
                      <div className="relative">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <button
                            onClick={() => deletePortfolioItem(item.id)}
                            className="p-2 bg-red-500/80 hover:bg-red-600/80 rounded-lg text-white transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {item.title}
                        </h4>
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {item.description}
                        </p>
                      </div>
                    </GlassmorphicCard>
                  </motion.div>
                ))}
              </div>

              {/* Add Portfolio Modal */}
              <AnimatePresence>
                {showPortfolioForm && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowPortfolioForm(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="bg-white rounded-xl p-6 max-w-md w-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">
                          Add Portfolio Item
                        </h3>
                        <button
                          onClick={() => setShowPortfolioForm(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="space-y-4">
                        <Input
                          label="Project Title"
                          value={portfolioForm.title}
                          onChange={(e) =>
                            setPortfolioForm((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            value={portfolioForm.description}
                            onChange={(e) =>
                              setPortfolioForm((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            rows={3}
                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                          </label>
                          <select
                            value={portfolioForm.category}
                            onChange={(e) =>
                              setPortfolioForm((prev) => ({
                                ...prev,
                                category: e.target.value,
                              }))
                            }
                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                          >
                            <option value="">Select category</option>
                            {serviceCategories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              setPortfolioForm((prev) => ({
                                ...prev,
                                imageFile: e.target.files?.[0] || null,
                              }))
                            }
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                          />
                        </div>
                        <div className="flex space-x-3 pt-4">
                          <NeonButton
                            variant="secondary"
                            onClick={() => setShowPortfolioForm(false)}
                            className="flex-1"
                          >
                            Cancel
                          </NeonButton>
                          <NeonButton
                            variant="primary"
                            onClick={handlePortfolioSubmit}
                            className="flex-1"
                          >
                            Add Project
                          </NeonButton>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {activeTab === "badges" && (
            <motion.div
              key="badges"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Achievements & Badges
                </h3>
                <p className="text-gray-600">
                  Your earned NFT badges that showcase your skills and
                  reputation
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockBadges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlassmorphicCard
                      className="p-6 text-center"
                      opacity={0.2}
                      hover
                    >
                      <div className="text-6xl mb-4">{badge.imageUrl}</div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {badge.name}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4">
                        {badge.description}
                      </p>
                      <div className="flex items-center justify-center space-x-2 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs">
                          Earned {badge.earnedAt.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            badge.category === "quality"
                              ? "bg-green-100 text-green-800"
                              : badge.category === "reliability"
                              ? "bg-blue-100 text-blue-800"
                              : badge.category === "communication"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {badge.category}
                        </span>
                      </div>
                    </GlassmorphicCard>
                  </motion.div>
                ))}
              </div>

              {/* Stats Summary */}
              <GlassmorphicCard className="mt-8 p-6" opacity={0.2}>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Achievement Summary
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {mockBadges.length}
                    </div>
                    <div className="text-gray-600 text-sm">Total Badges</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">
                      4.9
                    </div>
                    <div className="text-gray-600 text-sm">Average Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">47</div>
                    <div className="text-gray-600 text-sm">Completed Jobs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">98%</div>
                    <div className="text-gray-600 text-sm">Success Rate</div>
                  </div>
                </div>
              </GlassmorphicCard>
            </motion.div>
          )}

          {activeTab === "services" && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Service Categories
                </h3>
                <p className="text-gray-600">
                  Select the categories that best describe your services
                </p>
              </div>

              <GlassmorphicCard className="p-6" opacity={0.2}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {serviceCategories.map((category) => {
                    const isSelected =
                      formData.serviceCategories.includes(category);
                    return (
                      <motion.button
                        key={category}
                        onClick={() =>
                          isEditing && toggleServiceCategory(category)
                        }
                        disabled={!isEditing}
                        className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                          isSelected
                            ? "border-purple-500 bg-purple-50 text-purple-700"
                            : "border-gray-200 hover:border-gray-300 text-gray-700"
                        } ${!isEditing && "cursor-default"}`}
                        whileHover={isEditing ? { scale: 1.02 } : undefined}
                        whileTap={isEditing ? { scale: 0.98 } : undefined}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{category}</span>
                          {isSelected && (
                            <Check className="w-5 h-5 text-purple-600" />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {!isEditing && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-4">
                      Your selected service categories:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.serviceCategories.map((category) => (
                        <span
                          key={category}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </GlassmorphicCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Avatar Upload Modal */}
        <AnimatePresence>
          {showAvatarUpload && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowAvatarUpload(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-sm w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    Update Profile Picture
                  </h3>
                  <button
                    onClick={() => setShowAvatarUpload(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-center">
                  <div className="mb-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="cursor-pointer inline-flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-full hover:border-purple-500 transition-colors"
                    >
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Preview"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <span className="text-sm text-gray-600">
                            Click to upload
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                  <div className="flex space-x-3">
                    <NeonButton
                      variant="secondary"
                      onClick={() => setShowAvatarUpload(false)}
                      className="flex-1"
                    >
                      Cancel
                    </NeonButton>
                    <NeonButton
                      variant="primary"
                      onClick={() => {
                        // Save avatar logic here
                        setShowAvatarUpload(false);
                      }}
                      className="flex-1"
                    >
                      Save
                    </NeonButton>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
