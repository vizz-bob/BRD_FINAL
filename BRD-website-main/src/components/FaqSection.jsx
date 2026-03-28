import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "How do I get started with the CRM?",
    a: "Sign up for a free trial, and our onboarding team will guide you through the setup process step-by-step.",
  },
  {
    q: "Can I migrate my data from another system?",
    a: "Yes! We provide secure data migration tools and support to import your existing data effortlessly.",
  },
  {
    q: "Is there a trial version available?",
    a: "Absolutely. Test all features with a 14-day free trial—no credit card required.",
  },
  {
    q: "How do I request a custom feature?",
    a: "Reach out to our support team with your request, and we'll evaluate it for possible customization.",
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 sm:space-y-4">
      {faqs.map((item, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden"
        >
          <button
            className="w-full flex justify-between items-center p-4 sm:p-5 hover:bg-gray-50 transition-colors duration-200 focus:outline-none text-left gap-3"
            onClick={() => toggleFAQ(i)}
          >
            <span className="text-gray-800 font-medium text-sm sm:text-base">
              {item.q}
            </span>
            <motion.div
              animate={{ rotate: openIndex === i ? 45 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-gray-500 shrink-0"
            >
              <Plus size={18} />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {openIndex === i && (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-4 sm:px-5 pb-4 sm:pb-5 text-gray-700 border-t border-gray-200 text-sm sm:text-base leading-relaxed pt-3"
              >
                {item.a}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default FaqSection;