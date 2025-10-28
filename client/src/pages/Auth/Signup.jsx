import React from "react";
import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";

const SignupPage = () => {
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
        <h2 className="text-3xl font-bold text-center text-(--color-secondary) mb-2">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Join us and manage your society easily
        </p>

        {/* Form */}
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="px-3 py-2 border rounded focus:outline-none border-(--color-secondary) focus:border-(--color-primary) transition-all duration-300"
          />
          <input
            type="email"
            placeholder="Email"
            className="px-3 py-2 border rounded focus:outline-none border-(--color-secondary) focus:border-(--color-primary) transition-all duration-300"
          />

          <input
            type="password"
            placeholder="Password"
            className="px-3 py-2 border rounded focus:outline-none border-(--color-secondary) focus:border-(--color-primary) transition-all duration-300"
          />
          <input
            type="number"
            placeholder="Phone Number"
            className="px-3 py-2 border rounded focus:outline-none border-(--color-secondary) focus:border-(--color-primary) transition-all duration-300"
          />

          <button
            type="submit"
            className="bg-(--color-primary) text-(--color-text-hover) py-2 rounded mt-2 font-medium hover:bg-(--color-secondary) transition-all duration-300"
          >
            Sign Up
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
