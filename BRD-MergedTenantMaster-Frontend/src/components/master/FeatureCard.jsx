// src/components/FeatureCard.jsx
import React from "react";

const FeatureCard = ({ title, icon, onClick }) => {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : "presentation"}
      className="w-full bg-white rounded-xl p-4 flex items-center space-x-4 hover:shadow-lg transition cursor-pointer"
    >
      <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-lg border">
        {icon}
      </div>
      <h3 className="text-gray-800 text-base font-semibold">{title}</h3>
    </div>
  );
};

export default FeatureCard;
