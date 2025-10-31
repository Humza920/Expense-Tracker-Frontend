import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Download, Trash2 } from "lucide-react";
import { getExcelFile, deleteIncomeExpense, fetchDashboardData } from "../features/dashboardslice"; // ✅ make sure this action exists

export default function Expenses() {
  const dispatch = useDispatch();
  const dashboard = useSelector((state) => state.dashboard);
  const loading = dashboard?.loading;
  const error = dashboard?.error;

  if (!dashboard) return null;

  const totalExpense = dashboard.totalExpense || 0;
  const expenses = dashboard.expense || [];

  // ✅ Handle Delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      dispatch(deleteIncomeExpense({id , show:"expense"}));
      dispatch(fetchDashboardData())
    }
  };

  return (
    <div className="text-white space-y-8">
      {/* ✅ Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Expense Overview</h1>
          <p className="mt-1 text-gray-300">
            Your spending summary for the last 30 days
          </p>
        </div>

        {/* ✅ Right Section */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          <div className="flex-1 sm:flex-none rounded-2xl bg-[#111827]/70 border border-slate-700/60 px-5 py-4 text-right">
            <p className="text-sm text-gray-300">Total Expense (This Month)</p>
            <p className="text-3xl font-extrabold text-rose-400 mt-1">
              ${totalExpense.toLocaleString()}
            </p>
          </div>

          {/* 🟢 Download Button */}
          <button
            onClick={() => getExcelFile("expense")}
            className="flex items-center justify-center gap-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-600/40 text-rose-300 hover:text-rose-200 font-medium px-5 py-3 rounded-xl transition-all shadow-sm hover:shadow-rose-500/20 active:scale-95 w-full sm:w-auto"
          >
            <Download className="w-5 h-5" />
            Download Excel
          </button>
        </div>
      </div>

      {/* ✅ Status Messages */}
      {loading && (
        <div className="rounded-xl border border-slate-700/60 bg-[#111827]/70 px-4 py-3 text-gray-300 text-center">
          Loading...
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-rose-200 text-center">
          {String(error)}
        </div>
      )}

      {/* ✅ Expense List */}
      <div className="rounded-2xl bg-[#111827]/70 border border-slate-700/60 p-5 sm:p-6 shadow-lg shadow-black/20 transition-all hover:shadow-rose-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            💸 Recent Expenses
          </h2>
          <span className="text-sm text-gray-300 text-right sm:text-left">
            {expenses?.length} items
          </span>
        </div>

        <ul className="divide-y divide-slate-700/60">
          {expenses?.length === 0 ? (
            <li className="text-gray-400 py-6 text-center">
              No expense records found.
            </li>
          ) : (
            expenses.map((t) => (
              <li
                key={t._id || Math.random()}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 hover:bg-[#1e293b]/60 transition-colors rounded-xl px-3"
              >
                {/* Left Side */}
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{t.icon}</span>
                  <div>
                    <p className="font-medium text-gray-100">{t.category}</p>
                    <p className="text-xs text-gray-400">
                      {t.createdAt
                        ? new Date(t.createdAt).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                </div>

                {/* Right Side (Amount + Delete) */}
                <div className="flex items-center gap-4 sm:gap-6">
                  <p className="font-semibold text-rose-400 text-lg">
                    -${t.amount.toLocaleString()}
                  </p>

                  {/* 🗑️ Delete Button */}
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-300 hover:text-rose-200 transition-all active:scale-95"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
