
import { Outlet } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", income: 4200, expense: 2400 },
  { month: "Feb", income: 5800, expense: 3200 },
  { month: "Mar", income: 7200, expense: 4100 },
  { month: "Apr", income: 8900, expense: 4800 },
  { month: "May", income: 6700, expense: 3600 },
];

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen lg:h-screen flex flex-col lg:flex-row items-stretch lg:items-center justify-between bg-[#111827] px-6 sm:px-8 lg:px-16 py-8 sm:py-12 gap-10 sm:gap-14 lg:gap-20 font-sans overflow-y-auto lg:overflow-hidden">
      <div className="pointer-events-none absolute -z-10 inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-pink-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>
      <div className="flex-1 flex justify-start lg:justify-center">
        <div className="w-full max-w-xl space-y-6 sm:space-y-8">
          <div className="text-left">
            <h1 className="text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl tracking-tight">
              Expense<span className="text-pink-400">Pro</span>
            </h1>
            <p className="mt-3 text-lg lg:text-xl text-gray-300">
              Smart finance tracking for modern professionals.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/10 ring-1 ring-white/5">
            <Outlet />
          </div>
        </div>
      </div>
      <div className="flex-1 flex justify-end">
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/10 ring-1 ring-white/5 w-full max-w-3xl flex flex-col">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
              Financial Pulse
            </h2>
            <p className="text-gray-300 mb-6 lg:mb-10 text-base lg:text-lg">
              Income vs Expense – Last 5 Months
            </p>
            <div className="h-[260px] sm:h-[320px] lg:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} barSize={40} margin={{ top: 16, right: 24, left: 16, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="5 5" stroke="#ffffff25" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#e5e7eb", fontSize: 14, fontWeight: 600 }}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#e5e7eb", fontSize: 12 }}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #ec4899",
                      borderRadius: "16px",
                      color: "#fff",
                      fontSize: "13px",
                    }}
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ paddingTop: "16px", fontSize: "14px" }}
                    formatter={(value) => <span className="text-white font-medium">{value}</span>}
                  />
                  <Bar dataKey="income" fill="#8b5cf6" radius={[16, 16, 0, 0]} />
                  <Bar dataKey="expense" fill="#ec4899" radius={[16, 16, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-8 lg:mt-12 grid grid-cols-2 gap-8 lg:gap-12 text-center">
            <div>
              <p className="text-xs sm:text-sm lg:text-base text-gray-400 uppercase tracking-wider font-medium">
                Total Income
              </p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-400 mt-1">
                $32,800
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm lg:text-base text-gray-400 uppercase tracking-wider font-medium">
                Total Expense
              </p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-400 mt-1">
                $18,100
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
