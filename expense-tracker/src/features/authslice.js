import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api";
import toast from "react-hot-toast";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/auth/login", credentials, {
        withCredentials: true,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/auth/register", credentials, {
        withCredentials: true,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/api/auth/logout", {}, { withCredentials: true });
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/auth/getme", {
        withCredentials: true,
      });
      return data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Not authenticated");
    }
  }
);

const getErrorMessage = (payload, fallback) => {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  if (payload.message) return payload.message;
  if (payload.error) return payload.error;
  return fallback;
};

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
    builder
      // 🔹 LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        toast.success("Login successful. Welcome back!");
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(getErrorMessage(action.payload, "Login failed"));
      })
      // 🔹 REGISTER
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        toast.success("Account created successfully!");
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(getErrorMessage(action.payload, "Signup failed"));
      })
      // 🔹 LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        toast.success("Logged out successfully");
      })
      .addCase(logout.rejected, (_, action) => {
        toast.error(getErrorMessage(action.payload, "Logout failed"));
      })
      // 🔹 CHECK AUTH
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
