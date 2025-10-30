import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/features/auth/authThunk.js";
import Navbar from "../../components/Navbar.jsx";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogoutUser = () => {
    dispatch(logoutUser());
    navigate("/login", { replace: true });
  };
  return (
    <div>
      <Navbar handleUserLogout={handleLogoutUser} />
      <div>User Dashborad</div>;
    </div>
  );
};

export default UserDashboard;
