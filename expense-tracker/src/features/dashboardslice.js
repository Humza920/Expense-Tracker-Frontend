import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const handleDownloadExcel = (dataArray, type) => {
  if (!dataArray || dataArray.length === 0) {
    alert(`No ${type} data to download!`);
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

  // Convert workbook to blob and download
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

  saveAs(blob, `${type}_List_${new Date().toISOString().split("T")[0]}.xlsx`);
};







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
      return true;
    } catch (err) {
      console.log("❌ Delete API error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || "Failed to fetch dashboard data");
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
        state.income = action.payload.data.last30DaysIncomeTransactions;
        state.expense = action.payload.data.last30DaysExpenseTransactions;
        state.totalIncome = action.payload.data.totalIncome;
        state.totalExpense = action.payload.data.totalExpense;
        state.balance = action.payload.data.balance;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;




