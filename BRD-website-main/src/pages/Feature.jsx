import React from "react";
import { motion } from "framer-motion";
import { IoShieldCheckmark } from "react-icons/io5";
import { FaLock } from "react-icons/fa6";
import { VscGraphLine } from "react-icons/vsc";
import { CiCloud } from "react-icons/ci";
import { MdOutlineElectricBolt } from "react-icons/md";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Features = () => {
  const features = [
    {
      img: "https://i.pinimg.com/736x/fc/c7/8b/fcc78bd457d349f23b61663c4e7c09f4.jpg",
      title: "AI-Powered Automation",
      desc: "Automate approvals, reminders, and communication with intelligent AI that learns from your loan patterns and client behavior.",
    },
    {
      img: "https://i.pinimg.com/736x/70/47/c6/7047c6b1ddc13313da01876a7e421629.jpg",
      title: "Lightning-Fast Processing",
      desc: "Say goodbye to delays — our system processes loan requests, verification, and approvals in seconds using smart APIs.",
    },
    {
      img: "https://i.pinimg.com/736x/0e/7f/1d/0e7f1d67c99954b1d48bcf58f4c2a24c.jpg",
      title: "Real-Time Insights",
      desc: "Get clear visual analytics of every loan, repayment, and borrower interaction with real-time dashboards and AI predictions.",
    },
    {
      img: "https://i.pinimg.com/736x/19/84/43/1984436b5d6b70eee81e727e978615ac.jpg",
      title: "End-to-End Security",
      desc: "Advanced encryption and role-based access ensure borrower data stays 100% protected at every stage.",
    },
    {
      img: "https://i.pinimg.com/736x/c7/88/d7/c788d7ad92b1a6b07657f6b7193fcb55.jpg",
      title: "Smart Communication",
      desc: "Integrated AI chat and automated follow-ups help maintain consistent borrower engagement effortlessly.",
    },
    {
      img: "https://i.pinimg.com/736x/61/74/a2/6174a293de0e4a6b812e559dc56d5256.jpg",
      title: "Seamless Integrations",
      desc: "Works smoothly with your LOS, LMS, and accounting tools for a unified, 360° customer management experience.",
    },
  ];

  const advancedSecurity = [
    { icon: <IoShieldCheckmark />, title: "End-to-End Encryption", desc: "All customer and loan data are encrypted both in transit and at rest, guaranteeing 100% data protection." },
    { icon: <FaLock />, title: "Role-Based Access", desc: "Define user permissions precisely to ensure only authorized personnel can view, modify, or approve data." },
    { icon: <VscGraphLine />, title: "Real-Time Threat Monitoring", desc: "Continuous monitoring detects unauthorized access and instantly alerts your admin dashboard for quick response." },
    { icon: <CiCloud />, title: "Secure Cloud Backups", desc: "Automated daily backups ensure no customer data is lost, even in the event of a system failure or outage." },
  ];

  const performanceInsights = [
    { title: "Predictive Analytics", desc: "Forecast trends and customer behavior using advanced AI models." },
    { title: "Smart Dashboards", desc: "Monitor key metrics, loans, and repayments in real-time." },
    { title: "Automated Reports", desc: "Receive instant weekly or monthly reports directly to your inbox." },
    { title: "Data Visualization", desc: "Visual insights turn complex data into clear, actionable charts." },
  ];

  const summaryPoints = [
    {
      title: "Unified AI Workflow",
      desc: "Connect every stage of your customer journey — from lead generation to post-loan support — under one intelligent platform.",
    },
    {
      title: "Enterprise-Level Security",
      desc: "Multi-layer protection, encrypted databases, and access control to ensure your customer data is safe and compliant.",
    },
    {
      title: "Real-Time Efficiency",
      desc: "Instant analytics and automated workflows help your team close deals faster with fewer errors.",
    },
    {
      title: "Seamless Integrations",
      desc: "Works with existing business tools and APIs for a unified ecosystem that's simple and scalable.",
    },
  ];

  return (
    <section className="relative overflow-hidden py-14 md:py-24 bg-gradient-to-br from-[#f8fbff] via-[#eef3ff] to-[#e0e7ff]">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-16 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-16 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Banner */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center py-12 sm:py-14 rounded-3xl overflow-hidden mx-4 sm:mx-6">
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523655223303-4e9ef5234587?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1174')] bg-cover bg-center"
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-blue-900/60 to-transparent"></div>

        <div className="relative z-10 px-2">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center gap-2 bg-white/10 px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium mb-5 border border-white/20 text-white"
          >
            <MdOutlineElectricBolt className="text-yellow-300 text-base sm:text-lg" />
            Cutting-Edge Technology
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 text-white leading-tight"
          >
            Powering the Future of Digital Innovation
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-200 max-w-2xl mx-auto mb-6 text-sm sm:text-base leading-relaxed"
          >
            Experience next-gen features designed to deliver performance,
            reliability, and intelligent solutions for your business growth.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            className="relative z-20 px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-blue-700 font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:bg-blue-50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 cursor-pointer text-sm sm:text-base"
          >
            Explore Features
          </motion.button>
        </div>

        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "60%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-[2px] mx-auto mt-12 sm:mt-16 bg-gradient-to-r from-blue-400 via-indigo-500 to-transparent rounded-full"
        />
      </div>

      {/* Divider */}
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: "60%" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-[2px] mx-auto mt-10 mb-8 bg-gradient-to-r from-blue-400 via-indigo-500 to-transparent rounded-full"
      />

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue mb-3 sm:mb-4">
            Powerful Features
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-10 md:mb-16 max-w-3xl mx-auto leading-relaxed">
            Our AI-driven CRM system automates your entire loan process — from
            lead generation to repayment — ensuring faster operations, zero manual
            errors, and a better customer experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 text-left">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="p-5 sm:p-6 md:p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 will-change-transform transform-gpu"
            >
              <img
                src={feature.img}
                alt={feature.title}
                className="w-full h-40 sm:h-44 md:h-48 object-cover rounded-2xl mb-5 md:mb-6"
              />
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Security Divider */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 0.8 }}
          className="h-[1px] bg-gradient-to-r from-blue-400 via-indigo-500 to-transparent mt-14 mb-8 rounded-full"
        />

        {/* Security Section */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 md:mt-20 text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue mb-3 sm:mb-4">
            Advanced Security & Compliance
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed">
            Protect sensitive customer and financial data with enterprise-grade
            security. Our CRM is built with robust encryption, role-based access
            controls, and audit trails to ensure every interaction and transaction
            remains fully compliant with data protection standards.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-left">
            {advancedSecurity.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="p-5 sm:p-6 md:p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 will-change-transform transform-gpu"
              >
                <div className="w-9 h-9 md:w-10 md:h-10 text-blue mb-3 md:mb-4">{item.icon}</div>
                <h4 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 0.8 }}
          className="h-[1px] bg-gradient-to-r from-blue-400 via-indigo-500 to-transparent mt-14 mb-8 rounded-full"
        />

        {/* Performance Section */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 md:mt-24 text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue mb-3 sm:mb-4">
            Performance & Insights
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed">
            Harness the power of predictive analytics and intelligent reporting.
            Make smarter business decisions with live dashboards and deep AI insights.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-left">
            {performanceInsights.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="p-5 sm:p-6 md:p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 will-change-transform transform-gpu"
              >
                <h4 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 0.8 }}
          className="h-[1px] bg-gradient-to-r from-blue-400 via-indigo-500 to-transparent mt-14 mb-8 rounded-full"
        />

        {/* Why Choose Section */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 md:mt-24"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue mb-3 sm:mb-4">
            Why Choose Our CRM?
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed">
            A platform built to simplify your operations, protect your data, and
            maximize your business efficiency with modern automation.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-left">
            {summaryPoints.map((point, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="p-5 sm:p-6 md:p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 will-change-transform transform-gpu"
              >
                <h4 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2">
                  {point.title}
                </h4>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  {point.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <p className="mt-10 md:mt-12 text-gray-800 font-medium text-base sm:text-lg">
            Experience the future of customer management — simple, smart, and
            secure.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;