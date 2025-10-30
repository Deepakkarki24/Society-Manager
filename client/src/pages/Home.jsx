import React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { FaUsers, FaBell, FaClipboardList } from "react-icons/fa6";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const featureCards = [
  {
    title: "Query Management",
    icon: FaClipboardList,
    content:
      "Track, assign, and resolve resident queries efficiently — with real-time status updates.",
  },
  {
    title: "Announcements",
    icon: FaBell,
    content:
      "Send important updates or alerts to all residents instantly with in-app announcements.",
  },
  {
    title: "Admin Control",
    icon: FaUsers,
    content:
      "Give admins full control over user management, query tracking, and society-wide data.",
  },
];

const Home = () => {
  return (
    <div className="bg-(--color-primary)">
      <Navbar />
      <div className="mt-30 bg-(--color-background) text-(--color-text) flex flex-col items-center justify-center px-6 py-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-2xl"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-(--color-secondary) mb-4">
            Welcome to{" "}
            <span className="text-(--color-primary)">Society Manager</span>
          </h1>
          <p className="text-lg md:text-xl text-(--color-text) mb-8 leading-relaxed">
            Simplify your society’s daily tasks — manage resident queries,
            maintenance requests, announcements, and updates — all in one place.
          </p>

          <div className="flex justify-center gap-6">
            <NavLink
              to="/login"
              className="bg-(--color-primary) text-(--color-text-hover) px-6 py-2 rounded-md text-lg font-semibold hover:opacity-90 transition-all"
            >
              Get Started
            </NavLink>
          </div>
        </motion.div>

        {/* Feature Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid bg-transparent md:grid-cols-3 gap-8 mt-20 max-w-5xl w-full"
        >
          {featureCards.map((card, i) => (
            <div
              key={i}
              className="p-6 bg-(--color-background2) rounded-xl shadow-md shadow-teal-700 flex flex-col items-center text-center hover:shadow-lg transition-all"
            >
              <card.icon className="text-(--color-primary) text-4xl mb-3" />
              <h3 className="text-xl font-semibold mb-2 text-(--color-secondary)">
                {card.title}
              </h3>
              <p className="text-sm text-(--color-text)">{card.content}</p>
            </div>
          ))}
        </motion.div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Home;
