import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Home, Briefcase, MessageSquare, User, Settings } from "lucide-react";

const SIDEBAR_ITEMS = [
  { icon: Home, label: "Overview", path: "/dashboard" },
  { icon: Briefcase, label: "Services", path: "/dashboard/services" },
  { icon: MessageSquare, label: "Messages", path: "/dashboard/messages" },
  { icon: User, label: "Profile", path: "/dashboard/profile" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();

  return (
    <div className=" mt-16 flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-purple-100">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div className="font-medium">{user?.name}</div>
              <div className="text-sm text-gray-500">{user?.email}</div>
            </div>
          </div>
        </div>

        <nav className="mt-6">
          {SIDEBAR_ITEMS.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600"
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};
