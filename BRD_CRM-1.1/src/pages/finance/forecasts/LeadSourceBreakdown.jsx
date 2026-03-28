// LeadSourceBreakdown.jsx
import React, { useState } from 'react';
import { PieChart, Mail, MessageSquare, Phone, Globe, Users } from 'lucide-react';

const LeadSourceBreakdown = ({ data }) => {
  const [hoveredSource, setHoveredSource] = useState(null);

  if (!data) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const getSourceIcon = (source) => {
    const iconMap = {
      'Email': Mail,
      'SMS': MessageSquare,
      'Dialer': Phone,
      'Landing Page': Globe,
      'Third Party': Users
    };
    return iconMap[source] || Users;
  };

  const colors = [
    { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-500', fill: '#3B82F6' },
    { bg: 'bg-green-500', light: 'bg-green-100', text: 'text-green-600', border: 'border-green-500', fill: '#22C55E' },
    { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-500', fill: '#A855F7' },
    { bg: 'bg-orange-500', light: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-500', fill: '#F97316' },
    { bg: 'bg-pink-500', light: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-500', fill: '#EC4899' }
  ];

  const sourcesWithColors = data.map((source, idx) => ({
    ...source,
    ...colors[idx % colors.length]
  }));

  const total = sourcesWithColors.reduce((sum, source) => sum + source.count, 0);

  // Calculate angles for pie chart
  let currentAngle = 0;
  const slices = sourcesWithColors.map(source => {
    const percentage = (source.count / total) * 100;
    const angle = (percentage / 100) * 360;
    const slice = {
      ...source,
      percentage,
      startAngle: currentAngle,
      endAngle: currentAngle + angle
    };
    currentAngle += angle;
    return slice;
  });

  const createPieSlicePath = (centerX, centerY, radius, startAngle, endAngle) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      `M ${centerX} ${centerY}`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
      'Z'
    ].join(' ');
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const viewBoxSize = 200;
  const centerX = viewBoxSize / 2;
  const centerY = viewBoxSize / 2;
  const radius = 80;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Lead Source Contribution</h3>
          <p className="text-sm text-gray-500 mt-1">
            Distribution across channels
          </p>
        </div>
        <div className="p-2 bg-indigo-100 rounded-xl">
          <PieChart className="w-5 h-5 text-indigo-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="flex items-center justify-center">
          <div className="relative" style={{ width: '200px', height: '200px' }}>
            <svg 
              viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
              className="transform -rotate-90"
            >
              {slices.map((slice, idx) => {
                const isHovered = hoveredSource === slice.source;
                const sliceRadius = isHovered ? radius + 5 : radius;
                
                return (
                  <g key={idx}>
                    <path
                      d={createPieSlicePath(centerX, centerY, sliceRadius, slice.startAngle, slice.endAngle)}
                      fill={slice.fill}
                      className="transition-all duration-200 cursor-pointer"
                      onMouseEnter={() => setHoveredSource(slice.source)}
                      onMouseLeave={() => setHoveredSource(null)}
                      style={{
                        filter: isHovered ? 'brightness(1.1)' : 'none',
                        opacity: isHovered ? 0.9 : 1
                      }}
                    />
                  </g>
                );
              })}
              
              {/* Center circle for donut effect */}
              <circle
                cx={centerX}
                cy={centerY}
                r={radius * 0.5}
                fill="white"
              />
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xs text-gray-500">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{total.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          {sourcesWithColors.map((source, idx) => {
            const Icon = getSourceIcon(source.source);
            const isHovered = hoveredSource === source.source;
            
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredSource(source.source)}
                onMouseLeave={() => setHoveredSource(null)}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                  isHovered ? `${source.light} border-2 ${source.border}` : 'bg-gray-50 border-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${source.bg} rounded-lg`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{source.source}</p>
                    <p className="text-xs text-gray-500">
                      {source.count.toLocaleString()} leads
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${source.text}`}>
                    {source.percentage.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500">
                    ₹{(source.revenue / 100000).toFixed(1)}L
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Performer Highlight */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        {sourcesWithColors.length > 0 && (
          <div className={`${sourcesWithColors[0].light} rounded-xl p-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 ${sourcesWithColors[0].bg} rounded-lg`}>
                  {React.createElement(getSourceIcon(sourcesWithColors[0].source), {
                    className: 'w-5 h-5 text-white'
                  })}
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Top Performing Channel</p>
                  <p className="text-lg font-bold text-gray-900">{sourcesWithColors[0].source}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${sourcesWithColors[0].text}`}>
                  {sourcesWithColors[0].percentage.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-600">of total leads</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadSourceBreakdown;
