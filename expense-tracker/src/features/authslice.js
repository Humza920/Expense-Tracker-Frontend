import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api";

// 🔹 LOGIN
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("Login API called with:", credentials);
      const { data } = await api.post("/api/auth/login", credentials, {
        withCredentials: true,
      });
      console.log("Login API response:", data);
      return data;
    } catch (err) {
      console.log("Login API error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  }
);

// 🔹 REGISTER
export const register = createAsyncThunk(
  "auth/register",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("Register API called with:", credentials);
      const { data } = await api.post("/api/auth/register", credentials, {
        withCredentials: true,
      });
      console.log("Register API response:", data);
      return data;
    } catch (err) {
      console.log("Register API error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  }
);

// 🔹 LOGOUT
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    console.log("Logout API called");
    try {
      await api.post("/api/auth/logout", {}, { withCredentials: true });
      console.log("Logout successful");
      return true;
    } catch (err) {
      console.log("Logout API error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  }
);

// 🔹 CHECK AUTH (Firebase onAuthStateChanged alternative)
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    console.log("Checking user authentication...");
    try {
      const { data } = await api.get("/api/auth/getme", { withCredentials: true });
      console.log("User verified:", data.user);
      return data.user;
    } catch (err) {
      console.log("Auth check failed:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || "Not authenticated");
    }
  }
);

// 🔹 SLICE
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // ---- LOGIN ----
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ---- REGISTER ----
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ---- LOGOUT ----
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
    });

    // ---- CHECK AUTH ----
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
      });
  },
});

export default authSlice.reducer;
