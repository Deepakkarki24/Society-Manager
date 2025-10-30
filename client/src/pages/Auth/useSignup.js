import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../../redux/features/auth/authThunk.js";
import { clearError } from "../../redux/features/auth/authSlice.js";
import { isAdmin } from "../../redux/features/admin/adminThunk.js";

export const useSignup = () => {
  const initialState = {
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: null,
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const { isAdminThere } = useSelector((state) => state.admin);

  const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState(() => initialState);
  const { name, email, password, phoneNumber, role } = formData;

  const handelChange = (e) => {
    if (error) dispatch(clearError());
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    if (error) dispatch(clearError());
    e.preventDefault();

    if (!name || !email || !password || !role) {
      return setFormError("All fields are required!");
    }

    if (!role) {
      return setFormError("Role is required");
    }

    dispatch(registerUser(formData));
  };

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success(`Welcome ${user.name}`);
      setFormError(null);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && user.role === "admin") {
      navigate("/admin/dashboard");
    } else if (isAuthenticated && user.role === "user") {
      navigate("/user/dashboard");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    dispatch(isAdmin());
  }, []);

  return {
    formData,
    formError,
    loading,
    handelChange,
    handleSubmit,
    isAdminThere,
  };
};
