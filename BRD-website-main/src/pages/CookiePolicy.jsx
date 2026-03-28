import React from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const sections = [
  {
    title: "What Are Cookies",
    body: "Cookies are small text files stored on your device when you access a website. They allow the website to recognize your device, remember preferences, and provide a smoother and more personalized experience.",
  },
  {
    title: "Types of Cookies We Use",
    body: "We use essential cookies to ensure basic website functionality such as secure login and session management. Performance and analytics cookies help us understand how users interact with our website by collecting anonymous usage data. Functional cookies remember user preferences like language and theme selection, while advertising and marketing cookies are used to display relevant ads and measure campaign performance.",
  },
  {
    title: "Third-Party Cookies",
    body: "Our website may include cookies from trusted third-party services such as analytics providers, payment gateways, and marketing platforms. These third parties may collect information according to their own privacy and cookie policies.",
  },
  {
    title: "Cookie Management",
    body: "You can manage or disable cookies through your browser settings at any time. Please note that restricting certain cookies may impact the functionality and performance of the website.",
  },
  {
    title: "Updates to This Policy",
    body: "We may update this Cookie Policy periodically to reflect changes in technology, legal requirements, or our practices. Any updates will be posted on this page with a revised effective date.",
  },
];

export default function CookiePolicy() {
  return (
    <section className="py-20 md:py-28 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6"
        >
          Cookie Policy
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="text-gray-700 mb-8 leading-relaxed text-sm sm:text-base"
        >
          This Cookie Policy explains how XpertLand CRM uses cookies and similar
          technologies when you visit our platform. Cookies help us enhance your
          browsing experience, analyze site usage, and support essential website
          functions.
        </motion.p>

        <div className="space-y-4 sm:space-y-6">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-gray-50 p-4 sm:p-6 rounded-xl"
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                {section.title}
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                {section.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}