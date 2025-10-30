import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 hidden md:flex flex-col sticky top-0 bg-[#111827]/95 backdrop-blur border-r border-slate-700/60 text-white">
      <div className="px-6 py-6 border-b border-slate-700/60">
        <h1 className="text-2xl font-bold tracking-tight">
          Expense<span className="text-pink-400">Pro</span>
        </h1>
        <p className="text-sm text-gray-400 mt-1">Dashboard</p>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {[
          { to: "/dashboard", icon: "🏠", label: "Home" },
          { to: "/dashboard/income", icon: "💰", label: "Income" },
          { to: "/dashboard/expenses", icon: "💸", label: "Expenses" },
          { to: "/dashboard/profile", icon: "👤", label: "Profile" },
        ].map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 border ` +
              (isActive
                ? "bg-pink-500/20 text-pink-300 border-pink-400/30 cursor-default"
                : "text-gray-300 border-transparent hover:text-pink-300 hover:bg-white/5")
            }
          >
            {link.icon} <span className="font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-6 py-4 border-t border-slate-700/60 text-sm text-gray-400">
        © {new Date().getFullYear()} ExpensePro
      </div>
    </aside>
  );
}
