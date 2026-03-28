import React from 'react';
import { MapPin, Calendar } from 'lucide-react';

const SiteVisitMap = ({ visits, onViewPhotos = () => {}, onViewReport = () => {} }) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Geo-Tagged Site Visits</h3>
      <div className="space-y-4">
        {visits.map((visit) => (
          <div key={visit.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-3 gap-3">
              <div>
                <h4 className="font-semibold text-gray-900">{visit.title}</h4>
                {/* ✅ 'location' exists in model, 'address' does not */}
                <p className="text-sm text-gray-500 mt-1">{visit.location}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                // ✅ API returns uppercase: 'COMPLETED', 'PENDING'
                visit.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                visit.status === 'PENDING'   ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {/* ✅ Capitalize for display */}
                {visit.status.charAt(0) + visit.status.slice(1).toLowerCase()}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  {/* ✅ API returns latitude + longitude separately */}
                  <span>{visit.latitude}, {visit.longitude}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  {/* ✅ API field is visit_date, not date */}
                  <span>{visit.visit_date}</span>
                </div>
              </div>

              <div className="mt-2 sm:mt-0 flex w-full sm:w-auto gap-2">
                <button
                  onClick={() => onViewPhotos(visit)}
                  className="flex-1 sm:flex-none px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium"
                >
                  {/* ✅ API field is photos_taken, not photoCount */}
                  View Photos ({visit.photos_taken})
                </button>
                <button
                  onClick={() => onViewReport(visit)}
                  className="flex-1 sm:flex-none px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-sm font-medium"
                >
                  View Report
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SiteVisitMap;