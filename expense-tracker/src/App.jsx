import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./Layouts/AuthLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./Layouts/Dashboard";
import Income from "./pages/income";
import Profile from "./pages/Profile";
import Expenses from "./pages/Expenses";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./features/authslice";
import { fetchDashboardData } from "./features/dashboardslice";
const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      { path: "income", element: <Income /> },
      { path: "profile", element: <Profile /> },
      { path: "expenses", element: <Expenses /> },
    ],
  },
]);

export default function App() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth()); // 🔥 yahi by-default check karega
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchDashboardData());
    }
  }, [user, dispatch]);

  if (loading) return <p>Checking authentication...</p>;

  return <RouterProvider router={router} />;
}
