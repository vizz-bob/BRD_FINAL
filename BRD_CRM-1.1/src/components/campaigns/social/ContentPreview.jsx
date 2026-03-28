import React from 'react';
import { Smartphone } from 'lucide-react';

const ContentPreview = ({ formData }) => {
  const getPlatformColors = (platforms) => {
    const colors = {
      facebook: 'blue',
      instagram: 'pink',
      linkedin: 'blue',
      twitter: 'sky',
      youtube: 'red'
    };
    return platforms.map(p => colors[p] || 'gray');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Mobile Preview</h3>
        <Smartphone className="w-5 h-5 text-gray-600" />
      </div>

      <div className="border-4 border-gray-800 rounded-3xl p-4 bg-gray-50 max-w-sm mx-auto">
        {/* Mock Phone Header */}
        <div className="bg-white rounded-t-2xl p-3 mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-blue-500" />
            <div className="flex-1">
              <p className="font-semibold text-sm">Your Company</p>
              <p className="text-xs text-gray-500">Sponsored</p>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="bg-white rounded-b-2xl overflow-hidden">
          {/* Media Preview */}
          {formData.postType === 'image' && formData.mediaFile && (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500 text-sm">Image: {formData.mediaFile.name}</p>
            </div>
          )}

          {formData.postType === 'video' && formData.mediaFile && (
            <div className="w-full h-48 bg-gray-900 flex items-center justify-center">
              <p className="text-white text-sm">Video: {formData.mediaFile.name}</p>
            </div>
          )}

          {/* Caption */}
          <div className="p-3">
            {formData.messageText ? (
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{formData.messageText}</p>
            ) : (
              <p className="text-sm text-gray-400 italic">Your message will appear here...</p>
            )}

            {/* Hashtags */}
            {formData.hashtags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {formData.hashtags.map((tag) => (
                  <span key={tag} className="text-blue-600 text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* CTA Link */}
            {formData.postURL && (
              <div className="mt-3 p-2 bg-gray-100 rounded">
                <p className="text-xs text-blue-600 truncate">{formData.postURL}</p>
              </div>
            )}
          </div>

          {/* Mock Engagement */}
          <div className="border-t border-gray-200 p-3 flex items-center justify-between text-xs text-gray-500">
            <span>👍 ❤️ 124</span>
            <span>12 Comments · 8 Shares</span>
          </div>
        </div>

        {/* Selected Platforms */}
        {formData.platforms.length > 0 && (
          <div className="mt-3 p-2 bg-gray-100 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Will be posted to:</p>
            <div className="flex flex-wrap gap-1">
              {formData.platforms.map((platform) => (
                <span
                  key={platform}
                  className="px-2 py-1 bg-white text-xs rounded capitalize"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Schedule Info */}
        {formData.scheduleDateTime && (
          <div className="mt-2 p-2 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-800">
              📅 Scheduled: {formData.scheduleDateTime} at {formData.scheduleTime || 'TBD'}
            </p>
          </div>
        )}
      </div>

      {/* Status Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Status:</strong> Draft
        </p>
        {formData.approver && (
          <p className="text-xs text-blue-800 mt-1">
            <strong>Approver:</strong> {formData.approver}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContentPreview;