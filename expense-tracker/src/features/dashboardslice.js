import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";

export const handleDownloadExcel = (dataArray, type) => {
  if (!dataArray || dataArray.length === 0) {
    toast.error(`No ${type} data to download!`);
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(
    dataArray.map((item, index) => ({
      S_No: index + 1,
      Icon: item.icon,
      Source: item.source || item.category,
      Date: new Date(item.date).toLocaleDateString(),
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `${type}s`);

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

  saveAs(blob, `${type}_List_${new Date().toISOString().split("T")[0]}.xlsx`);
  toast.success(`${type === "income" ? "Income" : "Expense"} Excel downloaded`);
};



export const fetchRecentMonthsTrend = createAsyncThunk(
  "dashboard/fetchRecentMonthsTrend",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        "/api/dashboard/recentmonths",
        { withCredentials: true }
      );
      console.log(data);
      
      return data; // 👈 { success, data: [...] }
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch recent months trend"
      );
    }
  }
);




export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchData",
  async (_, { rejectWithValue }) => {
    console.log("📡 fetchDashboardData() called..."); // 🔍 check thunk call

    try {
      const { data } = await api.get("/api/dashboard", { withCredentials: true });
      console.log("✅ Dashboard API success:", data); // 🔍 check successful response
      return data;
    } catch (err) {
      console.log("❌ Dashboard API error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || "Failed to fetch dashboard data");
    }
  }
);

export const deleteIncomeExpense = createAsyncThunk(
  "delete/income_expense",
  async ({ id, show }, { rejectWithValue }) => {
    console.log("📡 fetchDashboardData called..."); // 🔍 check thunk call

    try {
      await api.delete(`/api/${show}/${id}`, { withCredentials: true });
      console.log("✅ Delete API success:");
      return { id, show };
    } catch (err) {
      console.log("❌ Delete API error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || "Failed to fetch dashboard data");
    }
  }
);

export const fetchExpensesByMonthYear = createAsyncThunk(
  "expense/fetchByMonthYear",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/api/expense/get?month=${month}&year=${year}`,
        { withCredentials: true }
      );

      return await data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch expenses"
      );
    }
  }
);

export const fetchIncomesByMonthYear = createAsyncThunk(
  "income/fetchByMonthYear",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/api/income/get?month=${month}&year=${year}`,
        { withCredentials: true }
      );

      return await data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch expenses"
      );
    }
  }
);

// payload = data jo API ko bhejna hai
export const add = createAsyncThunk(
  "addincome/expense",
  async ({ show, payload }, { rejectWithValue }) => {
    console.log("📡 fetchDashboardData() called...", show, payload);

    try {
      const { data } = await api.post(`/api/${show}/add`, payload, {
        withCredentials: true
      });

      console.log("✅ add success:", data);
      return data;
    } catch (err) {
      console.log("❌ add success:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || "Failed to fetch dashboard data");
    }
  }
);



const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    income: [],
    expense: [],
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    recentMonthsTrend: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.income = action.payload.data.incomeTransactions;
        state.expense = action.payload.data.expenseTransactions;
        state.totalIncome = action.payload.data.totalIncome;
        state.totalExpense = action.payload.data.totalExpense;
        state.balance = action.payload.data.balance;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error("Failed to load dashboard data");
      })
      .addCase(fetchExpensesByMonthYear.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpensesByMonthYear.fulfilled, (state, action) => {
        state.loading = false;
        state.expense = action.payload.data; // 👈 month/year filtered expenses
      })
      .addCase(fetchExpensesByMonthYear.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchIncomesByMonthYear.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncomesByMonthYear.fulfilled, (state, action) => {
        state.loading = false;
        state.income = action.payload.data; // 👈 month/year filtered expenses
      })
      .addCase(fetchIncomesByMonthYear.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error("Failed to load incomes for selected period");
      })
      .addCase(fetchRecentMonthsTrend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentMonthsTrend.fulfilled, (state, action) => {
        state.loading = false;
        state.recentMonthsTrend = action.payload.data; // 👈 GRAPH READY DATA
      })
      .addCase(fetchRecentMonthsTrend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error("Failed to load recent months trend");
      })
      .addCase(deleteIncomeExpense.fulfilled, (state, action) => {
        const { id, show } = action.payload || {};
        if (id && show === "income") {
          state.income = state.income.filter((item) => item._id !== id);
        }
        if (id && show === "expense") {
          state.expense = state.expense.filter((item) => item._id !== id);
        }
        toast.success(
          show === "income" ? "Income record deleted" : "Expense record deleted"
        );
      })
      .addCase(deleteIncomeExpense.rejected, (_, action) => {
        const message =
          (typeof action.payload === "string"
            ? action.payload
            : action.payload?.message) || "Delete failed";
        toast.error(message);
      });

  },
});

export default dashboardSlice.reducer;




