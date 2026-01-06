import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { openModal, closeModal } from "../features/modalslice";
import Addexpense from "./Addexpense";
import Addincome from "./Addincome";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

// ✅ CORRECT: Import all required thunks
import {
  fetchDashboardData,
  fetchRecentMonthsTrend, // ✅ YEH IMPORT KARNA THA
} from "../features/dashboardslice";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user);

  useEffect(()=>{
    Promise.all([
      dispatch(fetchDashboardData()),
      dispatch(fetchRecentMonthsTrend()),
    ]);
  } , [])
  // useEffect(() => {
  //   if (user) {
  //     Promise.all([
  //       dispatch(fetchDashboardData()),
  //       dispatch(fetchRecentMonthsTrend()),
  //     ]);
  //   }
  // }, [dispatch, user]);

  const dashboard = useSelector((s) => s.dashboard);
  const modal = useSelector((s) => s.modal);

  // Extract data from state
  const {
    balance = 0,
    totalExpense = 0,
    totalIncome = 0,
    expense = [],
    income = [],
    recentMonthsTrend = [],
    loading = false, // ✅ Add loading state
  } = dashboard || {};

  console.log("📊 recentMonthsTrend data:", recentMonthsTrend); // ✅ Debug ke liye

  // Get current month name
  const monthName = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Recent transactions (last 3 of each)
  const recentExpenses = [...expense]
    .sort(
      (a, b) =>
        new Date(b.date || b.createdAt) - new Date(a.date || b.createdAt)
    )
    .slice(0, 3);

  const recentIncome = [...income]
    .sort(
      (a, b) =>
        new Date(b.date || b.createdAt) - new Date(a.date || b.createdAt)
    )
    .slice(0, 3);

  // CHART 1: Weekly Trend Line Chart (Current Month)
  const getWeekData = () => {
    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return weeks.map((week, weekIndex) => {
      const weekIncome = income
        .filter((inc) => {
          const date = new Date(inc.date || inc.createdAt);
          return (
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
          );
        })
        .filter((inc) => {
          const date = new Date(inc.date || inc.createdAt);
          const day = date.getDate();
          return day > weekIndex * 7 && day <= (weekIndex + 1) * 7;
        })
        .reduce((sum, inc) => sum + (inc.amount || 0), 0);

      const weekExpense = expense
        .filter((exp) => {
          const date = new Date(exp.date || exp.createdAt);
          return (
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
          );
        })
        .filter((exp) => {
          const date = new Date(exp.date || exp.createdAt);
          const day = date.getDate();
          return day > weekIndex * 7 && day <= (weekIndex + 1) * 7;
        })
        .reduce((sum, exp) => sum + (exp.amount || 0), 0);

      return {
        week,
        income: weekIncome,
        expense: weekExpense,
        balance: weekIncome - weekExpense,
      };
    });
  };

  const weeklyData = getWeekData();

  // ✅ CHART 2: Use API data directly (Last 6 Months Trend)
  const monthlyData = recentMonthsTrend.map((item) => ({
    month: item.month,
    income: item.income || 0,
    expense: item.expense || 0,
  }));

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-slate-300 font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}:{" "}
              <span className="font-bold">
                ${entry.value?.toLocaleString()}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8 space-y-8 text-white">
      {/* Modal */}
      {modal.isOpen && (
        <motion.div
          className="fixed inset-0 z-50 mb-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-6 w-full max-w-md relative"
          >
            <button
              className="absolute top-3 right-3 text-slate-400 hover:text-white text-lg transition-colors"
              onClick={() => dispatch(closeModal())}
            >
              ✕
            </button>
            {modal.type === "expense" && <Addexpense />}
            {modal.type === "income" && <Addincome />}
          </motion.div>
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="text-center sm:text-left"
      >
        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-green-400 to-rose-400 bg-clip-text text-transparent">
          Financial Dashboard
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-1">
          {monthName} Overview
        </p>
      </motion.div>

      {/* Add Buttons */}
      <div className="flex flex-wrap gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => dispatch(openModal("income"))}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-green-500/30"
        >
          <span>+</span> Add Income
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => dispatch(openModal("expense"))}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-rose-500/30"
        >
          <span>+</span> Add Expense
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg hover:shadow-green-500/10 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-300 text-sm font-medium">Total Income</h3>
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <span className="text-green-400 text-xl">↑</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-green-400 drop-shadow-md">
            ${totalIncome.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-2">{monthName}</p>
          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-sm text-slate-300">
              {income.length} transaction{income.length !== 1 ? "s" : ""}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg hover:shadow-rose-500/10 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-300 text-sm font-medium">
              Total Expense
            </h3>
            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
              <span className="text-rose-400 text-xl">↓</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-rose-400 drop-shadow-md">
            ${totalExpense.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-2">{monthName}</p>
          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-sm text-slate-300">
              {expense.length} transaction{expense.length !== 1 ? "s" : ""}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg hover:shadow-cyan-500/10 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-300 text-sm font-medium">Balance</h3>
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <span className="text-cyan-400 text-xl">$</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-cyan-400 drop-shadow-md">
            ${balance.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-2">{monthName}</p>
          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-sm text-slate-300">
              {balance >= 0 ? "Positive" : "Negative"} balance
            </p>
          </div>
        </motion.div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: Weekly Trend Line Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              Weekly Cash Flow
            </h3>
            <span className="text-sm text-slate-400 bg-slate-700/50 px-3 py-1 rounded-full">
              {monthName}
            </span>
          </div>

          {weeklyData.some((week) => week.income > 0 || week.expense > 0) ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="week"
                    stroke="#94a3b8"
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    iconSize={10}
                    formatter={(value) => (
                      <span className="text-slate-300 text-sm">{value}</span>
                    )}
                  />
                  <Line
                    type="monotone"
                    dataKey="income"
                    name="Income"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ r: 6, fill: "#22c55e" }}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    name="Expense"
                    stroke="#fb7185"
                    strokeWidth={3}
                    dot={{ r: 6, fill: "#fb7185" }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-slate-700/50 flex items-center justify-center mb-4">
                <span className="text-4xl">📈</span>
              </div>
              <p className="text-slate-400">No weekly data available</p>
              <p className="text-sm text-slate-500 mt-1">
                Add transactions to see trends
              </p>
            </div>
          )}
        </motion.div>

        {/* ✅ CHART 2: Last 6 Months Trend Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              Last 6 Months Trend
            </h3>
            <span className="text-sm text-slate-400 bg-slate-700/50 px-3 py-1 rounded-full">
              Income vs Expense
            </span>
          </div>

          {loading ? (
            // ✅ Loading state
            <div className="h-80 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-t-green-500 border-slate-700 animate-spin mb-4"></div>
              <p className="text-slate-400">Loading monthly trends...</p>
              <p className="text-sm text-slate-500 mt-1">
                Fetching last 6 months data
              </p>
            </div>
          ) : monthlyData.length > 0 ? (
            // ✅ Chart with data
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    tickFormatter={(value) => {
                      if (value >= 1000000)
                        return `$${(value / 1000000).toFixed(1)}M`;
                      if (value >= 1000)
                        return `$${(value / 1000).toFixed(0)}k`;
                      return `$${value}`;
                    }}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(148, 163, 184, 0.1)" }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    iconSize={10}
                    formatter={(value) => (
                      <span className="text-slate-300 text-sm">{value}</span>
                    )}
                  />
                  <Bar
                    dataKey="income"
                    name="Income"
                    fill="#22c55e"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                  <Bar
                    dataKey="expense"
                    name="Expense"
                    fill="#fb7185"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            // ✅ No data state
            <div className="h-80 flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-slate-700/50 flex items-center justify-center mb-4">
                <span className="text-4xl">📊</span>
              </div>
              <p className="text-slate-400">No monthly trend data available</p>
              <p className="text-sm text-slate-500 mt-1">
                Add transactions to see trends
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Expenses */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-rose-400">
              Recent Expenses
            </h3>
            <span className="text-sm text-slate-400 bg-slate-700/50 px-3 py-1 rounded-full">
              Last 3
            </span>
          </div>

          {recentExpenses.length > 0 ? (
            <div className="space-y-4">
              {recentExpenses.map((expense, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center">
                      <span className="text-xl">{expense.icon || "💰"}</span>
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {expense.category || "Expense"}
                      </p>
                      <p className="text-sm text-slate-400">
                        {expense.date
                          ? new Date(expense.date).toLocaleDateString()
                          : expense.createdAt
                          ? new Date(expense.createdAt).toLocaleDateString()
                          : "Recent"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-rose-400">
                      -${expense.amount?.toLocaleString() || "0"}
                    </p>
                    <p className="text-xs text-slate-400">Amount</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-700/50 flex items-center justify-center mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <p className="text-slate-400">No expenses recorded yet</p>
              <p className="text-sm text-slate-500 mt-1">
                Add your first expense!
              </p>
            </div>
          )}
        </motion.div>

        {/* Recent Income */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-green-400">
              Recent Income
            </h3>
            <span className="text-sm text-slate-400 bg-slate-700/50 px-3 py-1 rounded-full">
              Last 3
            </span>
          </div>

          {recentIncome.length > 0 ? (
            <div className="space-y-4">
              {recentIncome.map((income, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-xl">{income.icon || "💵"}</span>
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {income.source || "Income"}
                      </p>
                      <p className="text-sm text-slate-400">
                        {income.date
                          ? new Date(income.date).toLocaleDateString()
                          : income.createdAt
                          ? new Date(income.createdAt).toLocaleDateString()
                          : "Recent"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-400">
                      +${income.amount?.toLocaleString() || "0"}
                    </p>
                    <p className="text-xs text-slate-400">Amount</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-700/50 flex items-center justify-center mb-4">
                <span className="text-2xl">💵</span>
              </div>
              <p className="text-slate-400">No income recorded yet</p>
              <p className="text-sm text-slate-500 mt-1">
                Add your first income!
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
