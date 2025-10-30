import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api";

export const getExcelFile = async (show) => {
  try {
    const response = await api.get(`/api/${show}/downloadexcel`, { withCredentials: true, responseType: "blob" })

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    })

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${show}_details.xlsx`
    a.click()
    a.remove()
    window.URL.revokeObjectURL(blob)
    console.log("✅ Excel file downloaded successfully!")

  } catch (error) {
    console.error("❌ Error downloading Excel file:", error)
  }
}


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

export const deleteIncomeExpense = createAsyncThunk(
  "dashboard/fetchData",
  async (id , { rejectWithValue }) => {
    console.log("📡 fetchDashboardData called..."); // 🔍 check thunk call

    try {
      await api.delete(`/api/expense/${id}`, { withCredentials: true });
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




