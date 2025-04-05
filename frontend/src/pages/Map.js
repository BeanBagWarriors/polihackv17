import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { FaSearch, FaArrowLeft, FaMapMarkerAlt, FaMoneyBillWave, FaInfoCircle } from 'react-icons/fa';
import ven from '../assets/ven.png'; // Assuming you have a vending machine icon in your assets

// Define vending machine icon
const VendingIcon = L.icon({
  iconUrl: ven, // Using your existing ven.png icon
  iconSize: [64, 64],
  iconAnchor: [16, 40],
  popupAnchor: [0, -40],
});

const initialLocations = [
  { 
    id: 1, 
    name: 'Unirii Square', 
    lat: 46.7712, 
    lng: 23.6236, 
    neighborhood: 'Central',
    status: 'active',
    lastSale: '10 minutes ago',
    revenue: '$1,250.75',
    alerts: 0
  },
  { 
    id: 2, 
    name: 'Botanical Garden', 
    lat: 46.7719, 
    lng: 23.5896, 
    neighborhood: 'Grigorescu',
    status: 'active',
    lastSale: '3 hours ago',
    revenue: '$873.50',
    alerts: 2
  },
  { 
    id: 3, 
    name: 'Central Park', 
    lat: 46.7691, 
    lng: 23.5926, 
    neighborhood: 'Grigorescu',
    status: 'maintenance',
    lastSale: '1 day ago',
    revenue: '$450.25',
    alerts: 1
  },
  { 
    id: 4, 
    name: 'Cluj Arena', 
    lat: 46.7714, 
    lng: 23.5881, 
    neighborhood: 'Grigorescu',
    status: 'inactive',
    lastSale: '5 days ago',
    revenue: '$210.50',
    alerts: 3
  },
];

