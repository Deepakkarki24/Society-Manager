import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import UserDashboard from "./pages/User/UserDashboard";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from "./protectedPages/ProtectedRoute";
import { loadUser } from "./redux/features/auth/authThunk.js";
import { useDispatch, useSelector } from "react-redux";
import LoadingPage from "./pages/LoadingPage.jsx";

import { ToastContainer } from "react-toastify";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";

const App = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, []);

  if (loading) return <LoadingPage />;
  // console.log(loading);
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Handling unwanted route errors */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default App;
