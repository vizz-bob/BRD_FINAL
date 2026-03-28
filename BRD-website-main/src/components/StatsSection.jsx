import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const AnimatedCounter = ({ from = 0, to, duration = 2, suffix = "" }) => {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      let start = null;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / (duration * 1000), 1);
        setCount(Math.floor(progress * (to - from) + from));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, [inView, from, to, duration]);

  return (
    <motion.h4
      ref={ref}
      className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-700"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {count.toLocaleString()}
      {suffix}
    </motion.h4>
  );
};

export default function StatsGrid() {
  return (
    <div className="py-14 sm:py-20 bg-gradient-to-b from-white to-blue-50 px-4 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 max-w-3xl mx-auto text-center">
        <div className="flex flex-col items-center gap-1">
          <AnimatedCounter to={50000} duration={2} suffix="+" />
          <p className="text-gray-600 text-sm sm:text-base">Active Users</p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <AnimatedCounter to={120} duration={2} suffix="+" />
          <p className="text-gray-600 text-sm sm:text-base">Countries</p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <AnimatedCounter to={1000000} duration={2.5} suffix="+" />
          <p className="text-gray-600 text-sm sm:text-base">Leads Managed</p>
        </div>
      </div>
    </div>
  );
}