import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY;

const PhotoGallery = ({ destination, itinerary }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(() => Boolean(destination && UNSPLASH_KEY));
  const [scrollPos, setScrollPos] = useState(0);

  const fetchPhotos = useCallback(async (query) => {
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape&client_id=${UNSPLASH_KEY}`
      );
      const data = await res.json();
      return (data.results || []).map(p => ({
        ...p,
        _searchTerm: query,
      }));
    } catch {
      return [];
    }
  }, []);

  const fetchLocationPhotos = useCallback(async () => {
    setLoading(true);

    // Extract unique location names from itinerary activities
    const locationNames = [];
    if (itinerary?.length) {
      itinerary.forEach(day => {
        (day.activities || []).forEach(act => {
          if (act.locationName && !locationNames.includes(act.locationName)) {
            locationNames.push(act.locationName);
          }
        });
      });
    }

    // Pick up to 6 unique locations spread across the trip
    const selectedLocations = [];
    if (locationNames.length <= 6) {
      selectedLocations.push(...locationNames);
    } else {
      // Evenly sample from the list
      const step = Math.floor(locationNames.length / 6);
      for (let i = 0; i < locationNames.length && selectedLocations.length < 6; i += step) {
        selectedLocations.push(locationNames[i]);
      }
    }

    // Fetch 2-3 photos per location in parallel
    let allPhotos = [];

    if (selectedLocations.length > 0) {
      const promises = selectedLocations.map(loc => fetchPhotos(loc));
      const results = await Promise.all(promises);
      results.forEach(batch => {
        // Take top 2 from each to avoid duplicates
        allPhotos.push(...batch.slice(0, 2));
      });
    }

    // Fallback: if we got very few photos from landmarks, supplement with destination search
    if (allPhotos.length < 4) {
      const destPhotos = await fetchPhotos(`${destination} landmark tourist`);
      allPhotos.push(...destPhotos);
    }

    // Final fallback: country/region level
    if (allPhotos.length === 0) {
      const parts = destination.split(',').map(s => s.trim());
      const region = parts.length > 1 ? parts[parts.length - 1] : destination;
      const regionPhotos = await fetchPhotos(`${region} travel tourism`);
      allPhotos.push(...regionPhotos);
    }

    // Remove duplicate photo IDs
    const seen = new Set();
    allPhotos = allPhotos.filter(p => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });

    setPhotos(allPhotos.slice(0, 12));
    setLoading(false);
  }, [destination, itinerary, fetchPhotos]);

  useEffect(() => {
    if (!destination || !UNSPLASH_KEY) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLocationPhotos();
  }, [destination, fetchLocationPhotos]);

  const scroll = (direction) => {
    const container = document.getElementById('photo-gallery-scroll');
    if (!container) return;
    const scrollAmount = 320;
    const newPos = direction === 'left' ? scrollPos - scrollAmount : scrollPos + scrollAmount;
    container.scrollTo({ left: newPos, behavior: 'smooth' });
    setScrollPos(newPos);
  };

  if (loading) {
    return (
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📸 Destination Gallery</h2>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex-shrink-0 w-72 h-48 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (photos.length === 0) return null;

  return (
    <div className="mb-10 relative group">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        📸 Destination Gallery
      </h2>

      {/* Scroll Buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 mt-4 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 mt-4 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110"
      >
        <ChevronRight size={20} />
      </button>

      {/* Photo Strip */}
      <div
        id="photo-gallery-scroll"
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
        onScroll={(e) => setScrollPos(e.target.scrollLeft)}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {photos.map((photo, idx) => (
          <a
            key={photo.id || idx}
            href={photo.links?.html || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 group/photo relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
          >
            <img
              src={photo.urls?.regular || photo.urls?.small}
              alt={photo.alt_description || photo._searchTerm || `${destination} photo`}
              className="w-72 h-48 object-cover"
              loading="lazy"
            />
            {/* Overlay with location name + photographer */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover/photo:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-xs font-semibold truncate">
                  📍 {photo._searchTerm}
                </p>
                <p className="text-white/70 text-xs truncate">
                  📷 {photo.user?.name || 'Unsplash'}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-2 text-right">
        Photos by <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-500">Unsplash</a>
      </p>
    </div>
  );
};

export default PhotoGallery;
