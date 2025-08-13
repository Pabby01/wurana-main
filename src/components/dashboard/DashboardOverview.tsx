import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassmorphicCard } from "../ui/GlassmorphicCard";
import { NeonButton } from "../ui/NeonButton";
import {
  DollarSign,
  Briefcase,
  Clock,
  TrendingUp,
  TrendingDown,
  Plus,
  MessageCircle,
  Wallet,
  User,
  Bell,
  Star,
  Calendar,
  Target,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Award,
  Clock4,
  Timer,
} from "lucide-react";

// Mock data for development
const mockStats = {
  totalEarnings: { value: 8750, change: 15.2, trend: "up" },
  activeGigs: { value: 12, change: -2.5, trend: "down" },
  pendingOrders: { value: 7, change: 25.0, trend: "up" },
  completionRate: { value: 94.8, change: 3.2, trend: "up" },
};

const mockActivities = [
  {
    id: 1,
    type: "order",
    message: 'New order for "Website Design"',
    time: "2 min ago",
    icon: Briefcase,
  },
  {
    id: 2,
    type: "review",
    message: "5-star review from John D.",
    time: "15 min ago",
    icon: Star,
  },
  {
    id: 3,
    type: "payment",
    message: "Payment received: $350",
    time: "1 hour ago",
    icon: DollarSign,
  },
  {
    id: 4,
    type: "message",
    message: "New message from client",
    time: "2 hours ago",
    icon: MessageCircle,
  },
  {
    id: 5,
    type: "completed",
    message: 'Project "Logo Design" completed',
    time: "3 hours ago",
    icon: CheckCircle,
  },
];

const mockUpcomingDeadlines = [
  {
    id: 1,
    project: "E-commerce Website",
    deadline: "2 days",
    priority: "high",
  },
  { id: 2, project: "Mobile App UI", deadline: "5 days", priority: "medium" },
  { id: 3, project: "Brand Identity", deadline: "1 week", priority: "low" },
];

const mockPerformanceMetrics = {
  responseTime: "2.4 hours",
  satisfactionScore: 4.9,
  onTimeDelivery: 96.5,
};

