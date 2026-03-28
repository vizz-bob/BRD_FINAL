import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="fixed w-full top-0 left-0 z-50 bg-white/80 text-black backdrop-blur-md py-1 px-4 sm:px-6 flex justify-between items-center shadow-sm">
      {/* Logo */}
      <div className="text-2xl font-bold flex items-center">
        <img className="w-32 sm:w-40 h-auto" src={logo} alt="Logo" />
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-6 lg:gap-8 text-base lg:text-lg font-medium">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`relative pb-1 transition-all duration-200 hover:text-blue-600 ${
              location.pathname === link.path
                ? "text-blue-700 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-blue-700"
                : "text-gray-700"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Desktop CTA */}
      {location.pathname !== "/dashboards" && (
        <div className="hidden md:flex">
          <button
            onClick={() => navigate("/signup")}
            className="bg-blue-700 text-white px-4 lg:px-6 py-2 rounded-lg hover:bg-blue-600 transition text-sm lg:text-base"
          >
            Get Started
          </button>
        </div>
      )}

      {/* Hamburger */}
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-blue-900 text-white flex flex-col items-center gap-5 py-8 md:hidden shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`text-base ${
                location.pathname === link.path
                  ? "underline font-semibold"
                  : ""
              }`}
            >
              {link.name}
            </Link>
          ))}

          {location.pathname !== "/dashboards" && (
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/signup");
              }}
              className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-500 transition text-sm"
            >
              Get Started
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;