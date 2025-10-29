import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 hidden md:flex flex-col sticky top-0 bg-[#111827]/95 backdrop-blur border-r border-slate-700/60 text-white">
      {/* Logo Section */}
      <div className="px-6 py-6 border-b border-slate-700/60">
        <h1 className="text-2xl font-bold tracking-tight">
          Expense<span className="text-pink-400">Pro</span>
        </h1>
        <p className="text-sm text-gray-400 mt-1">Dashboard</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink
          to="/dashboard/income"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ` +
            (isActive
              ? "bg-pink-500/20 text-pink-300 border border-pink-400/30"
              : "text-gray-300 hover:text-white hover:bg-white/5 border border-transparent")
          }
        >
          💰 <span className="font-medium">Income</span>
        </NavLink>

        <NavLink
          to="/dashboard/expenses"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ` +
            (isActive
              ? "bg-pink-500/20 text-pink-300 border border-pink-400/30"
              : "text-gray-300 hover:text-white hover:bg-white/5 border border-transparent")
          }
        >
          💸 <span className="font-medium">Expenses</span>
        </NavLink>

        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ` +
            (isActive
              ? "bg-pink-500/20 text-pink-300 border border-pink-400/30"
              : "text-gray-300 hover:text-white hover:bg-white/5 border border-transparent")
          }
        >
          👤 <span className="font-medium">Profile</span>
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-700/60 text-sm text-gray-400">
        © {new Date().getFullYear()} ExpensePro
      </div>
    </aside>
  );
}
