import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../../redux/features/auth/authThunk.js";
import { clearError } from "../../redux/features/auth/authSlice.js";

export const useLogin = () => {
  const initialState = {
    email: "",
    password: "",
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState(() => initialState);
  const { email, password } = formData;

  const handelChange = (e) => {
    if (error) dispatch(clearError());
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError(null);
    if (error) dispatch(clearError());
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      return setFormError("All fields are required!");
    }

    if (error) return;
    dispatch(loginUser(formData));
    toast.success("Loggin...");

    setFormData(initialState);
  };

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
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

  return { formData, formError, loading, handelChange, handleSubmit };
};
