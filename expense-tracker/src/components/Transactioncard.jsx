import React from "react";

export default function TransactionCard({
  title,
  transactions,
  type = "income",
  color = "green",
}) {
  const isIncome = type === "income";

  return (
    <div className="bg-[#020617]/60 rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-lg shadow-black/30 w-full backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
        <div className="flex items-center gap-3">
          <div
            className={`h-9 w-9 rounded-xl flex items-center justify-center bg-${color}-500/15 border border-${color}-500/40`}
          >
            <span
              className={`text-${color}-400 text-lg`}
              aria-hidden="true"
            >
              {isIncome ? "💹" : "💸"}
            </span>
          </div>
          <div>
            <h3
              className={`text-base sm:text-lg font-semibold text-${color}-300`}
            >
              {title}
            </h3>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mt-0.5">
              Recent 5 {isIncome ? "incomes" : "expenses"}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-slate-400 bg-slate-900/60 px-3 py-1 rounded-full border border-slate-700/80">
          <span className="h-1.5 w-1.5 rounded-full bg-${color}-400" />
          Live summary
        </span>
      </div>

      {/* Transactions */}
      {transactions?.length > 0 ? (
        <div className="space-y-2.5 sm:space-y-3 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
          {transactions.map((t) => (
            <div
              key={t._id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-slate-900/60 rounded-xl border border-slate-800 hover:border-${color}-500/50 hover:bg-slate-900/80 transition-all duration-200"
            >
              {/* Left */}
              <div className="flex items-center gap-3 mb-2 sm:mb-0">
                <div
                  className={`min-w-9 min-h-9 sm:w-10 sm:h-10 bg-${color}-500/15 rounded-lg flex items-center justify-center text-xl`}
                >
                  <span className={`text-${color}-300`}>
                    {t.icon || (isIncome ? "💰" : "🧾")}
                  </span>
                </div>
                <div>
                  <p className="text-white text-sm sm:text-base font-medium leading-tight">
                    {isIncome ? t.source || "Income" : t.category || "Expense"}
                  </p>
                  <p className="text-slate-400 text-[11px] sm:text-xs">
                    {t.createdAt
                      ? new Date(t.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "—"}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-end justify-between sm:justify-end gap-3">
                <p
                  className={`font-semibold text-${color}-400 text-sm sm:text-base`}
                >
                  {isIncome ? "+" : "-"}$
                  {Number(t.amount || 0).toLocaleString()}
                </p>
                {t.note && (
                  <span className="hidden sm:inline-block max-w-[120px] truncate text-[11px] text-slate-400">
                    {t.note}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-slate-400 text-sm sm:text-base">
          <div className="mb-3 text-3xl">
            {isIncome ? "💰" : "💸"}
          </div>
          <p className="font-medium">
            No {isIncome ? "income" : "expense"} recorded yet
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Start adding {isIncome ? "earnings" : "spending"} to see them here.
          </p>
        </div>
      )}
    </div>
  );
}
