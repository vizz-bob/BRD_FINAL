import React from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Payments() {
  return (
    <section className="py-14 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-left">
        {/* Header */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight"
        >
          Payment & Billing Policy
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="text-gray-700 mb-7 sm:mb-8 leading-relaxed text-sm sm:text-base"
        >
          This policy outlines how payments, subscriptions, refunds, and billing
          are handled for XpertLand CRM.
        </motion.p>

        <div className="space-y-7 sm:space-y-8 text-left">
          {[
            {
              title: "1. Subscription Payments",
              body: "All subscription purchases must be completed through approved payment gateways. Pricing may vary based on plan, usage, and additional integrations selected by your team.",
            },
            {
              title: "2. Billing Cycles",
              body: "Billing occurs monthly or annually, depending on your chosen plan. Invoices are automatically generated and available in your dashboard.",
            },
            {
              title: "3. Refund Policy",
              body: "Refunds are issued only for eligible cases within the permitted timeframe. Pro-rated refunds for partially used subscription periods are not provided.",
            },
            {
              title: "4. Payment Security",
              body: "All payments are processed through secure, PCI-compliant payment providers. XpertLand CRM does not store your card or banking details at any time.",
            },
            {
              title: "5. Failed Payments",
              body: "If a payment fails, your account may be temporarily suspended until billing issues are resolved. We notify users before any action.",
            },
          ].map((section, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3 md:mb-4">
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