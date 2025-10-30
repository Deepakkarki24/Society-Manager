import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBars, FaXmark, FaBell } from "react-icons/fa6";
import { useSelector } from "react-redux";

const Navbar = ({ handleUserLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-5 bg-(--color-background) fixed left-1/2 rigth-1/2 top-14 translate-x-[-50%] translate-y-[-50%] w-10/12 flex justify-between items-center px-10 rounded-lg shadow-md shadow-teal-700"
    >
      <NavLink
        to={"/"}
        className="text-(--color-secondary) md:text-2xl text-[1.2rem]"
      >
        ＳᴏᴄɪᴇᴛʏＭᴀɴᴀɢᴇʀ⚙️
      </NavLink>

      {user && user.role === "user" ? (
        <div className="flex gap-5 items-center">
          <FaBell className="text-white text-2xl" />
          <button
            className="px-2 py-1 cursor-pointer bg-(--color-primary) rounded font-semibold text-white"
            onClick={handleUserLogout}
          >
            Logout
          </button>
        </div>
      ) : (
        <div
          className={`absolute p-5 md:static -right-1 top-18 md:w-auto flex flex-col md:flex-row items-left md:items-center md:gap-6 gap-4 py-4 md:p-0 transition-all duration-300 ${
            isOpen
              ? "opacity-100 visible w-1/2 bg-(--color-background) rounded"
              : "opacity-0 invisible md:visible w-0 md:opacity-100"
          }`}
        >
          <NavLink
            className="py-2 px-3 md:px-5  border border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary) hover:text-(--color-text-hover) transition-all ease-in rounded text-[1.2rem] font-semibold"
            to={"/login"}
          >
            Login
          </NavLink>
          <NavLink
            className="py-2 px-3 md:px-5 border border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary) hover:text-(--color-text-hover) transition-all ease-in rounded text-[1.2rem] font-semibold"
            to={"/signup"}
          >
            Register
          </NavLink>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-(--color-secondary) text-2xl md:hidden"
      >
        {isOpen ? <FaXmark /> : <FaBars />}
      </button>
    </motion.nav>
  );
};

export default Navbar;