export const DashboardOverview: React.FC = () => {
  const [chartData, setChartData] = useState<number[]>([]);

  // Generate mock chart data
  useEffect(() => {
    const data = Array.from(
      { length: 7 },
      () => Math.floor(Math.random() * 500) + 200
    );
    setChartData(data);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const StatCard = ({
    title,
    value,
    change,
    trend,
    icon: Icon,
    prefix = "",
    suffix = "",
  }: {
    title: string;
    value: number;
    change: number;
    trend: "up" | "down";
    icon: React.ElementType;
    prefix?: string;
    suffix?: string;
  }) => (
    <motion.div variants={itemVariants}>
      <GlassmorphicCard
        className="p-6 hover:shadow-2xl transition-all duration-300"
        hover
      >
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
            <Icon className="w-6 h-6 text-purple-400" />
          </div>
          <div
            className={`flex items-center space-x-1 ${
              trend === "up" ? "text-green-400" : "text-red-400"
            }`}
          >
            {trend === "up" ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{change}%</span>
          </div>
        </div>
        <h3 className="text-gray-300 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-white">
          {prefix}
          {value.toLocaleString()}
          {suffix}
        </p>
        <div className="mt-2 text-xs text-gray-400">vs last month</div>
      </GlassmorphicCard>
    </motion.div>
  );

  const SimpleChart = ({ data, title }: { data: number[]; title: string }) => {
    const max = Math.max(...data);
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="flex items-end space-x-2 h-32">
          {data.map((value, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-t flex-1 min-w-0"
              initial={{ height: 0 }}
              animate={{ height: `${(value / max) * 100}%` }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
      </div>
    );
  };

  const ActivityItem = ({
    activity,
  }: {
    activity: (typeof mockActivities)[0];
  }) => (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors duration-200"
    >
      <div className="p-2 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20">
        <activity.icon className="w-4 h-4 text-purple-400" />
      </div>
      <div className="flex-1">
        <p className="text-white text-sm">{activity.message}</p>
        <p className="text-gray-400 text-xs">{activity.time}</p>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Earnings"
          value={mockStats.totalEarnings.value}
          change={mockStats.totalEarnings.change}
          trend={mockStats.totalEarnings.trend as "up" | "down"}
          icon={DollarSign}
          prefix="$"
        />
        <StatCard
          title="Active Gigs"
          value={mockStats.activeGigs.value}
          change={Math.abs(mockStats.activeGigs.change)}
          trend={mockStats.activeGigs.trend as "up" | "down"}
          icon={Briefcase}
        />
        <StatCard
          title="Pending Orders"
          value={mockStats.pendingOrders.value}
          change={mockStats.pendingOrders.change}
          trend={mockStats.pendingOrders.trend as "up" | "down"}
          icon={Clock}
        />
        <StatCard
          title="Completion Rate"
          value={mockStats.completionRate.value}
          change={mockStats.completionRate.change}
          trend={mockStats.completionRate.trend as "up" | "down"}
          icon={Target}
          suffix="%"
        />
      </div>

      {/* Quick Actions Section */}
      <motion.div variants={itemVariants}>
        <GlassmorphicCard className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-purple-400" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <NeonButton variant="primary" size="md" className="h-12">
              <Plus className="w-4 h-4 mr-2" />
              Create Gig
            </NeonButton>
            <NeonButton variant="secondary" size="md" className="h-12">
              <MessageCircle className="w-4 h-4 mr-2" />
              Messages
            </NeonButton>
            <NeonButton variant="accent" size="md" className="h-12">
              <Wallet className="w-4 h-4 mr-2" />
              Wallet
            </NeonButton>
            <NeonButton variant="primary" size="md" className="h-12">
              <User className="w-4 h-4 mr-2" />
              Profile
            </NeonButton>
          </div>
        </GlassmorphicCard>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts and Analytics */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <GlassmorphicCard className="p-6">
            <SimpleChart data={chartData} title="Earnings This Week" />
          </GlassmorphicCard>

          {/* Order Status Distribution */}
          <GlassmorphicCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-purple-400" />
              Order Status Distribution
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <p className="text-white font-semibold mt-2">5</p>
                <p className="text-gray-400 text-sm">Pending</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <Timer className="w-8 h-8 text-white" />
                </div>
                <p className="text-white font-semibold mt-2">8</p>
                <p className="text-gray-400 text-sm">In Progress</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <p className="text-white font-semibold mt-2">23</p>
                <p className="text-gray-400 text-sm">Completed</p>
              </div>
            </div>
          </GlassmorphicCard>
        </motion.div>

        {/* Right Sidebar */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Recent Activity Feed */}
          <GlassmorphicCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-between">
              <span className="flex items-center">
                <Bell className="w-5 h-5 mr-2 text-purple-400" />
                Recent Activity
              </span>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-2 h-2 bg-green-400 rounded-full"
              />
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {mockActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </GlassmorphicCard>

          {/* Upcoming Deadlines */}
          <GlassmorphicCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-400" />
              Upcoming Deadlines
            </h3>
            <div className="space-y-3">
              {mockUpcomingDeadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                >
                  <div>
                    <p className="text-white font-medium text-sm">
                      {deadline.project}
                    </p>
                    <p className="text-gray-400 text-xs">
                      Due in {deadline.deadline}
                    </p>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      deadline.priority === "high"
                        ? "bg-red-500/20 text-red-400"
                        : deadline.priority === "medium"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {deadline.priority}
                  </div>
                </div>
              ))}
            </div>
          </GlassmorphicCard>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <motion.div variants={itemVariants}>
        <GlassmorphicCard className="p-6">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
            Performance Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 mb-3">
                <Clock4 className="w-8 h-8 text-blue-400 mx-auto" />
              </div>
              <h3 className="text-white font-semibold">Avg Response Time</h3>
              <p className="text-2xl font-bold text-blue-400 mt-1">
                {mockPerformanceMetrics.responseTime}
              </p>
            </div>
            <div className="text-center">
              <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 mb-3">
                <Award className="w-8 h-8 text-green-400 mx-auto" />
              </div>
              <h3 className="text-white font-semibold">Satisfaction Score</h3>
              <p className="text-2xl font-bold text-green-400 mt-1">
                {mockPerformanceMetrics.satisfactionScore}/5
              </p>
            </div>
            <div className="text-center">
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-3">
                <Target className="w-8 h-8 text-purple-400 mx-auto" />
              </div>
              <h3 className="text-white font-semibold">On-time Delivery</h3>
              <p className="text-2xl font-bold text-purple-400 mt-1">
                {mockPerformanceMetrics.onTimeDelivery}%
              </p>
            </div>
          </div>
        </GlassmorphicCard>
      </motion.div>
    </motion.div>
  );
};
