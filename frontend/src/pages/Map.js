import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const initialLocations = [
  { id: 1, name: 'Unirii Square', lat: 46.7712, lng: 23.6236, neighborhood: '' },
  { id: 2, name: 'Botanical Garden', lat: 46.7719, lng: 23.5896, neighborhood: '' },
  { id: 3, name: 'Central Park', lat: 46.7691, lng: 23.5926, neighborhood: '' },
  { id: 4, name: 'Cluj Arena', lat: 46.7714, lng: 23.5881, neighborhood: '' },
];

const Map = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [locations, setLocations] = useState(initialLocations);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (mapRef.current !== null && mapInstanceRef.current) return;

    // Initialize the map with Cluj-Napoca center and zoom level
    mapInstanceRef.current = L.map(mapRef.current, {
      center: [46.7712, 23.6236], // Set initial center to Cluj
      zoom: 13, // Initial zoom level
      maxZoom: 18, // Set the maximum zoom level
      minZoom: 10, // Set the minimum zoom level
      scrollWheelZoom: true, // Enable mouse wheel zoom
    });

    // Add tiles (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapInstanceRef.current);

    // Create markers for all locations and store them
    const createdMarkers = locations.map((loc) => {
      const marker = L.circleMarker([loc.lat, loc.lng], {
        radius: 20,
        color: 'red',  // Default color is red
        weight: 5,
        opacity: 1,
        fillOpacity: 0.8,
      })
        .addTo(mapInstanceRef.current)
        .bindPopup(`${loc.name}<br>Lat: ${loc.lat}<br>Lng: ${loc.lng}`)
        .openPopup();

      return { ...loc, marker };
    });

    setMarkers(createdMarkers);

  }, [locations]);

  useEffect(() => {
    if (selectedLocation) {
      // Highlight the selected marker in green
      const updatedMarkers = markers.map((loc) => {
        if (loc.id === selectedLocation.id) {
          loc.marker.setStyle({ color: 'green', fillColor: 'green' });
        } else {
          loc.marker.setStyle({ color: 'red', fillColor: 'red' });
        }
        return loc;
      });
      setMarkers(updatedMarkers);

      // Ensure that zoom functionality via mouse wheel is working after setView
      mapInstanceRef.current.once('moveend', () => {
        mapInstanceRef.current.scrollWheelZoom.enable(); // Re-enable scroll zoom after setting the view
      });

      // Center map on the selected location and zoom in (to zoom level 18)
      mapInstanceRef.current.setView([selectedLocation.lat, selectedLocation.lng], 18); // Zoom to level 18
    }
  }, [selectedLocation, markers]);

  return (
    <div className="flex h-screen justify-center items-center space-x-4">
      {/* Map Section */}
      <div className="flex-grow">
        <div
          id="map"
          ref={mapRef}
          className="h-[800px] w-[1400px] ml-2.5 border-2 border-gray-500 rounded-md shadow-lg"
        />
      </div>

      {/* Table Section moved to the left */}
      <div className="p-4 overflow-auto bg-white shadow-inner border-l h-[calc(100vh-100px)] mt-8 ml-0">
        <h2 className="text-xl font-semibold mb-2">Select a Location</h2>
        <table className="w-full border border-gray-300 text-left text-sm mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Lat</th>
              <th className="border px-2 py-1">Lng</th>
              <th className="border px-2 py-1">Neighborhood</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((loc) => (
              <tr
                key={loc.id}
                onClick={() => setSelectedLocation(loc)}
                className="cursor-pointer hover:bg-blue-100"
              >
                <td className="border px-2 py-1">{loc.name}</td>
                <td className="border px-2 py-1">{loc.lat}</td>
                <td className="border px-2 py-1">{loc.lng}</td>
                <td className="border px-2 py-1">
                  {loc.neighborhood || 'Not specified'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Map;
