import React from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function TermsConditions() {
  return (
    <section className="py-20 md:py-28 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        {/* Header */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6"
        >
          Terms &amp; Conditions
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="text-gray-700 mb-8 leading-relaxed text-sm sm:text-base"
        >
          These Terms govern your use of the XpertLand CRM platform. By
          accessing or using our service, you agree to these conditions.
        </motion.p>

        <div className="space-y-6 text-left">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <ol className="list-decimal pl-5 sm:pl-6 space-y-6 text-gray-700 text-sm sm:text-base">
              {[
                {
                  title: "Use of the Platform",
                  body: "You may use XpertLand CRM solely for lawful business activities. Any attempt to disrupt services, misuse features, or gain unauthorized access is strictly prohibited.",
                },
                {
                  title: "User Responsibilities",
                  body: "Users must maintain the confidentiality of login credentials and ensure that all data entered into the platform is accurate and authorized.",
                },
                {
                  title: "Data Ownership",
                  body: "You retain full ownership of your data. XpertLand CRM processes data strictly to operate and enhance platform functionality—never for third-party sales.",
                },
                {
                  title: "Service Availability",
                  body: "While we aim for uninterrupted performance, occasional maintenance or updates may temporarily impact accessibility.",
                },
                {
                  title: "Updates to These Terms",
                  body: "We may update these Terms when necessary. Continued use of the platform constitutes acceptance of any revised terms.",
                },
              ].map((item, i) => (
                <li key={i}>
                  <strong className="text-gray-900">{item.title}</strong>
                  <p className="mt-2 leading-relaxed">{item.body}</p>
                </li>
              ))}
            </ol>
          </motion.div>
        </div>
      </div>
    </section>
  );
}