import React from "react";

export default function TransactionCard({
  title,
  transactions,
  type = "income",
  color = "green",
}) {
  return (
    <div className="bg-slate-800 rounded-2xl p-4 sm:p-6 border border-slate-700 shadow-lg w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <h3 className={`text-lg sm:text-xl font-semibold text-${color}-400`}>
          {title}
        </h3>
        <span className="text-xs sm:text-sm text-slate-400 bg-slate-700 px-2 py-1 rounded mt-2 sm:mt-0 self-start sm:self-auto">
          Recent 5 transactions
        </span>
      </div>

      {/* Transactions */}
      {transactions?.length > 0 ? (
        <div className="space-y-2 sm:space-y-3">
          {transactions.map((t) => (
            <div
              key={t._id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors duration-200"
            >
              {/* Left */}
              <div className="flex items-center gap-3 mb-2 sm:mb-0">
                <div
                  className={`min-w-8 min-h-8 sm:w-9 sm:h-9 bg-${color}-500/20 rounded-lg flex items-center justify-center`}
                >
                  <span className={`text-${color}-400 text-lg sm:text-xl`}>
                    {t.icon}
                  </span>
                </div>
                <div>
                  <p className="text-white text-sm sm:text-base font-medium leading-tight">
                    {type === "income" ? t.source : t.category}
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Right */}
              <p
                className={`font-semibold text-${color}-400 text-sm sm:text-base`}
              >
                {type === "income" ? "+" : "-"}${t.amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-400 text-sm sm:text-base">
          <p>No {type} recorded yet</p>
        </div>
      )}
    </div>
  );
}
