import React from "react";
import { NavLink } from "react-router-dom";

import { Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Home, Briefcase, MessageSquare, User, Settings, Wallet } from "lucide-react";

const SIDEBAR_ITEMS = [
  { icon: Home, label: "Overview", path: "/dashboard" },
  { icon: Wallet, label: "Wallet", path: "/dashboard/wallet" },
  { icon: Briefcase, label: "Services", path: "/dashboard/services" },
  { icon: MessageSquare, label: "Messages", path: "/dashboard/chat" },
  { icon: User, label: "Profile", path: "/dashboard/profile" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

export const DashboardLayout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="mt-16 flex h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800">
      <aside className="w-64 bg-gradient-to-b from-purple-900 to-purple-950 border-r border-purple-700/40 shadow-xl">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-700 text-white font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-white">{user?.name}</div>
              <div className="text-sm text-purple-300">{user?.email}</div>
            </div>
          </div>
        </div>
        <nav className="mt-6">
          {SIDEBAR_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-6 py-3 transition-colors rounded-lg mx-2 ${
                  isActive
                    ? "bg-purple-800 text-yellow-300"
                    : "text-purple-200 hover:bg-purple-800 hover:text-yellow-300"
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
