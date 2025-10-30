import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import TransactionCard from "../components/Transactioncard";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Tooltip as RadialBarTooltip,
  PolarAngleAxis,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { openModal, closeModal } from "../features/modalslice";
import Addexpense from "./Addexpense";
import Addincome from "./Addincome";

function formatDateKey(d) {
  const dt = new Date(d);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const COLORS = {
  income: "#22c55e",
  expense: "#fb7185",
  accent: "#38bdf8",
  background: "#0f172a",
  card: "#1e293b",
};

const Home = () => {
  const dispatch = useDispatch();
  const dashboard = useSelector((s) => s.dashboard);
  const modal = useSelector((s) => s.modal);

  const { totalIncome = 0, totalExpense = 0, balance = 0 } = dashboard || {};
  const incomeArr = dashboard?.income || [];
  const expenseArr = dashboard?.expense || [];

  const chartData = useMemo(() => {
    const today = new Date();
    const dateKeys = [];

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      dateKeys.push(formatDateKey(d));
    }

    const byDate = Object.fromEntries(
      dateKeys.map((k) => [
        k,
        {
          date: k,
          income: 0,
          expense: 0,
          shortDate: new Date(k).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        },
      ])
    );

    for (const t of incomeArr) {
      const k = formatDateKey(t.createdAt || t.date || new Date());
      if (byDate[k]) byDate[k].income += Number(t.amount || 0);
    }

    for (const t of expenseArr) {
      const k = formatDateKey(t.createdAt || t.date || new Date());
      if (byDate[k]) byDate[k].expense += Number(t.amount || 0);
    }

    return dateKeys.map((k) => byDate[k]);
  }, [incomeArr, expenseArr]);

  const max = Math.max(totalIncome, totalExpense, 1);
  const radialData = [
    { name: "Income", value: totalIncome, fill: COLORS.income },
    { name: "Expense", value: totalExpense, fill: COLORS.expense },
  ];

  const recentExpenses = expenseArr
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const recentIncome = incomeArr
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 sm:p-6 lg:p-8 space-y-8">

      {/* ✅ Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-5 sm:p-6 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-slate-400 hover:text-white text-lg transition-colors"
              onClick={() => dispatch(closeModal())}
            >
              ✕
            </button>
            {modal.type === "expense" && <Addexpense />}
            {modal.type === "income" && <Addincome />}
          </div>
        </div>
      )}

      {/* ✅ Header */}
      <div className="text-center sm:text-left space-y-1">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
          Financial Dashboard
        </h1>
        <p className="text-slate-300 text-sm sm:text-base">
          Track your income and expenses over the last 30 days
        </p>
      </div>

      {/* ✅ Buttons */}
      <div className="flex flex-wrap gap-3 sm:gap-4">
        <button
          onClick={() => dispatch(openModal("income"))}
          className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-green-500/25 w-full sm:w-auto"
        >
          <span>+</span>
          <span>Add Income</span>
        </button>
        <button
          onClick={() => dispatch(openModal("expense"))}
          className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-rose-500/25 w-full sm:w-auto"
        >
          <span>+</span>
          <span>Add Expense</span>
        </button>
      </div>

      {/* ✅ Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[{ label: "Total Income", value: totalIncome, color: "green" },
          { label: "Total Expense", value: totalExpense, color: "rose" },
          { label: "Balance", value: balance, color: "cyan" }
        ].map((item) => (
          <div
            key={item.label}
            className="bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-700 shadow-lg flex flex-col items-center sm:items-start text-center sm:text-left"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 bg-${item.color}-500/20 rounded-lg flex items-center justify-center`}>
                <span className={`text-${item.color}-400 text-lg`}>
                  {item.label === "Balance" ? "⚖️" : item.label === "Total Income" ? "↑" : "↓"}
                </span>
              </div>
              <h3 className="text-slate-300 text-sm font-medium">{item.label}</h3>
            </div>
            <p className={`text-2xl sm:text-3xl font-bold text-${item.color}-400`}>
              ${item.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

    {/* ✅ Charts */}
<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 min-w-0">
  {/* Radial Chart */}
  <div className="bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-700 shadow-lg flex flex-col min-w-0">
    <h3 className="text-lg font-semibold text-white mb-4 text-center">
      Income vs Expense
    </h3>
    <div className="h-72 sm:h-80 md:h-96 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <RadialBarChart
          innerRadius="40%"
          outerRadius="90%"
          data={radialData}
          startAngle={180}
          endAngle={0}
        >
          <PolarAngleAxis type="number" domain={[0, max]} tick={false} />
          <RadialBar
            minAngle={15}
            background
            clockWise
            dataKey="value"
            cornerRadius={8}
          />
          <RadialBarTooltip
            formatter={(value) => [`$${value.toLocaleString()}`, "Amount"]}
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "none",
              borderRadius: "8px",
              color: "white",
            }}
          />
          <text
            x="50%"
            y="45%"
            textAnchor="middle"
            fill="white"
            fontSize="18"
            fontWeight="bold"
          >
            ${balance.toLocaleString()}
          </text>
          <text
            x="50%"
            y="55%"
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="13"
          >
            Balance
          </text>
        </RadialBarChart>
      </ResponsiveContainer>
    </div>

    <div className="flex justify-center gap-5 mt-4 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-green-500 rounded-full" />
        <span className="text-slate-300">Income</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-rose-500 rounded-full" />
        <span className="text-slate-300">Expense</span>
      </div>
    </div>
  </div>

  {/* Line Chart */}
  <div className="bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-700 shadow-lg flex flex-col min-w-0">
    <h3 className="text-lg font-semibold text-white mb-4 text-center">
      30-Day Trend
    </h3>
    <div className="h-72 sm:h-80 md:h-96 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="shortDate" stroke="#94a3b8" fontSize={11} />
          <YAxis stroke="#94a3b8" fontSize={11} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "none",
              borderRadius: "8px",
              color: "white",
            }}
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ fill: "#22c55e" }}
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#fb7185"
            strokeWidth={2}
            dot={{ fill: "#fb7185" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>

      {/* ✅ Recent Transactions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TransactionCard title="Recent Expenses" transactions={recentExpenses} type="expense" color="rose" />
        <TransactionCard title="Recent Income" transactions={recentIncome} type="income" color="green" />
      </div>
    </div>
  );
};

export default Home;
