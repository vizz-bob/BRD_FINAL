import React from "react";
import { motion } from "framer-motion";

const TestimonialCard = ({ image, name, handle, quote }) => {
  return (
    <motion.div
      className="bg-zinc-100 rounded-2xl p-6 sm:p-8 shadow-sm relative transition-transform w-full"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Quote mark */}
      <div className="text-5xl sm:text-6xl md:text-7xl text-blue-600 absolute top-2 left-5 leading-none select-none">
        "
      </div>

      <p className="text-gray-700 text-sm sm:text-base font-medium mt-14 sm:mt-16 leading-relaxed text-center sm:text-left">
        {quote}
      </p>

      <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start mt-6 sm:mt-8 gap-3">
        <img
          src={image}
          alt={name}
          className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover shrink-0"
        />
        <div className="text-center sm:text-left">
          <h4 className="text-blue-600 text-base sm:text-lg md:text-xl font-semibold">
            {name}
          </h4>
          <p className="text-xs sm:text-sm text-gray-500">{handle}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;