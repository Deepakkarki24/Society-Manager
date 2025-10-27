import React from "react";
import Navbar from "../../components/Navbar";

const Login = () => {
  return (
    <div>
      <Navbar />
      <div className="mt-10 px-10">
        <h1 className="text-(--color-text) relative inline-block text-3xl mb-5 font-semibold after:content-[''] after:absolute after:bg-(--color-primary) after:rounded-2xl after:h-1 after:w-1/3 after:left-0 after:bottom-0 ">
          Login
        </h1>
        <form className="shadow-md rounded-2xl p-10 max-w-1/2">
          <div className="flex gap-2">
            <input
              className="border border-[#ccc] p-2 w-1/2 mb-3"
              type="email"
              placeholder="Email"
              name="email"
            />
            <input
              className="border border-[#ccc] p-2 w-1/2 mb-3"
              type="password"
              name="password"
              placeholder="Password"
            />
          </div>
          <button
            className="w-full border border-(--color-primary) text-(--color-primary) px-2 py-1 rounded font-semibold hover:bg-(--color-primary) hover:text-(--color-text-hover) transition-all ease-in"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
