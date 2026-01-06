import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { add, fetchDashboardData } from "../features/dashboardslice";
import { fetchRecentMonthsTrend } from "../features/dashboardslice";
import { closeModal } from "../features/modalslice";
import { motion } from "framer-motion";

const ICONS = [
  "🍔",
  "🏠",
  "🚗",
  "🎁",
  "☕",
  "🛒",
  "🚌",
  "💊",
  "🎬",
  "💸",
  "👔",
  "📱",
  "🛍️",
  "⚡",
  "🥗",
  "🧾",
];

export default function Addexpense() {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const monthStartStr = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .slice(0, 10);

  const [category, setCategory] = useState("");
  const [icon, setIcon] = useState("💰");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayStr);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleIconClick = (emoji) => {
    setIcon(emoji);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!category || !amount) {
      return;
    }

    setLoading(true);

    const obj = { category, icon, amount, date };

    dispatch(add({ show: "expense", payload: obj }))
      .unwrap()
      .then(() => {
        dispatch(fetchDashboardData());
        dispatch(fetchRecentMonthsTrend());
        dispatch(closeModal());
      })

      .catch((err) => {
        console.error("Add expense failed:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="p-2">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Header */}
        <div className="text-center mb-3">
          <h2 className="text-lg font-bold text-rose-400">Add Expense</h2>
          <p className="text-slate-400 text-xs mt-0.5">Record your spending</p>
        </div>

        {/* Category Input */}
        <div className="space-y-1.5">
          <label className="block text-slate-300 text-xs font-medium uppercase tracking-wider">
            Category
          </label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Food, Rent, Transportation..."
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg 
                     text-white placeholder-slate-500 focus:outline-none 
                     focus:ring-1 focus:ring-rose-500 text-sm"
            required
          />
        </div>

        {/* Icon Selection */}
        <div className="space-y-1.5">
          <label className="block text-slate-300 text-xs font-medium uppercase tracking-wider">
            Icon
          </label>
          <div className="p-2 bg-slate-800/30 rounded-lg border border-slate-700">
            <div className="grid grid-cols-8 gap-1.5">
              {ICONS.map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleIconClick(emoji)}
                  className={`text-base w-7 h-7 rounded-md flex items-center justify-center
                  transition-all duration-150
                  ${
                    icon === emoji
                      ? "bg-rose-500/30 border border-rose-500/50 scale-110"
                      : "bg-slate-700/50 hover:bg-slate-600 hover:scale-105"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-400 px-1">
            <span>Selected: {icon}</span>
            <span className="text-rose-400">Click to select</span>
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-1.5">
          <label className="block text-slate-300 text-xs font-medium uppercase tracking-wider">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-400 font-medium">
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
                       focus:ring-1 focus:ring-rose-500 text-sm font-medium"
              required
            />
          </div>
          {amount && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-rose-400 text-right pr-1"
            >
              $
              {parseFloat(amount).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </motion.p>
          )}
        </div>

        {/* Date Input */}
        <div className="space-y-1.5">
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
                     focus:ring-rose-500 text-sm"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !category || !amount}
          className={`w-full py-2.5 rounded-lg font-semibold text-white text-sm
                   transition-all duration-200 mt-1
                   ${
                     !category || !amount || loading
                       ? "bg-slate-700 cursor-not-allowed opacity-60"
                       : "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 active:scale-95"
                   }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"
              />
              Adding...
            </span>
          ) : (
            "Add Expense"
          )}
        </button>

        {/* Quick Info */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Track your expenses for better budgeting
          </p>
        </div>
      </form>
    </div>
  );
}
