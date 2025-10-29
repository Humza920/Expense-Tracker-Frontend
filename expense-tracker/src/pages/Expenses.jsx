import React from "react";
import { useSelector } from "react-redux";

export default function Expenses() {
  const dashboard = useSelector((s) => s.dashboard || {});
  const loading = dashboard.loading;
  const error = dashboard.error;

  // Support both shapes: { income, expense } or explicit last30Days* arrays
  const expensesArr = dashboard.expense || dashboard.last30DaysExpenseTransactions || [];
  const incomeArr = dashboard.income || dashboard.last30DaysIncomeTransactions || [];

  const totalIncome = dashboard.totalIncome ?? incomeArr.reduce((t, x) => t + (x?.amount || 0), 0);
  const totalExpense = dashboard.totalExpense ?? expensesArr.reduce((t, x) => t + (x?.amount || 0), 0);

  const expenses = [...expensesArr].sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt));
  const incomes = [...incomeArr].sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt));

  return (
    <div className="space-y-8 text-white">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Expenses Overview</h1>
          <p className="mt-1 text-gray-300">Last 30 days breakdown</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[#111827]/70 border border-slate-700/60 px-4 py-3">
            <p className="text-xs text-gray-300">Total Income</p>
            <p className="text-2xl font-extrabold text-green-400 mt-1">${(totalIncome || 0).toLocaleString()}</p>
          </div>
          <div className="rounded-2xl bg-[#111827]/70 border border-slate-700/60 px-4 py-3">
            <p className="text-xs text-gray-300">Total Expense</p>
            <p className="text-2xl font-extrabold text-rose-400 mt-1">${(totalExpense || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="rounded-xl border border-slate-700/60 bg-[#111827]/70 px-4 py-3 text-gray-300">Loading...</div>
      )}
      {error && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-rose-200">{String(error)}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-[#111827]/70 border border-slate-700/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Expenses</h2>
            <span className="text-sm text-gray-300">{expenses.length} items</span>
          </div>
          <ul className="divide-y divide-slate-700/60">
            {expenses.map((t) => (
              <li key={t?._id || Math.random()} className="flex items-center gap-4 py-3">
                <span className="text-xl">{t?.icon || "💸"}</span>
                <div className="flex-1">
                  <p className="font-medium">{t?.category || "—"}</p>
                  <p className="text-xs text-gray-400">{t?.createdAt ? new Date(t.createdAt).toLocaleDateString() : "—"}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-rose-300">-{(t?.amount || 0).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-[#111827]/70 border border-slate-700/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Income</h2>
            <span className="text-sm text-gray-300">{incomes.length} items</span>
          </div>
          <ul className="divide-y divide-slate-700/60">
            {incomes.map((t) => (
              <li key={t?._id || Math.random()} className="flex items-center gap-4 py-3">
                <span className="text-xl">{t?.icon || "💰"}</span>
                <div className="flex-1">
                  <p className="font-medium">{t?.category || "—"}</p>
                  <p className="text-xs text-gray-400">{t?.createdAt ? new Date(t.createdAt).toLocaleDateString() : "—"}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-300">+{(t?.amount || 0).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

