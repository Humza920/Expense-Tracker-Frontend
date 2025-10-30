import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { add, fetchDashboardData } from "../features/dashboardslice";
import { closeModal } from "../features/modalslice";

const ICONS = [
  "💼", "🏦", "🎯", "📈", "🧾", "💸", "🏆", "🎉", "🌟", "🚀", "👔", "🎶"
];

export default function Addincome() {
  const [source, setSource] = useState("");
  const [icon, setIcon] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const dispatch = useDispatch();

  function handleIconClick(emoji) {
    setIcon(emoji);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const obj = { source, icon, amount, date };
    dispatch(add({ show: "income", payload: obj }));
    dispatch(fetchDashboardData());
    dispatch(closeModal());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-[#181A25] p-2 rounded-2xl"
    >
      <h2 className="text-xl font-bold text-green-400 mb-2">Add Income</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-1 text-sm">Source</label>
          <input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Salary, Freelance, Bonus..."
            className="w-full px-4 py-3 bg-[#212334] border border-slate-700/50 rounded-xl 
                       text-white placeholder-gray-500 focus:outline-none 
                       focus:ring-2 focus:ring-green-500/40 transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-1 text-sm">Icon</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {ICONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleIconClick(emoji)}
                className={`text-2xl w-10 h-10 rounded-lg border-2 flex items-center justify-center
                transition-all duration-200
                ${
                  icon === emoji
                    ? "bg-green-500/20 border-green-400/60 scale-105"
                    : "bg-[#23263a] border-slate-600 hover:bg-green-500/10"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
          <input
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="💼"
            maxLength={2}
            className="w-full px-4 py-3 bg-[#212334] border border-slate-700/50 rounded-xl 
                       text-white placeholder-gray-500 focus:outline-none 
                       focus:ring-2 focus:ring-green-500/30 transition-all text-2xl"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-1 text-sm">Amount</label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            type="number"
            min="0"
            step="0.01"
            className="w-full px-4 py-3 bg-[#212334] border border-slate-700/50 rounded-xl 
                       text-white placeholder-gray-500 focus:outline-none 
                       focus:ring-2 focus:ring-green-500/30 transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-1 text-sm">Date</label>
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            type="date"
            max={new Date().toISOString().slice(0, 10)}
            className="w-full px-4 py-3 bg-[#212334] border border-slate-700/50 rounded-xl 
                       text-white focus:outline-none focus:ring-2 
                       focus:ring-green-500/30 transition-all"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-1 rounded-xl font-semibold text-white 
                     bg-gradient-to-r from-green-500/60 to-cyan-500/60 
                     hover:from-green-400/90 hover:to-cyan-400/80 
                     transition-all drop-shadow shadow-green-500/10"
        >
          Add Income
        </button>
      </div>
    </form>
  );
}
