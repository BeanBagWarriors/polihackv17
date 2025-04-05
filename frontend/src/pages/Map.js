import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { FaSearch, FaArrowLeft, FaMapMarkerAlt, FaMoneyBillWave, FaInfoCircle, FaLocationArrow, FaPlus, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../Hooks/useAuthContext';
import ven from '../assets/ven.png';

// Define vending machine icon
const VendingIcon = L.icon({
  iconUrl: ven,
  iconSize: [64, 64],
  iconAnchor: [16, 40],
  popupAnchor: [0, -40],
});

const Map = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isGeolocating, setIsGeolocating] = useState(false); // Nou state pentru geolocalizare
  const [locationInfo, setLocationInfo] = useState(null); // Nou state pentru informații locație
  const [userLocationMarker, setUserLocationMarker] = useState(null); // Marker pentru locația utilizatorului
  const { user } = useAuthContext();
  const navigate = useNavigate();

  // Fetch machine data from API
  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API}/api/machine/getUserMachines/${user?.username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch machines');
        }

        const machines = await response.json();
        
        // Transform machines data for map display
        const formattedLocations = machines.map(machine => {
          // Parsează string-ul de locație "latitudine,longitudine" în valori separate
          const [lat, lng] = machine.location ? machine.location.split(',').map(parseFloat) : [46.7712, 23.6236];
          
          // Determină vecinătatea bazată pe coordonate (simulare - ar trebui înlocuit cu geocoding real)
          const neighborhood = determineNeighborhood(lat, lng);
          
          return {
            id: machine.id,
            name: machine.name || 'Unnamed Machine',
            lat: lat,
            lng: lng,
            neighborhood: neighborhood,
            status: machine.isStockFull ? 'needs_restock' : 'active',
            lastSale: machine.salesHistory && machine.salesHistory.length > 0 
              ? new Date(machine.salesHistory[0].date).toLocaleDateString('en-US', { 
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                }) 
              : 'No data',
            revenue: `$${machine.totalRevenue?.toFixed(2) || '0.00'}`,
            alerts: (machine.isStockFull ? 1 : 0) + (machine.isCashFull ? 1 : 0)
          };
        });

        setLocations(formattedLocations);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching machines:', error);
        setIsLoading(false);
      }
    };

    if(user)
      fetchMachines();
  }, [user]);

  // Funcție pentru a determina vecinătatea bazată pe coordonate
  const determineNeighborhood = (lat, lng) => {
    // Această implementare este simplificată și bazată pe coordonate aproximative pentru Cluj-Napoca
    // Într-o implementare reală ar trebui înlocuită cu un serviciu de geocoding
    if (lat > 46.78 && lng > 23.60) return "Mărăști";
    if (lat > 46.77 && lng < 23.58) return "Mănăștur";
    if (lat < 46.76 && lng > 23.59) return "Centru";
    if (lat > 46.77 && lng > 23.59) return "Gheorgheni";
    return "Cluj-Napoca";
  };

  // Funcție pentru a intui locația utilizatorului
  const intuitLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    setIsGeolocating(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Centrează harta pe poziția utilizatorului
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 16);
          
          // Elimină markerul anterior dacă există
          if (userLocationMarker) {
            userLocationMarker.remove();
          }
          
          // Adaugă marker pentru poziția utilizatorului
          const newUserMarker = L.marker([latitude, longitude], {
            icon: L.divIcon({
              html: `
                <div class="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full border-2 border-white">
                  <div class="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div class="ripple"></div>
              `,
              className: 'user-location-marker',
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            })
          }).addTo(mapInstanceRef.current);
          
          setUserLocationMarker(newUserMarker);
          
          // Adaugă cerc de acuratețe
          const accuracyCircle = L.circle([latitude, longitude], {
            radius: position.coords.accuracy / 2,
            fillColor: '#3b82f6',
            fillOpacity: 0.15,
            color: '#3b82f6',
            weight: 1
          }).addTo(mapInstanceRef.current);
          
          // Determină vecinătatea bazată pe coordonate
          const neighborhood = determineNeighborhood(latitude, longitude);
          
          setLocationInfo({
            lat: latitude,
            lng: longitude,
            accuracy: position.coords.accuracy,
            neighborhood: neighborhood
          });
          
          // Afișează popup cu opțiunea de a adăuga o mașină aici
          const popupContent = `
            <div class="p-3">
              <h3 class="font-bold text-[#3D52A0]">Your Location</h3>
              <p class="text-[#8697C4] mb-2">${neighborhood}</p>
              <p class="text-xs text-[#8697C4]">Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}</p>
              <p class="text-xs text-[#8697C4] mb-3">Accuracy: ${(position.coords.accuracy).toFixed(0)}m</p>
              <button id="add-machine-here" class="w-full bg-[#3D52A0] text-white px-3 py-2 rounded text-sm hover:bg-[#7091E6] transition-colors">
                Add Machine Here
              </button>
            </div>
          `;
          
          newUserMarker.bindPopup(popupContent).openPopup();
          
          // Adaugă evenimentul pentru butonul din popup
          setTimeout(() => {
            const addButton = document.getElementById('add-machine-here');
            if (addButton) {
              addButton.addEventListener('click', () => {
                handleAddMachine(latitude, longitude, neighborhood);
              });
            }
          }, 100);
        }
        
        setIsGeolocating(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setIsGeolocating(false);
        alert(`Could not get your location: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Funcție pentru adăugarea unei mașini noi la locația curentă
  const handleAddMachine = (latitude, longitude, neighborhood) => {
    // Pregătește datele pentru noua mașină
    const locationString = `${latitude},${longitude}`;
    
    // Aici ar trebui să implementezi logica pentru a adăuga o mașină nouă cu aceste coordonate
    console.log("Add new machine at:", locationString, neighborhood);
    
    // Navighează către pagina de adăugare mașină cu coordonatele pre-completate
    navigate(`/add-machine?location=${locationString}&neighborhood=${encodeURIComponent(neighborhood)}`);
  };

  // Initialize map
  useEffect(() => {
    if (mapRef.current !== null && mapInstanceRef.current) return;

    // Initialize map centered on Cluj-Napoca
    mapInstanceRef.current = L.map(mapRef.current, {
      center: [46.7712, 23.6236], // Cluj-Napoca center
      zoom: 14,
      zoomControl: false 
    });

    L.control.zoom({
      position: 'topright'
    }).addTo(mapInstanceRef.current);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(mapInstanceRef.current);

    // Add locate control button
    const locateControl = L.control({ position: 'topright' });
    
    locateControl.onAdd = function() {
      const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
      div.innerHTML = `
        <a class="leaflet-control-locate" href="#" title="Show my location" role="button" aria-label="Show my location">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
          </svg>
        </a>
      `;
      
      div.onclick = function(e) {
        e.preventDefault();
        intuitLocation();
        return false;
      };
      
      return div;
    };
    
    locateControl.addTo(mapInstanceRef.current);

    // Clean up on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Clear existing markers and add new ones when locations change
  useEffect(() => {
    if (!mapInstanceRef.current || locations.length === 0) return;

    // Clear existing markers
    markers.forEach(marker => marker.remove());
    const newMarkers = [];

    // Add markers for each location and fit bounds
    const bounds = L.latLngBounds();
    
    locations.forEach(location => {
      // Skip invalid coordinates
      if (isNaN(location.lat) || isNaN(location.lng)) return;
      
      const marker = L.marker([location.lat, location.lng], { icon: VendingIcon })
        .addTo(mapInstanceRef.current);

      // Add popup with information
      const popupContent = `
        <div class="p-3 max-w-xs">
          <h3 class="font-bold text-[#3D52A0] text-lg">${location.name}</h3>
          <p class="text-[#8697C4] mb-2">${location.neighborhood}</p>
          <div class="flex gap-2 items-center">
            <span class="inline-block h-3 w-3 rounded-full ${getStatusColorClass(location.status)}"></span>
            <span class="capitalize text-sm">
              ${getStatusText(location.status)} - Last sale ${location.lastSale}
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
        className: 'custom-popup'
      }).setContent(popupContent);
      
      marker.bindPopup(popup);
      
      marker.on('click', () => {
        setSelectedLocation(location);
      });

      newMarkers.push(marker);
      bounds.extend([location.lat, location.lng]);
    });

    setMarkers(newMarkers);
    
    // Fit map to bounds if we have locations
    if (locations.length > 0 && bounds.isValid()) {
      mapInstanceRef.current.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15
      });
    }
    
    // Add method to window for the popup button to work
    window.viewMachineDetails = (id) => {
      const location = locations.find(loc => loc.id === id);
      if (location) setSelectedLocation(location);
    };
  }, [locations]);

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
    (location.name?.toLowerCase() || '').includes(filter.toLowerCase()) ||
    (location.neighborhood?.toLowerCase() || '').includes(filter.toLowerCase())
  );

  // Helper function to get status color class
  function getStatusColorClass(status) {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'needs_restock': return 'bg-yellow-500';
      case 'inactive': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }
  
  // Helper function to get status text
  function getStatusText(status) {
    switch (status) {
      case 'active': return 'Active';
      case 'maintenance': return 'Maintenance';
      case 'needs_restock': return 'Needs restock';
      case 'inactive': return 'Inactive';
      default: return 'Unknown';
    }
  }

  // Calculate totals
  const totalRevenue = locations.reduce((sum, loc) => {
    const revenue = parseFloat((loc.revenue?.replace('$', '').replace(',', '')) || 0);
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
          
          {/* Buton pentru localizare */}
          <button
            className="mt-4 md:mt-0 flex items-center bg-[#3D52A0] text-white px-4 py-2 rounded-lg hover:bg-[#7091E6] transition-colors"
            onClick={intuitLocation}
            disabled={isGeolocating}
          >
            {isGeolocating ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Finding location...</span>
              </>
            ) : (
              <>
                <FaLocationArrow className="mr-2" />
                <span>Locate Me</span>
              </>
            )}
          </button>
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
            
            {/* Floating Button for Mobile */}
            <div className="absolute bottom-4 right-4 lg:hidden z-10">
              <button 
                className="w-12 h-12 rounded-full bg-[#3D52A0] flex items-center justify-center shadow-lg text-white hover:bg-[#7091E6] transition-colors"
                onClick={intuitLocation}
                disabled={isGeolocating}
              >
                {isGeolocating ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <FaLocationArrow />
                )}
              </button>
            </div>
            
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
              .user-location-marker {
                position: relative;
              }
              .ripple {
                position: absolute;
                width: 24px;
                height: 24px;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                background-color: rgba(59, 130, 246, 0.5);
                border-radius: 50%;
                animation: ripple 2s infinite ease-out;
              }
              @keyframes ripple {
                0% {
                  transform: translate(-50%, -50%) scale(0.5);
                  opacity: 1;
                }
                100% {
                  transform: translate(-50%, -50%) scale(2);
                  opacity: 0;
                }
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
            <div className="p-4 border-b border-[#ADBBDA] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-[#3D52A0]">Machine List</h3>
                <p className="text-[#8697C4] text-sm">
                  {filteredLocations.length} machine{filteredLocations.length !== 1 ? 's' : ''} found
                </p>
              </div>
              
              {/* Add New Machine Button */}
              <button 
                className="flex items-center text-sm bg-[#3D52A0] text-white px-3 py-1 rounded hover:bg-[#7091E6] transition-colors"
                onClick={() => navigate('/add-machine')}
              >
                <FaPlus className="mr-1" /> Add New
              </button>
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
                        <div className="mt-2 flex items-center gap-1 bg-red-50 text-red-700 p-1 rounded text-xs">
                          <FaExclamationTriangle className="text-red-500" />
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
                <span className="capitalize text-[#8697C4]">{getStatusText(selectedLocation.status)}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-[#f5f7ff] p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <FaInfoCircle className="text-[#7091E6] mr-2" />
                  <h3 className="font-medium text-[#3D52A0]">Location</h3>
                </div>
                <p className="text-[#8697C4]">Lat: {selectedLocation.lat.toFixed(6)}</p>
                <p className="text-[#8697C4]">Lng: {selectedLocation.lng.toFixed(6)}</p>
                <button 
                  className="mt-3 text-xs bg-[#7091E6] text-white px-2 py-1 rounded hover:bg-[#3D52A0] transition-colors flex items-center justify-center"
                  onClick={() => intuitLocation()}
                >
                  <FaLocationArrow className="mr-1" /> Show my location
                </button>
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
                <p className="capitalize text-[#8697C4]">{getStatusText(selectedLocation.status)}</p>
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
                  navigate(`/machine/${selectedLocation.id}`);
                }}
              >
                View Full Details
              </button>
            </div>
          </motion.div>
        )}
        
        {/* Location Info Toast - apare când utilizatorul folosește localizarea */}
        {locationInfo && (
          <motion.div 
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-xl shadow-lg max-w-sm w-full z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start">
              <div className="bg-blue-500 p-2 rounded-full mr-3">
                <FaLocationArrow className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#3D52A0]">Location Found</h3>
                <p className="text-[#8697C4] text-sm">{locationInfo.neighborhood}</p>
                <p className="text-xs text-[#8697C4] mt-1">
                  Coordinates: {locationInfo.lat.toFixed(6)}, {locationInfo.lng.toFixed(6)}
                </p>
              </div>
              <button 
                className="text-[#8697C4] hover:text-[#3D52A0]"
                onClick={() => setLocationInfo(null)}
              >
                <FaTimes />
              </button>
            </div>
            <button
              className="mt-3 w-full bg-[#3D52A0] text-white p-2 rounded text-sm hover:bg-[#7091E6] transition-colors"
              onClick={() => {
                const { lat, lng, neighborhood } = locationInfo;
                handleAddMachine(lat, lng, neighborhood);
              }}
            >
              <FaPlus className="inline mr-2" /> Add Machine Here
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Map;