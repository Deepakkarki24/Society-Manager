import React from "react";
import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";
import { useSignup } from "./useSignup";

const SignupPage = () => {
  const {
    formData,
    formError,
    loading,
    handelChange,
    handleSubmit,
    isAdminThere,
  } = useSignup();
  const { name, email, password, phoneNumber, role } = formData;

  return (
    <div>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto mt-28 bg-white shadow-xl rounded-2xl w-full max-w-md p-10 animate-fadeInUp"
      >
        {/* Header */}
        <h2 className="text-3xl font-bold text-center text-(--color-background) mb-2">
          <span className="text-(--color-primary)">Create</span> Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Join us and manage your society easily
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            onChange={handelChange}
            type="text"
            name="name"
            value={name}
            placeholder="Full Name"
            className="px-3 py-2 border rounded focus:outline-none border-(--color-secondary) focus:border-(--color-primary) transition-all duration-300"
          />
          <input
            onChange={handelChange}
            type="email"
            value={email}
            name="email"
            placeholder="Email"
            className="px-3 py-2 border rounded focus:outline-none border-(--color-secondary) focus:border-(--color-primary) transition-all duration-300"
          />

          <input
            onChange={handelChange}
            type="password"
            name="password"
            value={password}
            placeholder="Password"
            className="px-3 py-2 border rounded focus:outline-none border-(--color-secondary) focus:border-(--color-primary) transition-all duration-300"
          />
          <input
            onChange={handelChange}
            type="number"
            name="phoneNumber"
            value={phoneNumber}
            placeholder="Phone Number (Optional)"
            className="px-3 py-2 border rounded focus:outline-none border-(--color-secondary) focus:border-(--color-primary) transition-all duration-300"
          />
          <div>
            *Are you?
            <label className="mx-2">
              User
              <input
                onChange={handelChange}
                type="radio"
                name="role"
                value="user"
                checked={role === "user"}
              />
            </label>
            {!isAdminThere && (
              <label>
                Admin
                <input
                  onChange={handelChange}
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === "admin"}
                />
              </label>
            )}
          </div>
          {formError && (
            <p className="text-red-500 text-sm font-semibold mb-2">
              {formError}
            </p>
          )}

          <button
            type="submit"
            className="bg-(--color-primary) text-(--color-text-hover) py-2 rounded mt-2 font-medium hover:bg-(--color-secondary) transition-all duration-300"
          >
            {loading ? "Signin..." : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="grow h-px bg-gray-300" />
          <span className="text-gray-500 text-sm mx-3">or</span>
          <div className="grow h-px bg-gray-300" />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <span className="text-(--color-accent) cursor-pointer hover:underline">
            Log in
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default SignupPage;