const Map = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [locations, setLocations] = useState(initialLocations);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize map
  useEffect(() => {
    if (mapRef.current !== null && mapInstanceRef.current) return;

    // Initialize the map with Cluj-Napoca center
    mapInstanceRef.current = L.map(mapRef.current, {
      center: [46.7712, 23.6236], // Cluj-Napoca center
      zoom: 14,
      zoomControl: false // We'll add zoom control in a specific position
    });

    // Add zoom control to top-right
    L.control.zoom({
      position: 'topright'
    }).addTo(mapInstanceRef.current);

    // Use your existing map theme (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(mapInstanceRef.current);

    // Set loading to false after map is initialized
    setTimeout(() => setIsLoading(false), 500);

    // Clean up on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Add markers to map
  useEffect(() => {
    if (!mapInstanceRef.current || markers.length > 0) return;

    // Clear existing markers
    markers.forEach(marker => marker.remove());
    const newMarkers = [];

    // Add markers for each location
    locations.forEach(location => {
      const marker = L.marker([location.lat, location.lng], { icon: VendingIcon })
        .addTo(mapInstanceRef.current);

      // Add popup with information - styled to match your theme
      const popupContent = `
        <div class="p-3 max-w-xs">
          <h3 class="font-bold text-[#3D52A0] text-lg">${location.name}</h3>
          <p class="text-[#8697C4] mb-2">${location.neighborhood}</p>
          <div class="flex gap-2 items-center">
            <span class="inline-block h-3 w-3 rounded-full ${getStatusColorClass(location.status)}"></span>
            <span class="capitalize text-sm">
              ${location.status} - Last sale ${location.lastSale}
            </span>
          </div>
          <p class="mt-2 text-[#3D52A0] font-bold">Revenue: ${location.revenue}</p>
          ${location.alerts > 0 ? 
            `<div class="mt-2 bg-red-50 text-red-700 p-2 rounded text-xs">
              ${location.alerts} alert${location.alerts > 1 ? 's' : ''} need attention
            </div>` : 
            ''
          }
          <div class="mt-3 flex justify-end">
            <button 
              class="bg-[#3D52A0] text-white px-3 py-1 rounded text-sm hover:bg-[#7091E6] transition-colors"
              onclick="window.viewMachineDetails(${location.id})"
            >
              View Details
            </button>
          </div>
        </div>
      `;

      const popup = L.popup({
        className: 'custom-popup' // We'll style this with CSS
      }).setContent(popupContent);
      
      marker.bindPopup(popup);
      
      marker.on('click', () => {
        setSelectedLocation(location);
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
    
    // Add method to window for the popup button to work
    window.viewMachineDetails = (id) => {
      const location = locations.find(loc => loc.id === id);
      if (location) setSelectedLocation(location);
    };
  }, [locations, markers]);

  // Update map when selected location changes
  useEffect(() => {
    if (!selectedLocation || !mapInstanceRef.current) return;
    
    // Pan to the selected location
    mapInstanceRef.current.panTo([selectedLocation.lat, selectedLocation.lng], {
      animate: true,
      duration: 0.5
    });
    
    // Open popup for the selected marker
    const marker = markers.find(m => 
      m.getLatLng().lat === selectedLocation.lat && 
      m.getLatLng().lng === selectedLocation.lng
    );
    
    if (marker) {
      marker.openPopup();
    }
  }, [selectedLocation, markers]);

  // Filter locations based on search input
  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(filter.toLowerCase()) ||
    location.neighborhood.toLowerCase().includes(filter.toLowerCase())
  );

  // Helper function to get status color class
  function getStatusColorClass(status) {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'inactive': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }

  // Calculate totals
  const totalRevenue = locations.reduce((sum, loc) => {
    const revenue = parseFloat(loc.revenue?.replace('$', '').replace(',', '') || 0);
    return sum + revenue;
  }, 0);

  return (
    <div className="min-h-[calc(100vh-80px)] pt-[90px] pb-10 px-6 bg-[#f5f7ff]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex flex-col md:flex-row md:justify-between md:items-center mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center">
            <button 
              className="mr-4 text-[#3D52A0] hover:text-[#7091E6] transition-colors"
              onClick={() => window.history.back()}
            >
              <FaArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-[#3D52A0]">Machine Locations</h1>
              <p className="text-[#8697C4] mt-1">View and manage your vending machines</p>
            </div>
          </div>
        </motion.div>

        {/* Filter and Stats */}
        <motion.div 
          className="bg-white p-4 rounded-xl shadow-md mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-grow">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8697C4]" />
              <input
                type="text"
                placeholder="Search by name or neighborhood..."
                className="w-full pl-10 pr-4 py-2 border border-[#ADBBDA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7091E6]"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <div className="flex items-center bg-[#f5f7ff] p-2 rounded-lg">
                <div className="h-8 w-8 rounded-full bg-[#7091E6] flex items-center justify-center text-white mr-2">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <p className="text-xs text-[#8697C4]">Total Machines</p>
                  <p className="font-bold text-[#3D52A0]">{locations.length}</p>
                </div>
              </div>
              
              <div className="flex items-center bg-[#f5f7ff] p-2 rounded-lg">
                <div className="h-8 w-8 rounded-full bg-[#7091E6] flex items-center justify-center text-white mr-2">
                  <FaMoneyBillWave />
                </div>
                <div>
                  <p className="text-xs text-[#8697C4]">Total Revenue</p>
                  <p className="font-bold text-[#3D52A0]">
                    {`$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Map and List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 z-0 relative">
          {/* Map */}
          <motion.div 
            className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ height: '600px', position: 'relative' }}
          >
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-80 z-10 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3D52A0]"></div>
              </div>
            )}
            <div ref={mapRef} style={{ height: '100%', width: '100%' }}></div>
            
            {/* Add custom CSS for the Leaflet popups */}
            <style jsx global>{`
              .custom-popup .leaflet-popup-content-wrapper {
                border-radius: 0.75rem;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
              }
              .custom-popup .leaflet-popup-content {
                margin: 8px;
                font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
              }
              .custom-popup .leaflet-popup-tip {
                background-color: white;
              }
            `}</style>
          </motion.div>
          
          {/* List */}
          <motion.div 
            className="bg-white rounded-xl shadow-md overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="p-4 border-b border-[#ADBBDA]">
              <h3 className="font-bold text-[#3D52A0]">Machine List</h3>
              <p className="text-[#8697C4] text-sm">
                {filteredLocations.length} machine{filteredLocations.length !== 1 ? 's' : ''} found
              </p>
            </div>
            
            <div className="overflow-y-auto max-h-[532px]">
              {isLoading ? (
                <div className="p-6 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#3D52A0]"></div>
                </div>
              ) : filteredLocations.length === 0 ? (
                <div className="p-6 text-center text-[#8697C4]">
                  No machines found matching your search
                </div>
              ) : (
                <div className="divide-y divide-[#ADBBDA]">
                  {filteredLocations.map(location => (
                    <div 
                      key={location.id}
                      className={`p-4 hover:bg-[#f5f7ff] cursor-pointer transition-colors ${selectedLocation?.id === location.id ? 'bg-[#f5f7ff]' : ''}`}
                      onClick={() => setSelectedLocation(location)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-[#3D52A0]">{location.name}</h4>
                        <div className={`h-3 w-3 rounded-full ${getStatusColorClass(location.status)}`}></div>
                      </div>
                      <p className="text-[#8697C4] text-sm mb-2">
                        {location.neighborhood}
                      </p>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#8697C4]">
                          Last sale: {location.lastSale}
                        </span>
                        <span className="font-medium text-green-600">
                          {location.revenue}
                        </span>
                      </div>
                      {location.alerts > 0 && (
                        <div className="mt-2 bg-red-50 text-red-700 p-1 rounded text-xs text-center">
                          {location.alerts} alert{location.alerts > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Selected Machine Details */}
        {selectedLocation && (
          <motion.div 
            className="mt-6 bg-white rounded-xl shadow-md p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-[#3D52A0]">{selectedLocation.name}</h2>
                <p className="text-[#8697C4] mt-1">{selectedLocation.neighborhood}</p>
              </div>
              <div className="flex items-center">
                <span className={`inline-block h-3 w-3 rounded-full ${getStatusColorClass(selectedLocation.status)} mr-2`}></span>
                <span className="capitalize text-[#8697C4]">{selectedLocation.status}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-[#f5f7ff] p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <FaInfoCircle className="text-[#7091E6] mr-2" />
                  <h3 className="font-medium text-[#3D52A0]">Location</h3>
                </div>
                <p className="text-[#8697C4]">Lat: {selectedLocation.lat}</p>
                <p className="text-[#8697C4]">Lng: {selectedLocation.lng}</p>
              </div>
              
              <div className="bg-[#f5f7ff] p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <FaMoneyBillWave className="text-[#7091E6] mr-2" />
                  <h3 className="font-medium text-[#3D52A0]">Revenue</h3>
                </div>
                <p className="text-xl font-bold text-green-600">{selectedLocation.revenue}</p>
                <p className="text-[#8697C4] text-sm">Last sale: {selectedLocation.lastSale}</p>
              </div>
              
              <div className="bg-[#f5f7ff] p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <FaMapMarkerAlt className="text-[#7091E6] mr-2" />
                  <h3 className="font-medium text-[#3D52A0]">Status</h3>
                </div>
                <p className="capitalize text-[#8697C4]">{selectedLocation.status}</p>
                {selectedLocation.alerts > 0 && (
                  <div className="mt-2 bg-red-50 text-red-700 p-1 rounded text-xs">
                    {selectedLocation.alerts} alert{selectedLocation.alerts > 1 ? 's' : ''} need attention
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                className="bg-[#3D52A0] text-white px-4 py-2 rounded-lg hover:bg-[#7091E6] transition-colors"
                onClick={() => {
                  // Navigate to machine detail page
                  console.log(`Navigate to detail page for machine ${selectedLocation.id}`);
                }}
              >
                View Full Details
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Map;