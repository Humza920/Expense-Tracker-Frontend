// Dashboard.jsx
import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { Menu, X } from "lucide-react"; // icons for mobile menu toggle

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: "/dashboard", icon: "🏠", label: "Home" },
    { to: "/dashboard/income", icon: "💰", label: "Income" },
    { to: "/dashboard/expenses", icon: "💸", label: "Expenses" },
    { to: "/dashboard/profile", icon: "👤", label: "Profile" },
  ];

  return (
    <div className="min-h-screen flex bg-[#0b1220] text-white font-sans">
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Mobile Top Navbar */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-[#111827]/95 backdrop-blur border-b border-slate-700/60 z-50">
        <div className="flex justify-between items-center px-5 py-4">
          <h1 className="text-xl font-bold tracking-tight">
            Expense<span className="text-pink-400">Pro</span>
          </h1>
          <button
            className="text-slate-300 hover:text-white transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <nav className="flex flex-col px-4 pb-4 space-y-2 bg-[#1e293b]/90 border-t border-slate-700/60">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 border ` +
                  (isActive
                    ? "bg-pink-500/20 text-pink-300 border-pink-400/30 cursor-default"
                    : "text-gray-300 border-transparent hover:text-pink-300 hover:bg-white/5")
                }
              >
                {link.icon} <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-20 md:py-10 overflow-y-auto">
        {/* padding-top for mobile nav height */}
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl bg-[#1f2937] border border-slate-700/60">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
