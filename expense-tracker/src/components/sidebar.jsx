import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", icon: "🏠", label: "Home" },
  { to: "/dashboard/income", icon: "💰", label: "Income" },
  { to: "/dashboard/expenses", icon: "💸", label: "Expenses" },
  { to: "/dashboard/profile", icon: "👤", label: "Profile" },
];

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 hidden md:flex flex-col sticky top-0 bg-gradient-to-b from-[#020617]/95 via-[#020617]/98 to-[#020617]/95 backdrop-blur-xl border-r border-slate-800 text-white shadow-xl shadow-black/40">
      {/* Brand */}
      <div className="px-6 pt-6 pb-5 border-b border-slate-800/80">
        <h1 className="text-2xl font-bold tracking-tight">
          Expense<span className="text-pink-400">Pro</span>
        </h1>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400 mt-2">
          Control your cashflow
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1.5">
        <p className="px-3 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500 mb-2">
          Overview
        </p>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) =>
              [
                "group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border",
                isActive
                  ? "bg-pink-500/15 text-pink-200 border-pink-500/40 shadow-[0_0_18px_rgba(236,72,153,0.25)]"
                  : "text-slate-300 border-transparent hover:text-pink-200 hover:bg-white/5 hover:border-slate-600/60",
              ].join(" ")
            }
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800/80 border border-slate-700/70 text-base group-hover:border-pink-500/60">
              {link.icon}
            </span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-800/80 text-[11px] text-slate-500 flex flex-col gap-1">
        <p className="font-medium tracking-[0.18em] uppercase">
          © {new Date().getFullYear()} ExpensePro
        </p>
        <p className="text-slate-500/80">
          Smart tracking, simple insights.
        </p>
      </div>
    </aside>
  );
}
