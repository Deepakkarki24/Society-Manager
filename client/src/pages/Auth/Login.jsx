import React from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import { useLogin } from "./useLogin.js";

const LoginPage = () => {
  const { formData, formError, loading, handelChange, handleSubmit } =
    useLogin();
  const { email, password } = formData;
  return (
    <div>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white mt-28 mx-auto shadow-xl rounded-2xl w-full max-w-md p-10"
      >
        {/* Header */}
        <h2 className="text-3xl font-bold text-center text-(--color-background) mb-2">
          Welcome <span className="text-(--color-primary)">Back</span>
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Please sign in to continue
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            value={email}
            onChange={handelChange}
            placeholder="Email"
            className="px-3 py-2 border rounded focus:outline-none border-(--color-secondary) focus:border-(--color-primary) transition-all duration-300"
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={handelChange}
            placeholder="Password"
            className="px-3 py-2 border rounded focus:outline-none border-(--color-secondary) focus:border-(--color-primary) transition-all duration-300"
          />

          {formError && (
            <p className="text-red-500 text-sm font-semibold mb-2">
              {formError}
            </p>
          )}

          <button
            type="submit"
            className="bg-(--color-primary) text-(--color-text-hover) py-2 rounded-lg mt-2 font-medium hover:bg-(--color-secondary) transition-all duration-300"
          >
            {loading ? "Signin.." : "Sign In"}
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
          Don’t have an account?{" "}
          <span className="text-(--color-accent) cursor-pointer hover:underline">
            Sign up
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
