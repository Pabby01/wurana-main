import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  Menu,
  X,
  LogOut,
  Wallet,
  Settings,
  BarChart3,
  MessageSquare,
  Star,
  ChevronDown,
  Package,
  FileText,
} from "lucide-react";
import { NeonButton } from "../ui/NeonButton";
import { Input } from "../ui/Input";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAuthenticated, logout } = useAuth();
  const { scrollPosition } = useScrollPosition();
  const location = useLocation();
  const navigate = useNavigate();
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const handleAuthAction = () => {
    if (isAuthenticated) logout();
    else navigate("/auth");
  };

  const handleWalletClick = () => navigate("/wallet");

  const profileMenuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/dashboard" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: MessageSquare, label: "Messages", path: "/chat" },
    { icon: Star, label: "Reviews", path: "/reviews" },
    { icon: Package, label: "Gigs", path: "/gigs/manage" },
    { icon: FileText, label: "My Bids", path: "/bids" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const headerScale = Math.max(1 - scrollPosition / 2000, 0.95);
  const shouldShrink = scrollPosition > 50;

  const navItems = [
    { label: "Browse Services", path: "/marketplace" },
    { label: "Find Jobs", path: "/jobs" },
    { label: "Post Job", path: "/jobs/post" },
    { label: "How it Works", path: "/how-it-works" },
  ];

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-purple-900"
        style={{
          backdropFilter: `blur(${8 + scrollPosition / 10}px)`,
          WebkitBackdropFilter: `blur(${8 + scrollPosition / 10}px)`,
          borderRadius: shouldShrink ? "0 0 1.5rem 1.5rem" : "0",
          boxShadow: shouldShrink
            ? "0 4px 20px rgba(153, 69, 255, 0.4)"
            : "none",
        }}
        animate={{
          scale: headerScale,
          y: shouldShrink ? -10 : 0,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex items-center justify-between transition-all duration-300 text-white"
            animate={{ height: shouldShrink ? "60px" : "64px" }}
          >
            {/* Logo */}
            <Link to="/">
              <motion.div
                className="flex items-center space-x-2 group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div
                  className="relative w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg overflow-hidden"
                  whileHover={{
                    boxShadow: "0 0 20px rgba(255, 193, 7, 0.5)",
                    rotate: 5,
                  }}
                >
                  <img
                    src="/logo.png"
                    alt="Wurana Logo"
                    className="w-8 h-8 object-contain transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400/40 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.div>
                <span className="font-bold text-xl text-white group-hover:text-yellow-400 transition-colors">
                  Wurana
                </span>
              </motion.div>
            </Link>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`transition-colors relative ${
                    location.pathname === item.path
                      ? "text-yellow-400"
                      : "text-white hover:text-yellow-400"
                  }`}
                >
                  {item.label}
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-yellow-400 origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{
                      scaleX: location.pathname === item.path ? 1 : 0,
                    }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </Link>
              ))}
            </nav>

            {/* Actions - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search services..."
                  icon={<Search className="w-4 h-4" />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
              </form>

              {isAuthenticated && user ? (
                <motion.div
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <motion.button
                    onClick={handleWalletClick}
                    className="p-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 rounded-lg border border-green-500/30 transition-all duration-200 flex items-center space-x-2 text-white"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Wallet className="w-4 h-4" />
                    <span className="text-sm font-medium">Wallet</span>
                  </motion.button>

                  {/* Profile Dropdown */}
                  <div className="relative" ref={profileDropdownRef}>
                    <motion.button
                      onClick={() =>
                        setIsProfileDropdownOpen(!isProfileDropdownOpen)
                      }
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium text-white">
                          {user.name}
                        </span>
                        <span className="text-xs text-purple-200">
                          {user.email}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isProfileDropdownOpen ? "rotate-180" : ""
                        } text-white`}
                      />
                    </motion.button>

                    <AnimatePresence>
                      {isProfileDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute right-0 top-full mt-2 w-56 z-50"
                        >
                          <div
                            className="relative py-2 
    bg-purple-900 border border-purple-700 rounded-xl shadow-xl"
                          >
                            {profileMenuItems.map((item, index) => (
                              <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsProfileDropdownOpen(false)}
                                className="flex items-center space-x-3 px-4 py-3 
        font-semibold text-white hover:text-purple-200 hover:bg-purple-800/60 
        transition-colors rounded-lg"
                              >
                                <item.icon className="w-4 h-4 text-white group-hover:text-purple-200 group-hover:scale-110 transition-transform" />
                                <span className="text-base">{item.label}</span>

                                {index === 0 &&
                                  location.pathname === item.path && (
                                    <div className="w-2 h-2 bg-purple-300 rounded-full ml-auto" />
                                  )}
                              </Link>
                            ))}

                            <hr className="border-purple-700 my-2" />

                            <button
                              onClick={() => {
                                handleAuthAction();
                                setIsProfileDropdownOpen(false);
                              }}
                              className="flex items-center space-x-3 px-4 py-3 
      font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/20 
      transition-colors rounded-lg w-full text-left"
                            >
                              <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-300 group-hover:scale-110 transition-transform" />
                              <span className="text-base">Sign Out</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ) : (
                <NeonButton
                  variant="accent"
                  size="sm"
                  onClick={handleAuthAction}
                >
                  <User className="w-4 h-4" />
                  <span>Sign Up</span>
                </NeonButton>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{ color: "#2d2d2d" }}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </motion.div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="md:hidden py-4 border-t border-white/20 bg-[#9945FF]" 
              >
                <div className="space-y-4 p-4">
                  <div>
                    <Input
                      placeholder="Search services, artisans, or jobs..."
                      icon={<Search className="w-4 h-4" />}
                      className="bg-transparent border-white/20 placeholder-white/70"
                    />
                  </div>
                  <nav className="space-y-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="block py-2 px-2 rounded-lg transition-colors hover:bg-white/10 hover:text-yellow-400"
                        style={{ color: "#fff" }}
                      >
                        <motion.span whileHover={{ x: 4 }} className="block">
                          {item.label}
                        </motion.span>
                      </Link>
                    ))}
                  </nav>
                  <div className="pt-4 border-t border-white/20">
                    {!isAuthenticated && (
                      <NeonButton
                        variant="accent"
                        onClick={() => navigate("/auth")}
                        className="w-full flex items-center justify-center space-x-2"
                      >
                        <User className="w-4 h-4" />
                        <span>Sign Up</span>
                      </NeonButton>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </>
  );
};
