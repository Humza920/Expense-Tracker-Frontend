import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { add, fetchDashboardData } from "../features/dashboardslice";
import { fetchRecentMonthsTrend } from "../features/dashboardslice";
import { closeModal } from "../features/modalslice";
import { motion, AnimatePresence } from "framer-motion";

const ICONS = [
  "💰",
  "💵",
  "🏦",
  "💼",
  "📈",
  "🎯",
  "🏆",
  "🌟",
  "🚀",
  "⚡",
  "🔥",
  "✨",
  "💎",
  "👑",
  "🎁",
  "💸",
  "🧾",
  "💳",
  "📊",
  "💹",
  "📥",
  "💲",
  "🤑",
  "💱",
];

export default function Addincome() {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const monthStartStr = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .slice(0, 10);

  const [source, setSource] = useState("");
  const [icon, setIcon] = useState("💰");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayStr);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  function handleIconClick(emoji) {
    setIcon(emoji);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    const obj = { source, icon, amount, date };

    dispatch(add({ show: "income", payload: obj }))
      .unwrap()
      .then(() => {
        dispatch(fetchDashboardData());
        dispatch(fetchRecentMonthsTrend()); 
        dispatch(closeModal());
      })
      .catch((err) => {
        console.error("Error adding income:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="p-1">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-white mb-1">Add New Income</h2>
          <p className="text-slate-400 text-xs">Record your income source</p>
        </div>

        {/* Source Input */}
        <div className="space-y-2">
          <label className="block text-slate-300 text-xs font-medium uppercase tracking-wider">
            Income Source
          </label>
          <input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Salary, Freelance, Investment..."
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg 
                     text-white placeholder-slate-500 focus:outline-none 
                     focus:ring-1 focus:ring-green-500 text-sm"
            required
          />
        </div>

        {/* Icon Selection - Compact */}
        <div className="space-y-2">
          <label className="block text-slate-300 text-xs font-medium uppercase tracking-wider">
            Icon
          </label>
          <div className="bg-slate-800/30 p-2 rounded-lg border border-slate-700">
            <div className="grid grid-cols-6 gap-2">
              {ICONS.map((emoji, index) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleIconClick(emoji)}
                  className={`text-xl w-8 h-8 rounded-md flex items-center justify-center
                  transition-colors duration-200
                  ${
                    icon === emoji
                      ? "bg-green-500/30 border border-green-500/50"
                      : "bg-slate-700/50 hover:bg-slate-600"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Icon Mini Display */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Selected: {icon}</span>
            <span className="text-green-400">Click to change</span>
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="block text-slate-300 text-xs font-medium uppercase tracking-wider">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 font-medium">
              $
            </span>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              type="number"
              min="0"
              step="0.01"
              className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg 
                       text-white placeholder-slate-500 focus:outline-none 
                       focus:ring-1 focus:ring-green-500 text-sm font-medium"
              required
            />
          </div>
        </div>

        {/* Date Input */}
        <div className="space-y-2">
          <label className="block text-slate-300 text-xs font-medium uppercase tracking-wider">
            Date
          </label>
          <input
            value={date}
            onChange={(e) => {
              const value = e.target.value;
              if (!value) return;
              // restrict strictly to current month & not in future
              if (value < monthStartStr || value > todayStr) return;
              setDate(value);
            }}
            type="date"
            min={monthStartStr}
            max={todayStr}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg 
                     text-white focus:outline-none focus:ring-1 
                     focus:ring-green-500 text-sm"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !source || !amount}
          className={`w-full py-2.5 rounded-lg font-semibold text-white text-sm
                   transition-all duration-200 mt-2
                   ${
                     !source || !amount || loading
                       ? "bg-slate-700 cursor-not-allowed opacity-60"
                       : "bg-green-600 hover:bg-green-700 active:scale-95"
                   }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
              Adding...
            </span>
          ) : (
            "Add Income"
          )}
        </button>
      </form>
    </div>
  );
}
