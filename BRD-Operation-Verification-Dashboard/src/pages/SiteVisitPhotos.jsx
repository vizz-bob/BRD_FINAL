import React, { useEffect, useState } from "react";
import { getSitePhotos } from "../services/siteVisitService";

const MEDIA_BASE = "http://127.0.0.1:8000";

const SiteVisitPhotos = ({ onBack, reportId = null }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    setLoading(true);
    setError(null);
    try {
      // Pass reportId to filter server-side when provided
      const data = await getSitePhotos(reportId);
      setPhotos(data);
    } catch (err) {
      console.error("Error loading photos:", err);
      setError("Failed to load photos. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resolve image URL.
   * The Django ImageField serializer returns either:
   *   - A full URL: "http://127.0.0.1:8000/media/site_visits/foo.jpg"
   *   - A relative path: "/media/site_visits/foo.jpg"
   * We handle both cases.
   */
  const resolveImageUrl = (photo) => {
    const src = photo.image;
    if (!src) return null;
    return src.startsWith("http") ? src : `${MEDIA_BASE}${src}`;
  };

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={onBack}
        className="px-3 py-2 mb-3 bg-gray-100 rounded-md text-sm"
      >
        Back
      </button>

      {/* Loading / Error states */}
      {loading && (
        <p className="text-gray-500 text-sm">Loading photos…</p>
      )}

      {!loading && error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {/* Photos Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.length > 0 ? (
            photos.map((photo) => {
              const src = resolveImageUrl(photo);
              return src ? (
                <div
                  key={photo.id}
                  className="bg-gray-100 rounded-md overflow-hidden"
                >
                  <img
                    src={src}
                    alt={`Site photo ${photo.id}`}
                    className="w-full h-40 object-cover"
                  />
                </div>
              ) : null;
            })
          ) : (
            <p className="text-gray-500 text-sm col-span-full">
              No photos available.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SiteVisitPhotos;
