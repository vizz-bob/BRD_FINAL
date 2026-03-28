import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Features from "./pages/Feature";
import About from "./pages/About";
import Footer from "./components/Footer";
import TermsConditions from "./pages/TermsConditions";
import CookiePolicy from "./pages/CookiePolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";
import DashboardLinks from "./pages/DashboardLinks";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ScrollToTop from "./components/ScrollToTop";
import Payments from "./pages/Payments";
import Careers from "./pages/Careers";
import SubscriptionPlans from "./pages/SubscriptionPlans";

export default function App() {
  return (
    <Router>
      <div className="relative">
        <Navbar />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/dashboards" element={<DashboardLinks />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/subscription" element={<SubscriptionPlans />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}