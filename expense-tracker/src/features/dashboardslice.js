import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api";


// 🔹 Thunk for fetching dashboard data
export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchData",
  async (_, { rejectWithValue }) => {
    console.log("📡 fetchDashboardData() called..."); // 🔍 check thunk call
    
    try {
      const { data } = await api.get("/api/dashboard", { withCredentials: true });
      console.log("✅ Dashboard API success:", data); // 🔍 check successful response
      return data; // { income, expense, totalIncome, totalExpense, balance }
    } catch (err) {
      console.log("❌ Dashboard API error:", err.response?.data || err.message);
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
        state.income = action.payload.income;
        state.expense = action.payload.expense;
        state.totalIncome = action.payload.totalIncome;
        state.totalExpense = action.payload.totalExpense;
        state.balance = action.payload.balance;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
