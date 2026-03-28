import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaMapLocationDot,
  FaXTwitter,
} from "react-icons/fa6";
import { IoMdCall, IoIosMail } from "react-icons/io";
import { motion } from "framer-motion";
import logo from "../assets/img/logo.png";

const Footer = () => {
  return (
    <motion.footer
      className="bg-[#04122B] text-white py-12 md:py-20 px-4 sm:px-6 md:px-12"
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      {/* Top Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10 md:gap-12">
        {/* Left */}
        <div className="flex-1 flex flex-col gap-4">
          <img className="w-32 sm:w-36 md:w-44" src={logo} alt="logo" />
          <p className="text-gray-300 leading-relaxed text-sm md:text-base max-w-xs">
            XpertlandAI provides an intelligent loan management solution that
            streamlines workflows, enhances decision making, and supports
            scalable digital lending processes.
          </p>

          <div className="flex gap-3 pt-2">
            {[FaFacebookF, FaXTwitter, FaInstagram, FaLinkedinIn].map(
              (Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="bg-white text-[#04122B] p-2.5 rounded-full hover:scale-110 transition-transform duration-300"
                >
                  <Icon size={14} />
                </a>
              )
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-10">
          {/* Company */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4">Company</h3>
            <ul className="flex flex-col gap-3 text-gray-300 text-sm md:text-base">
              <li><Link to="/about" className="hover:text-white transition">About</Link></li>
              <li><Link to="/features" className="hover:text-white transition">Features</Link></li>
              <li><Link to="/careers" className="hover:text-white transition">Careers</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4">Help</h3>
            <ul className="flex flex-col gap-3 text-gray-300 text-sm md:text-base">
              <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
              <li><Link to="/terms-conditions" className="hover:text-white transition">Terms &amp; Conditions</Link></li>
              <li><Link to="/cookie-policy" className="hover:text-white transition">Cookie Policy</Link></li>
              <li><Link to="/payments" className="hover:text-white transition">Payments</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-base md:text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="flex flex-col gap-3 text-gray-300 text-sm md:text-base">
              <li className="flex items-start gap-2">
                <IoMdCall className="mt-0.5 shrink-0" />
                <span>+91 99888-24588</span>
              </li>
              <li className="flex items-start gap-2">
                <IoIosMail className="mt-0.5 shrink-0" />
                <span className="break-all">xyzloans@XpertLand.ai</span>
              </li>
              <li className="flex items-start gap-2">
                <FaMapLocationDot className="mt-0.5 shrink-0" />
                <span>Poat Street, Near Wallmart, Los Angeles, 140039</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center mt-10 md:mt-12 pt-4 border-t border-gray-700 text-gray-400 text-xs sm:text-sm md:text-base">
        © 2025 XpertLand. All rights reserved. Developed by{" "}
        <span className="text-white font-medium">WebArclight</span>.
      </div>
    </motion.footer>
  );
};

export default Footer;