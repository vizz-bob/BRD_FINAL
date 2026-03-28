import React from "react";
import NavBar from "../components/Navbar";
import Hero from "../components/Hero";
import GrowthSection from "../components/GrowthSection";
import InfoCard from "../components/InfoCard";
import TestimonialCard from "../components/TestimonialCard";

const Home = () => {
  return (
    <main className="font-sans text-gray-800 bg-white">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur shadow-sm">
        <NavBar />
      </header>

      {/* Hero Section */}
      <section>
        <Hero />
      </section>

      {/* How CRM Works */}
      <section className="bg-gradient-to-b from-[#f8fbff] to-white py-16 md:py-24 px-4 sm:px-8 md:px-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600 mb-4 md:mb-6 leading-tight">
            How Our Loan CRM Works
          </h2>
          <p className="text-gray-600 text-base md:text-lg mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed px-2">
            Experience the future of loan management — automated, intelligent,
            and transparent. Our AI-powered CRM handles everything from lead to
            disbursement seamlessly.
          </p>

          {/* Steps */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-10">
            <InfoCard
              image="https://i.pinimg.com/736x/ce/1e/62/ce1e62fd08189fd0e8c972154a0575a3.jpg"
              title="Lead Management"
              description="Capture and manage loan leads automatically from multiple channels using AI."
            />
            <InfoCard
              image="https://i.pinimg.com/1200x/92/52/03/9252037c09d23aef8f95bd11b0cb872a.jpg"
              title="Smart Verification"
              description="AI verifies borrower details, documents, and eligibility within seconds."
            />
            <InfoCard
              image="https://imgs.search.brave.com/DgDvO0VtyRfBmvWTz1cuV56q8FNhzcY3WwQJVhbFtRo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cHltbnRzLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNS8w/My9maW5hbmNpYWwt/bmVlZC1kZW1hbmRz/LWluc3RhbnQtZGlz/YnVyc2VtZW50cy5q/cGc_dz03Njg"
              title="Instant Disbursement"
              description="Once verified, loans are approved and disbursed instantly — no manual delays."
            />
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-white py-16 md:py-20 px-4 sm:px-8 md:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600 mb-4 leading-tight">
              Our Values
            </h2>
            <p className="text-gray-600 text-base md:text-lg mb-5 leading-relaxed">
              Our vision is to create a future where managing customer
              relationships feels effortless and intelligent. With automation
              and AI at the core,{" "}
              <span className="font-semibold text-blue-600">Xpertland.Ai</span>{" "}
              enables organizations to focus on what truly matters — building
              trust, driving engagement, and achieving sustainable growth.
            </p>
            <p className="text-gray-600 text-base md:text-lg mb-5 leading-relaxed">
              We're not just building software; we're crafting a digital partner
              that understands your business needs. From startups to large
              enterprises, our tools are designed to scale with your journey,
              helping teams collaborate seamlessly, make data-driven decisions,
              and deliver exceptional customer experiences.
            </p>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              At{" "}
              <span className="font-semibold text-blue-600">Xpertland.Ai</span>,
              we believe that growth happens when technology meets human intent.
              Our commitment to innovation, reliability, and continuous
              improvement drives us to simplify complex processes — so you can
              focus on leading your business to new heights.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InfoCard
              image="https://i.pinimg.com/1200x/24/66/1a/24661a325c83c8d64a022e85c6178dc5.jpg"
              title="Customer First"
              description="Putting our customers' needs and success above all else."
            />
            <InfoCard
              image="https://i.pinimg.com/736x/b0/5f/34/b05f34960178759fc195f5c862743589.jpg"
              title="Inclusivity"
              description="Welcoming diverse perspectives to create better solutions together."
            />
            <InfoCard
              image="https://i.pinimg.com/736x/7e/cc/46/7ecc4668ea80ce990d11b36eb4a05dcc.jpg"
              title="Collaboration"
              description="Working together to achieve common goals and drive innovation."
            />
            <InfoCard
              image="https://i.pinimg.com/1200x/0b/f4/48/0bf448e4b4395deceb5226cb5a249391.jpg"
              title="Continuous Growth"
              description="Always learning, improving, and growing — as individuals and as a team."
              highlight
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16 md:py-20 px-4 sm:px-8 md:px-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600 mb-10 md:mb-14 leading-tight">
            What Our Clients Say
          </h2>

          {/* Responsive: stack on mobile, row on md+ */}
          <div className="flex flex-col sm:flex-row gap-6 md:gap-8 justify-center">
            <TestimonialCard
              image="https://i.pinimg.com/1200x/3a/02/39/3a023930d3f5f0460ce6aadc4da9c944.jpg"
              name="SHACHITRIPSHA"
              handle="@SHACHITRIPSHA"
              quote="The team demonstrated strong domain expertise and a clear understanding of enterprise requirements. The solution delivers consistent and measurable value."
            />
            <TestimonialCard
              image="https://i.pinimg.com/736x/eb/76/a4/eb76a46ab920d056b02d203ca95e9a22.jpg"
              name="JIMARORA"
              handle="@JIMARORA"
              quote="We appreciate the platform's focus on compliance, data security, and audit readiness, which aligns well with corporate governance standards."
            />
            <TestimonialCard
              image="https://i.pinimg.com/736x/c9/4c/6c/c94c6c22df0adf7c9745c6e408125e69.jpg"
              name="Guy Hawkins"
              handle="@guythawkins"
              quote="Built-in compliance checks and audit trails have strengthened our risk management and regulatory readiness."
            />
          </div>

          <div className="flex justify-center gap-2 mt-8 md:mt-10">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-400/30"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-gray-400/30"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-gray-400/30"></span>
          </div>
        </div>
      </section>

      {/* Growth Section */}
      <section>
        <GrowthSection />
      </section>
    </main>
  );
};

export default Home;