import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./Layouts/AuthLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute"
import ModalWrapper from "./components/ModalWrapper";
import Dashboard from "./Layouts/Dashboard";
import Income from "./pages/Income";
import Profile from "./pages/Profile";
import Expenses from "./pages/Expenses";
import Home from "./pages/Home";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./features/authslice";
import { fetchDashboardData } from "./features/dashboardslice";
import Addexpense from "./pages/Addexpense";
import Addincome from "./pages/Addincome";
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
  path: "/add",
  element: <ModalWrapper />, 
  children: [
    { path: "expense", element: <Addexpense /> },
    { path: "income", element: <Addincome /> },
  ],
},
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <Home /> },
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
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(fetchDashboardData());
    }
  }, [user]);

  if (loading) return <p>Checking authentication...</p>;

  return <RouterProvider router={router} />;
}
