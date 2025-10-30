import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import LoadingPage from "../pages/LoadingPage";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  console.log(isAuthenticated);

  if (loading) return <LoadingPage />;

  if (!isAuthenticated) return <Navigate to={"/login"} />;
  return <>{children}</>;
};

export default ProtectedRoute;
