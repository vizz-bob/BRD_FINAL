import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden font-sans">
      {/* Background Image */}
      <img
        className="absolute inset-0 w-full h-full object-cover brightness-50"
        src="https://plus.unsplash.com/premium_photo-1661634396793-1a146726289c?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170"
        alt="Loan management"
      />

      {/* Centered Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center">
        <motion.h1
          className="text-4xl md:text-6xl font-bold leading-tight"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Manage Loans. Build Relationships. <br /> Grow Business.
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl mt-4 mb-8 opacity-90"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        >
          Smarter Loan Management Starts Here
        </motion.p>

        {/* CTA removed: centered Get Started button intentionally removed */}
      </div>

      {/* Highlight Box at Bottom */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full px-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
      >
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-2xl mx-auto text-white text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3">
            All-in-One AI-Powered CRM
          </h2>
          <p className="text-gray-200">
            Our intelligent system helps financial institutions automate
            workflow, monitor clients, and boost growth — faster and smarter
            than ever.
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
