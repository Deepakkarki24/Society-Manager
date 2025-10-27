import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full flex justify-between items-center px-10 py-2 bg-white rounded-lg shadow-md"
    >
      <NavLink to={"/"} className="text-(--color-primary) text-2xl">
        ＳᴏᴄɪᴇᴛʏＭᴀɴᴀɢᴇʀ⚙️
      </NavLink>
      <div className="flex gap-2">
        <NavLink
          className="p-2 border border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary) hover:text-(--color-text-hover) transition-all ease-in rounded text-[1.2rem] font-semibold"
          to={"/login"}
        >
          Login
        </NavLink>
        <NavLink
          className="p-2 border border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary) hover:text-(--color-text-hover) transition-all ease-in rounded text-[1.2rem] font-semibold"
          to={"/signup"}
        >
          Register
        </NavLink>
      </div>
    </motion.div>
  );
};

export default Navbar;
