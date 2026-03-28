import React from 'react'
import StatsSection from '../components/StatsSection';


const About= () => {
  return (
<div>
<section className="bg-gradient-to-b from-[#f8fbff] to-white py-24 px-6 md:px-16 font-sans">
  <div className="max-w-6xl mx-auto space-y-24">
    
    {/* About Us */}
 <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden rounded-t-[3rem]">
      {/* Background Image */}
      <img
        src="https://images.unsplash.com/photo-1598257006626-48b0c252070d?auto=format&fit=crop&q=80&w=1920"
        alt="CRM Team"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Centered Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
        <h1 className="text-4xl md:text-8xl font-bold mb-3 text-blue-500 ">About Us</h1>
        <p className="text-lg md:text-xl max-w-2xl opacity-90 px-6">
          Empowering businesses to build stronger client relationships through
          smart automation and human-centered CRM design.
        </p>
      </div>
    </section>

    {/* Discover */}
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <img
          src="https://images.unsplash.com/photo-1521790797524-b2497295b8a0"
          alt="CRM Office"
          className="rounded-2xl shadow-lg w-full h-[340px] object-cover"
        />
      </div>
      <div>
        <h3 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
          Discover a World of Smarter Client Management
        </h3>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Our CRM platform simplifies how you interact with customers, track deals, and analyze performance.
          Designed with modern teams in mind, it helps you make faster decisions and deliver a better experience.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Automate repetitive tasks, visualize pipelines, and stay connected anytime, anywhere.
          Whether you’re a startup or an enterprise, we make managing your business effortless.
        </p>
      </div>
    </div>

    {/* Stats */}
    <div className="text-center">
      <h3 className="text-3xl md:text-6xl font-bold text-blue-600 mb-4">Empowering Businesses Worldwide</h3>
      <p className="text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
        Join thousands of teams who use our CRM to build better relationships and grow faster.
      </p>
      <div>
        <StatsSection />
      </div>
        <div>
      <img
        src="https://i.pinimg.com/1200x/d7/e3/29/d7e329582c8ff40640018655205ce9bd.jpg"
        alt="CRM Visual"
        className="w-full h-[80vh] object-cover rounded-2xl shadow-md"
      />
    </div>
    </div>

    {/* Full-width Image */}
  

    {/* Bottom CTA */}
    <div className="grid md:grid-cols-2 gap-10 items-center">
      <div>
        <h3 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
          Smart CRM Solutions for Modern Teams
        </h3>
        <p className="text-gray-700 mb-6 leading-relaxed">
          With our advanced analytics and automation tools, focus on what truly matters — building relationships and driving growth.
          Our platform ensures your business runs efficiently, adapting to your workflow seamlessly.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition">
          Learn More
        </button>
      </div>
      <div>
        <img
          src="https://images.unsplash.com/photo-1553877522-43269d4ea984"
          alt="CRM Dashboard"
          className="rounded-2xl shadow-lg w-full h-[360px] object-cover"
        />
      </div>
    </div>
  </div>
</section>

<section className="relative w-full bg-gradient-to-b from-white via-[#f3f8ff] to-[#e7f0ff] py-28 overflow-hidden">
  <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-blue-100 rounded-full blur-3xl opacity-30 -z-10"></div>

  <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
    {/* Heading */}
    <div className="text-center mb-20">
      <h2 className="text-5xl font-extrabold text-blue-800 mb-6">Why We Built Our CRM</h2>
      <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
        Every great product starts with a problem. We built our AI-powered CRM to fix the chaos of data, 
        communication, and lost opportunities that growing businesses face daily.
      </p>
    </div>

    {/* Section 1: The Problem */}
    <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
      <div>
        <img
          src="https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=800&q=80"
          alt="CRM Problem"
          className="rounded-3xl shadow-xl w-full h-[400px] object-cover"
        />
      </div>
      <div>
        <h3 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">Before CRM — The Challenge</h3>
        <p className="text-gray-600 text-lg mb-4">
          Businesses struggled to keep track of clients, missed leads, and lost opportunities.
          Customer data lived in spreadsheets, conversations got buried in emails, 
          and teams worked in silos — disconnected and inefficient.
        </p>
        <p className="text-gray-600 text-lg">
          It wasn’t about lack of effort. It was about lack of a system that truly connected 
          people, data, and decisions together.
        </p>
      </div>
    </div>

    {/* Section 2: The Realization */}
    <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
      <div className="lg:order-2">
        <img
          src="https://i.pinimg.com/1200x/34/bd/81/34bd81754eeb8a74b932d42deb38354a.jpg"
          alt="AI CRM"
          className="rounded-3xl shadow-xl w-full h-[400px] object-cover"
        />
      </div>
      <div className="lg:order-1">
        <h3 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">The Realization — Relationships Need Intelligence</h3>
        <p className="text-gray-600 text-lg mb-4">
          In today’s digital age, success isn’t just about sales numbers — it’s about connections.
          Companies needed a tool that could automate routine work, 
          analyze data intelligently, and build genuine customer relationships.
        </p>
        <p className="text-gray-600 text-lg">
          That’s where our journey began — creating a CRM that doesn’t just manage customers, 
          but understands them.
        </p>
      </div>
    </div>

    {/* Section 3: The AI Advantage */}
    <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
      <div>
        <img
          src="https://i.pinimg.com/736x/c5/0c/69/c50c69b06689a924024d3ac59709211f.jpg"
          alt="AI Advantage"
          className="rounded-3xl shadow-xl w-full h-[400px] object-cover"
        />
      </div>
      <div>
        <h3 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">The AI Revolution</h3>
        <p className="text-gray-600 text-lg mb-4">
          Traditional CRMs store information. Our CRM learns from it.
          With built-in AI automation, predictive analytics, and real-time recommendations, 
          businesses can act faster, work smarter, and close deals confidently.
        </p>
        <p className="text-gray-600 text-lg">
          From lead scoring to smart insights, our CRM evolves with your business — 
          adapting to every need and opportunity.
        </p>
      </div>
    </div>

    {/* Section 4: Mission + Vision */}
   <div className=" py-28 px-6">
  <div className="max-w-6xl mx-auto text-center">
    {/* Tagline */}
 

    {/* Heading */}
    <h3 className="text-4xl md:text-6xl font-bold text-blue-600 mb-8 leading-tight">
      Our Mission & Vision
    </h3>

    {/* Mission */}
    <p className="text-gray-700 text-lg md:text-xl mb-6 max-w-4xl mx-auto">
      <span className="font-semibold text-blue-700">Mission:</span> To empower every business with intelligent,
      AI-driven tools that simplify customer relationships, automate workflows, and accelerate growth.  
      We believe in turning data into action and making technology feel effortless.
    </p>

    {/* Vision */}
    <p className="text-gray-700 text-lg md:text-xl max-w-4xl mx-auto mb-16">
      <span className="font-semibold text-blue-700">Vision:</span> To redefine CRM through the perfect harmony
      of human connection and artificial intelligence — where technology feels personal, and every interaction
      adds measurable value to your business journey.
    </p>

    {/* Values Section */}
    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      <div className="bg-blue-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition duration-300">
        <img
          src="https://i.pinimg.com/1200x/1c/9b/84/1c9b84614820e16f371043333b534c8f.jpg"
          alt="Innovation"
          className="w-full h-50 object-cover rounded-2xl mx-auto mb-4"
        />
        <h4 className="text-xl font-semibold text-blue-800 mb-2">Innovation</h4>
        <p className="text-gray-600 text-sm">
          We constantly push boundaries, leveraging AI to craft smarter, faster, and more intuitive CRM experiences.
        </p>
      </div>

      <div className="bg-blue-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition duration-300">
       <img
          src="https://i.pinimg.com/1200x/05/37/8e/05378eb79a9453136562166cc0b7e0e9.jpg"
          alt="Innovation"
          className="w-full h-50 object-cover rounded-2xl mx-auto mb-4"
        />
        <h4 className="text-xl font-semibold text-blue-800 mb-2">Trust & Transparency</h4>
        <p className="text-gray-600 text-sm">
          Our platform ensures reliability and data transparency, helping clients build authentic, long-lasting relationships.
        </p>
      </div>

      <div className="bg-blue-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition duration-300">
       <img
          src="https://i.pinimg.com/736x/01/c7/77/01c77745d903f0c95e824be985cd89b8.jpg"
          alt="Innovation"
          className="w-full h-50 object-cover object-top rounded-2xl mx-auto mb-4"
        />
        <h4 className="text-xl font-semibold text-blue-800 mb-2">Growth for All</h4>
        <p className="text-gray-600 text-sm">
          Every feature we build is designed to create measurable impact — helping teams, partners, and customers grow together.
        </p>
      </div>
    </div>
  </div>
</div>


    {/* Section 5: Purpose + CTA */}
  <div className="bg-blue-300 rounded-3xl text-white px-6 py-10 md:px-12 lg:px-20 shadow-2xl w-full overflow-hidden">
  <div className="max-w-4xl mx-auto text-center space-y-10">
    
    {/* Heading */}
    <h3 className="text-4xl md:text-5xl font-bold leading-tight text-blue-600 ">
      Our Purpose
    </h3>

    {/* Description */}
    <p className="text-lg md:text-xl text-blue-100 leading-relaxed text-gray-500 ">
   We built this CRM to give power back to businesses to <span className="font-semibold text-blue-900">automate, simplify, and scale without losing the human touch.</span> 
Every feature, every line of code, was designed to make relationships stronger and work smarter.
At <span className="font-semibold text-blue-600">Xpertland.Ai</span>, we believe technology should adapt to people, not the other way around.
That’s why our platform blends intelligent automation with intuitive design  helping teams stay connected, productive, and truly customer-focused.
From tracking leads to managing clients, we make sure every interaction feels personal, efficient, and impactful.
Our mission is simple: empower businesses of all sizes to grow faster, serve better, and build trust that lasts.
    </p>

     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
      {[
        "https://i.pinimg.com/1200x/a4/b1/cc/a4b1cce02776a873c409d73e1bdf59f7.jpg",
        "https://i.pinimg.com/736x/fe/68/08/fe6808f4b909b9f4f5da1c264c8a3ebf.jpg",
        "https://i.pinimg.com/736x/fd/6f/fe/fd6ffe70706ad20967bfce0cb189e094.jpg",
      ].map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`CRM Visual ${i + 1}`}
          className="w-full h-48 object-cover rounded-xl shadow-md hover:scale-105 transition-transform"
        />
      ))}
    </div>

    {/* CTA Button */}
    <div className="w-full flex justify-center">
      <button className="w-full sm:w-auto bg-white text-blue-700 font-semibold px-8 py-3 rounded-xl shadow-md hover:bg-blue-100 transition-transform hover:scale-105">
        Join the Journey
      </button>
    </div>

    {/* Image Gallery */}
   
  </div>
</div>
  </div>
</section>


</div>

  )
}

export default About
