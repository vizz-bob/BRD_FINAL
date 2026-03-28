import React from "react";
import { useState } from "react";

import {
  Mail,
  Phone,
  MapPin,
  BarChart2,
  Link2,
  ToolCase,
  LifeBuoy,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../components/Card";
import FaqSection from "../components/FaqSection";
import { i } from "framer-motion/client";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    purpose: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };
  // Data arrays
  const crmFeatures = [
    {
      icon: <Link2 />,
      title: "Integrations",
      text: "Seamlessly connect your systems",
      moreText:
        "Already using another system? Our specialists assist you in integrating existing databases, credit tools, and payment gateways with our CRM for a smooth, unified experience.",
    },
    {
      icon: <ToolCase />,
      title: "Customization",
      text: "Tailored to your lending needs",
      moreText:
        "Our platform can be tailored to match your organization’s specific loan process, customer data flow, and reporting needs.",
    },
    {
      icon: <BarChart2 />,
      title: "Security",
      text: "Protecting what matters most",
      moreText:
        "Your data is safeguarded through industry-grade encryption, access control, and compliance standards to ensure every transaction remains secure.",
    },
    {
      icon: <LifeBuoy />,
      title: "Support",
      text: "Always here to assist you",
      moreText:
        "Our dedicated technical team provides continuous assistance, ensuring your CRM and loan systems run smoothly with minimal downtime.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-6 py-20 space-y-24">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <h1 className="text-6xl font-extrabold">Let's Connect</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Need help with our CRM system? Contact us for support, request a
            demo, or talk to our sales team.
          </p>
        </motion.div>

        {/* CRM Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-10"
        >
          <h2 className="text-4xl font-bold text-center mb-6">
            Why Contact Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {crmFeatures.map((item, i) => (
              <Card
                key={i}
                {...item}
                hoverEffect={true}
                onClick={() => setSelectedCard(item)}
              />
            ))}
          </div>
        </motion.div>

        {/* Popup Card for selected CRM feature */}
        <AnimatePresence>
          {selectedCard && (
            <motion.div
              className="fixed inset-0 h-full flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCard(null)} // Click outside to close
            >
              <motion.div
                className="p-10 max-w-2xl w-full cursor-auto bg-white rounded-3xl shadow-xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking card
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                    {selectedCard.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    {selectedCard.title}
                  </h3>
                  <p className="text-gray-700 mb-4">{selectedCard.text}</p>
                  {selectedCard.moreText && (
                    <p className="text-gray-600">{selectedCard.moreText}</p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-center mb-6">Our Location</h2>
          <div className="w-full h-96 rounded-3xl overflow-hidden shadow-md border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0866311463883!2d-122.41941568468113!3d37.77492927975905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c5f5e7c15%3A0xa4fbbf12a734cb0!2sSan+Francisco%2C+CA%2C+USA!5e0!3m2!1sen!2sin!4v1696831234567!5m2!1sen!2sin"
              width="100%"
              height="100%"
              className="border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-linear-to-br from-white to-blue-50 rounded-3xl shadow-xl p-10 border border-gray-100"
        >
          {/* Left Side - Info Section */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-5xl font-bold text-gray-900 leading-tight">
              Get in Touch
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Have questions about our CRM platform? Our team is here to guide
              you through every step. Fill out the form, and we’ll respond
              within 24 hours.
            </p>

            <div className="space-y-5">
              <div className="flex items-center gap-3 group">
                <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition">
                  <MapPin className="text-blue-600 w-5 h-5" />
                </div>
                <p className="text-gray-700">
                  123 Demo Street, San Francisco, CA
                </p>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition">
                  <Mail className="text-blue-600 w-5 h-5" />
                </div>
                <p className="text-gray-700">support@crm-demo.com</p>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition">
                  <Phone className="text-blue-600 w-5 h-5" />
                </div>
                <p className="text-gray-700">+1 (555) 123-4567</p>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.form
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="space-y-4 bg-white/60 backdrop-blur-md p-8 rounded-2xl border border-gray-200 shadow-md"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 placeholder-gray-500 transition"
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 placeholder-gray-500 transition"
              />
            </div>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 placeholder-gray-500 transition"
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 placeholder-gray-500 transition"
            />

            <select
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition text-gray-700"
            >
              <option value="">Select Purpose</option>
              <option value="Demo">Request a Demo</option>
              <option value="Sales">Sales Inquiry</option>
              <option value="Support">Technical Support</option>
              <option value="Integration">Integration / Customization</option>
              <option value="Partnership">Partnership</option>
              <option value="Feedback">Feedback / Other</option>
            </select>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              placeholder="Your Message..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 placeholder-gray-500 transition"
            />

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-all"
            >
              Send Message
            </motion.button>
          </motion.form>
        </motion.div>

        <FaqSection />
      </div>
    </div>
  );
};

export default Contact;
