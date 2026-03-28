import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';

const PlatformSelector = ({ selectedPlatforms, onToggle }) => {
  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'blue' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'pink' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'blue' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'sky' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'red' }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {platforms.map((platform) => {
        const Icon = platform.icon;
        const isSelected = selectedPlatforms.includes(platform.id);

        return (
          <button
            key={platform.id}
            type="button"
            onClick={() => onToggle(platform.id)}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
              isSelected
                ? `border-${platform.color}-500 bg-${platform.color}-50`
                : 'border-gray-300 hover:border-gray-400 bg-white'
            }`}
          >
            <Icon className={`w-8 h-8 mb-2 ${isSelected ? `text-${platform.color}-600` : 'text-gray-600'}`} />
            <span className={`text-sm font-medium ${isSelected ? `text-${platform.color}-700` : 'text-gray-700'}`}>
              {platform.name}
            </span>
            {isSelected && (
              <div className="mt-2 w-2 h-2 bg-green-500 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default PlatformSelector;