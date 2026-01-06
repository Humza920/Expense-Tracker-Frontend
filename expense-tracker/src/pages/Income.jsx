import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Download,
  Trash2,
  Calendar,
  Filter,
  TrendingUp,
  BarChart3,
  DollarSign,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts";
import {
  handleDownloadExcel,
  deleteIncomeExpense,
  fetchDashboardData,
  fetchIncomesByMonthYear,
} from "../features/dashboardslice";
import Loader from "../components/Loader";
import { motion, AnimatePresence } from "framer-motion";

// ✅ Framer Motion Variants - Exactly like Expenses page
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const cardHover = {
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export default function Income() {
  const dispatch = useDispatch();

  // ✅ Get current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // ✅ Initially set to current month
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const {
    income = [],
    totalIncome = 0,
    loading,
    error,
  } = useSelector((state) => state.dashboard);

  // ✅ Fetch data whenever month/year changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setLocalError(null);

      try {
        if (selectedMonth === "all") {
          // Fetch all incomes
          await dispatch(fetchDashboardData()).unwrap();
        } else {
          // Fetch incomes for specific month and year
          await dispatch(
            fetchIncomesByMonthYear({
              month: parseInt(selectedMonth),
              year: parseInt(selectedYear),
            })
          ).unwrap();
        }
      } catch (err) {
        console.error("Error fetching incomes:", err);
        setLocalError(err.message || "Failed to fetch incomes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch, selectedMonth, selectedYear]);

  // ✅ Months and Years data
  const months = [
    { value: "all", label: "All Months" },
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const years = [
    { value: currentYear.toString(), label: currentYear.toString() },
    {
      value: (currentYear - 1).toString(),
      label: (currentYear - 1).toString(),
    },
    {
      value: (currentYear - 2).toString(),
      label: (currentYear - 2).toString(),
    },
  ];

  // ✅ Calculate monthly data from ALL incomes (not just filtered)
  const monthlyData = useMemo(() => {
    const monthly = {};

    income.forEach((item) => {
      const date = new Date(item.createdAt || item.date);
      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
      const monthName = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      if (!monthly[monthYear]) {
        monthly[monthYear] = {
          month: monthName,
          totalIncome: 0,
          transactions: 0,
          monthNumber: date.getMonth() + 1,
          year: date.getFullYear(),
        };
      }

      monthly[monthYear].totalIncome += item.amount || 0;
      monthly[monthYear].transactions += 1;
    });

    return Object.values(monthly).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.monthNumber - a.monthNumber;
    });
  }, [income]);

  // ✅ Filtered income based on month and year (client-side filter)
  const filteredIncome = useMemo(() => {
    if (selectedMonth === "all") {
      return income;
    }

    return income.filter((item) => {
      try {
        const date = new Date(item.createdAt || item.date);
        const itemMonth = date.getMonth() + 1;
        const itemYear = date.getFullYear();

        return (
          itemMonth === parseInt(selectedMonth) &&
          itemYear === parseInt(selectedYear)
        );
      } catch (error) {
        console.error("Error parsing date:", item);
        return false;
      }
    });
  }, [income, selectedMonth, selectedYear]);

  // ✅ Get current selected month data
  const currentMonthData = useMemo(() => {
    if (selectedMonth === "all") {
      const total = filteredIncome.reduce(
        (sum, item) => sum + (item.amount || 0),
        0
      );
      return {
        totalIncome: total,
        transactions: filteredIncome.length,
      };
    }

    const monthData = monthlyData.find(
      (month) =>
        month.monthNumber === parseInt(selectedMonth) &&
        month.year === parseInt(selectedYear)
    );

    return monthData || { totalIncome: 0, transactions: 0 };
  }, [selectedMonth, selectedYear, monthlyData, filteredIncome]);

  // ✅ Get current month name
  const currentMonthName = useMemo(() => {
    if (selectedMonth === "all") {
      return "All Time";
    }
    const date = new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }, [selectedMonth, selectedYear]);

  // ✅ Category-wise distribution for current filter (just like expenses)
  // ✅ Category-wise distribution with unique colors (just like expenses)
  const pieData = useMemo(() => {
    const byCategory = {};
    const categories = [];

    filteredIncome.forEach((item) => {
      const category = item.source || item.category || "Other";
      const amount = item.amount || 0;
      if (!amount) return;

      if (!byCategory[category]) {
        categories.push(category);
        byCategory[category] = { name: category, value: 0 };
      }
      byCategory[category].value += amount;
    });

    // Sort by value descending
    return Object.values(byCategory)
      .sort((a, b) => b.value - a.value)
      .slice(0, 7); // Limit to top 7 categories
  }, [filteredIncome]);

  // ✅ Better color palette for pie chart
  const pieColors = [
    "#22c55e", // Green
    "#3b82f6", // Blue
    "#8b5cf6", // Purple
    "#f59e0b", // Amber
    "#10b981", // Emerald
    "#ef4444", // Red
    "#06b6d4", // Cyan
  ];

  const totalPieValue = useMemo(
    () => pieData.reduce((sum, item) => sum + item.value, 0),
    [pieData]
  );

  // ✅ Fixed Delete function - NO API call after delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this income?")) {
      try {
        await dispatch(deleteIncomeExpense({ id, show: "income" })).unwrap();

        // Refetch data based on current filters
        if (selectedMonth === "all") {
          await dispatch(fetchDashboardData()).unwrap();
        } else {
          await dispatch(
            fetchIncomesByMonthYear({
              month: parseInt(selectedMonth),
              year: parseInt(selectedYear),
            })
          ).unwrap();
        }
      } catch (err) {
        console.error("Error deleting income:", err);
      }
    }
  };

  // ✅ Handle Excel download
  const handleExcelDownload = () => {
    const dataToDownload = selectedMonth === "all" ? income : filteredIncome;
    handleDownloadExcel(dataToDownload, "income");
  };

  // ✅ Show error
  const displayError = localError || error;
  if (displayError && !isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-green-200 text-center"
      >
        {String(displayError)}
      </motion.div>
    );
  }

  return (
    <div className="text-white space-y-8 p-4 sm:p-6">
      {/* ✅ Header Section */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            Income Analytics
          </h1>
          <p className="mt-1 text-gray-300">
            {currentMonthName} - Comprehensive overview of your earnings
          </p>
        </div>

        {/* ✅ Download Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExcelDownload}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 bg-green-500/20 hover:bg-green-500/30 border border-green-600/40 text-green-300 hover:text-green-200 font-medium px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-green-500/20 w-full lg:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5" />
          {isLoading ? "Processing..." : "Export Excel"}
        </motion.button>
      </motion.div>

      {/* ✅ Show loader only for initial/filter loading */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center p-8"
        >
          <Loader />
        </motion.div>
      )}

      {/* ✅ Content (only show when not loading) */}
      {!isLoading && (
        <>
          {/* ✅ Stats Cards */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={2}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Selected Month Income */}
            <motion.div
              variants={cardHover}
              whileHover="hover"
              className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 rounded-2xl p-6 text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                <motion.div
                  className="p-2 bg-green-500/20 rounded-lg"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <DollarSign className="w-6 h-6 text-green-400" />
                </motion.div>
              </div>
              <p className="text-gray-300 text-sm mb-1">
                {selectedMonth === "all" ? "Total Income" : "Monthly Income"}
              </p>
              <p className="text-3xl font-bold text-green-400">
                ${currentMonthData.totalIncome.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-2">{currentMonthName}</p>
            </motion.div>

            {/* Monthly Transactions */}
            <motion.div
              variants={cardHover}
              whileHover="hover"
              className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/30 rounded-2xl p-6 text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                <motion.div
                  className="p-2 bg-cyan-500/20 rounded-lg"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <BarChart3 className="w-6 h-6 text-cyan-400" />
                </motion.div>
              </div>
              <p className="text-gray-300 text-sm mb-1">
                {selectedMonth === "all"
                  ? "Total Transactions"
                  : "Monthly Transactions"}
              </p>
              <p className="text-3xl font-bold text-cyan-400">
                {currentMonthData.transactions}
              </p>
              <p className="text-xs text-gray-400 mt-2">{currentMonthName}</p>
            </motion.div>
          </motion.div>

          {/* ✅ Monthly Overview Section with Donut Chart - Exactly like Expenses page */}
          {/* Donut Chart Section */}
          <div className="w-full flex flex-col lg:flex-row gap-6 mb-4">
            {/* Donut chart */}
            <div className="w-full lg:w-1/2 h-56 sm:h-64">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius="60%"
                      outerRadius="90%"
                      paddingAngle={2}
                      strokeWidth={0}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${entry.name}`}
                          fill={pieColors[index % pieColors.length]}
                          stroke="#0f172a"
                          strokeWidth={1}
                        />
                      ))}
                    </Pie>
                    {totalPieValue > 0 && (
                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-green-300 font-semibold text-xl"
                      >
                        ${totalPieValue.toLocaleString()}
                      </text>
                    )}
                    <RechartsTooltip
                      formatter={(value, name) => [
                        `$${Number(value).toLocaleString()}`,
                        name,
                      ]}
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#f8fafc",
                      }}
                      labelFormatter={(label) => `Category: ${label}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm">
                  <div className="text-3xl mb-2">💰</div>
                  <p>No category data yet.</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Add some income to see distribution.
                  </p>
                </div>
              )}
            </div>

            {/* Category legend / breakdown */}
            <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pieData.map((item, index) => {
                const percent =
                  totalPieValue > 0
                    ? Math.round((item.value / totalPieValue) * 100)
                    : 0;
                return (
                  <motion.div
                    key={item.name}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center justify-between rounded-xl bg-[#1e293b] border border-slate-700 px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: pieColors[index % pieColors.length],
                        }}
                      />
                      <p className="text-sm text-slate-100 truncate max-w-[120px]">
                        {item.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">{percent}%</p>
                      <p className="text-sm font-semibold text-green-300">
                        ${item.value.toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
              {pieData.length === 0 && (
                <div className="col-span-2 text-center py-4">
                  <p className="text-sm text-slate-400">
                    No income yet for the selected period.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ✅ Filters Section */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={4}
            className="bg-[#111827]/70 border border-slate-700/60 rounded-2xl p-6"
          >
            <motion.div
              className="flex flex-col sm:flex-row items-center gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-2 text-green-400"
              >
                <Filter className="w-5 h-5" />
                <span className="font-medium">Filter By:</span>
              </motion.div>

              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                {/* Month Filter */}
                <motion.select
                  variants={itemVariants}
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-[#1e293b] border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  whileFocus={{ scale: 1.02 }}
                >
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </motion.select>

                {/* Year Filter */}
                <motion.select
                  variants={itemVariants}
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-[#1e293b] border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  whileFocus={{ scale: 1.02 }}
                >
                  {years.map((year) => (
                    <option key={year.value} value={year.value}>
                      {year.label}
                    </option>
                  ))}
                </motion.select>
              </div>

              <motion.div
                variants={itemVariants}
                className="text-sm text-gray-400"
              >
                Showing {filteredIncome.length} of {income.length} transactions
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ✅ Income List */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={5}
            className="bg-[#111827]/70 border border-slate-700/60 rounded-2xl p-6 shadow-lg"
          >
            <motion.div
              className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h2
                variants={itemVariants}
                className="text-xl font-semibold flex items-center gap-3"
              >
                <motion.div
                  className="p-2 bg-green-500/20 rounded-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </motion.div>
                Income History
                {selectedMonth !== "all" && (
                  <span className="text-sm text-green-400 font-normal">
                    ({currentMonthName})
                  </span>
                )}
              </motion.h2>
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-4"
              >
                <span className="text-sm text-gray-300">
                  {filteredIncome.length} transaction
                  {filteredIncome.length !== 1 ? "s" : ""}
                </span>
              </motion.div>
            </motion.div>

            <motion.div className="space-y-3">
              <AnimatePresence>
                {filteredIncome.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center py-12 text-gray-400"
                  >
                    <motion.div
                      className="text-6xl mb-4"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      💰
                    </motion.div>
                    <p className="text-lg">No income records found</p>
                    <p className="text-sm mt-1">Try changing your filters</p>
                  </motion.div>
                ) : (
                  filteredIncome.map((t, index) => (
                    <motion.div
                      key={t._id || `income-${index}`}
                      variants={listItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      whileHover={{
                        scale: 1.01,
                        borderColor: "rgba(74, 222, 128, 0.3)",
                      }}
                      transition={{
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 300,
                      }}
                      className="flex items-center justify-between p-4 bg-[#1e293b]/50 rounded-xl border border-slate-700/40 transition-all group"
                    >
                      {/* Left Side */}
                      <div className="flex items-center gap-4">
                        <motion.div
                          className="text-3xl"
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          {t.icon || "💰"}
                        </motion.div>
                        <div>
                          <p className="font-semibold text-gray-100">
                            {t.category || "Income"}
                          </p>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {t.createdAt
                              ? new Date(t.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : "—"}
                          </p>
                        </div>
                      </div>

                      {/* Right Side */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-green-400 text-lg">
                            +${(t.amount || 0).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-400">
                            {t.source || "Income"}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(t._id)}
                          disabled={isLoading}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-400/30 text-red-300 hover:text-red-200 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Delete Income"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </>
      )}
    </div>
  );
}
