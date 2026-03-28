import React from "react";
import { motion } from "framer-motion";
import { FaUsers, FaLaptopCode, FaRocket, FaShieldAlt } from "react-icons/fa";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Careers() {
  const values = [
    {
      icon: <FaRocket className="text-xl sm:text-2xl text-blue-600" />,
      title: "Innovation First",
      desc: "We build intelligent, modern CRM tools that transform how businesses operate.",
    },
    {
      icon: <FaUsers className="text-xl sm:text-2xl text-blue-600" />,
      title: "Team Driven",
      desc: "We succeed together. Collaboration, clarity, and growth define our work culture.",
    },
    {
      icon: <FaShieldAlt className="text-xl sm:text-2xl text-blue-600" />,
      title: "Security & Trust",
      desc: "Every line of code and decision prioritizes user data protection and reliability.",
    },
    {
      icon: <FaLaptopCode className="text-xl sm:text-2xl text-blue-600" />,
      title: "Quality Engineering",
      desc: "We ship scalable, clean, and future-ready solutions — no shortcuts, no hacks.",
    },
  ];

  const jobs = [
    {
      role: "Frontend Developer (React + Tailwind)",
      type: "Full-Time",
      location: "Remote / Hybrid",
      desc: "Build modern UI components, dashboards, and interactive CRM features.",
    },
    {
      role: "Backend Developer (Node.js / Python)",
      type: "Full-Time",
      location: "Remote",
      desc: "Architect secure APIs, integrate microservices, and handle data pipelines.",
    },
    {
      role: "Product Designer (UI/UX)",
      type: "Contract / Full-Time",
      location: "Hybrid",
      desc: "Design clean, intuitive workflows and user experiences for CRM automation.",
    },
  ];

  return (
    <section className="relative overflow-hidden py-14 md:py-24 bg-gradient-to-br from-[#f8fbff] via-[#eef3ff] to-[#e0e7ff]">

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">

        {/* Page Header */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-800 leading-tight"
        >
          Join Our Team
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="text-gray-600 text-center max-w-2xl mx-auto mt-4 leading-relaxed text-sm sm:text-base"
        >
          At XpertLand AI, we're building the next generation of intelligent CRM and
          automation tools. If you're passionate about innovation, AI, and user-first
          design, we'd love to work with you.
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "50%" }}
          transition={{ duration: 0.8 }}
          className="h-[2px] mx-auto mt-10 mb-12 md:mt-12 md:mb-16 bg-gradient-to-r from-blue-400 via-indigo-500 to-transparent rounded-full"
        />

        {/* Values Section */}
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-10 text-gray-800"
        >
          What We Value
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-14 md:mb-20">
          {values.map((v, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-5 sm:p-6 rounded-2xl shadow-md text-center hover:shadow-xl transition-all duration-300"
            >
              <div className="mx-auto mb-3 md:mb-4">{v.icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">{v.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "70%" }}
          transition={{ duration: 0.8 }}
          className="h-[2px] mx-auto mb-12 md:mb-16 bg-gradient-to-r from-blue-400 via-indigo-500 to-transparent rounded-full"
        />

        {/* Open Positions */}
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12"
        >
          Open Positions
        </motion.h2>

        <div className="space-y-5 md:space-y-8 mb-16 md:mb-20">
          {jobs.map((job, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-5 sm:p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 leading-snug">
                {job.role}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {job.type} • {job.location}
              </p>
              <p className="text-gray-600 mt-2 md:mt-3 leading-relaxed text-sm sm:text-base">
                {job.desc}
              </p>

              <button className="mt-4 px-5 sm:px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition cursor-pointer">
                Apply Now
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}