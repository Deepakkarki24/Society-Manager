import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="mt-20 text-center text-sm text-(--color-secondary)">
        © {new Date().getFullYear()} Society Manager — Designed with ❤️ for
        modern communities.
      </footer>
    </div>
  );
};

export default Footer;
