import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, 
  FaShoppingCart, 
  FaMapMarkerAlt, 
  FaSearch, 
  FaBell,
  FaBoxOpen,
  FaWallet,
  FaEdit,
  FaCheck,
  FaRegLightbulb,
  FaTimes,
  FaChartBar,
  FaExclamationCircle,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaTruck,
  FaTimes as FaClose
} from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [vendingMachines, setVendingMachines] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [lowStockAlerts, setLowStockAlerts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMachine, setEditingMachine] = useState(null);
  const [newMachineName, setNewMachineName] = useState("");
  const [showAlertsPopup, setShowAlertsPopup] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const popupVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };

  // Mock data - replace with API call
  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call
      setTimeout(() => {
        const mockData = [
          {
            id: 1,
            name: "Campus Center",
            location: "University Main Building",
            lastUpdated: "2023-07-15T14:32:00",
            revenue: 1245.80,
            stock: {
              total: 120,
              remaining: 87,
              lowStock: false
            },
            cashDeposit: {
              full: false
            },
            coordinates: {
              lat: 40.7128,
              lng: -74.0060
            }
          },
          {
            id: 2,
            name: "Office Park",
            location: "Building A, Floor 2",
            lastUpdated: "2023-07-15T15:45:00",
            revenue: 876.50,
            stock: {
              total: 150,
              remaining: 42,
              lowStock: true
            },
            cashDeposit: {
              full: true
            },
            coordinates: {
              lat: 40.7200,
              lng: -74.0100
            }
          },
          {
            id: 3,
            name: "Shopping Mall",
            location: "Food Court",
            lastUpdated: "2023-07-14T09:15:00",
            revenue: 2134.25,
            stock: {
              total: 180,
              remaining: 65,
              lowStock: false
            },
            cashDeposit: {
              full: false
            },
            coordinates: {
              lat: 40.7300,
              lng: -74.0050
            }
          },
          {
            id: 4,
            name: "Train Station",
            location: "Main Terminal",
            lastUpdated: "2023-07-15T16:10:00",
            revenue: 945.75,
            stock: {
              total: 100,
              remaining: 23,
              lowStock: true
            },
            cashDeposit: {
              full: true
            },
            coordinates: {
              lat: 40.7500,
              lng: -74.0080
            }
          },
        ];

        setVendingMachines(mockData);
        
        // Calculate total revenue
        const total = mockData.reduce((sum, machine) => sum + machine.revenue, 0);
        setTotalRevenue(total);
        
        // Generate notifications based on machine statuses
        const alerts = [];
        mockData.forEach(machine => {
          if (machine.stock.lowStock) {
            alerts.push({
              id: `stock-${machine.id}-${Date.now()}`,
              machineId: machine.id,
              machineName: machine.name,
              type: 'stock',
              message: `${machine.name} needs restocking`,
              timestamp: new Date(machine.lastUpdated).toLocaleString(),
              icon: <FaExclamationTriangle className="text-amber-500" />,
              severity: 'warning'
            });
          }
          
          if (machine.cashDeposit.full) {
            alerts.push({
              id: `cash-${machine.id}-${Date.now()}`,
              machineId: machine.id,
              machineName: machine.name,
              type: 'cash',
              message: `${machine.name} cash deposit is full`,
              timestamp: new Date(machine.lastUpdated).toLocaleString(),
              icon: <FaMoneyBillWave className="text-red-500" />,
              severity: 'critical'
            });
          }
        });
        
        setNotifications(alerts);
        setLowStockAlerts(alerts.length);
        
        setIsLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  // Filter vending machines based on search
  const filteredMachines = vendingMachines.filter(machine => {
    return machine.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           machine.location.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleAddVendingMachine = () => {
    navigate('/add-machine');
  };
  
  const handleViewAnalytics = () => {
    navigate('/analytics');
  };

  // Start editing a machine name
  const startEditing = (machine) => {
    setEditingMachine(machine.id);
    setNewMachineName(machine.name);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingMachine(null);
    setNewMachineName("");
  };

  // Save the new machine name
  const saveMachineName = (machineId) => {
    if (newMachineName.trim() === "") return;
    
    // Update the machine name
    setVendingMachines(prevMachines => 
      prevMachines.map(machine => 
        machine.id === machineId 
          ? { ...machine, name: newMachineName } 
          : machine
      )
    );
    
    // Reset editing state
    setEditingMachine(null);
    setNewMachineName("");
  };

  // Toggle alerts popup
  const toggleAlertsPopup = () => {
    setShowAlertsPopup(!showAlertsPopup);
  };

  // Format relative time
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="min-h-[calc(100vh-80px)] pt-[80px] bg-[#f5f7ff] p-6">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8" variants={itemVariants}>
          <div>
            <h1 className="text-3xl font-bold text-[#3D52A0]">Vending Machine Dashboard</h1>
            <p className="text-[#8697C4] mt-1">Monitor and manage your vending machine fleet</p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <div className="relative">
              <button 
                className="relative bg-white text-[#3D52A0] px-4 py-2 rounded-lg shadow flex items-center"
                onClick={toggleAlertsPopup}
              >
                <FaBell className="mr-2" />
                <span>Alerts</span>
                {notifications.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Alerts Popup */}
              <AnimatePresence>
                {showAlertsPopup && (
                  <motion.div 
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={popupVariants}
                  >
                    <div className="flex justify-between items-center p-4 border-b border-gray-200">
                      <h3 className="font-bold text-[#3D52A0]">Notifications</h3>
                      <button 
                        className="text-[#8697C4] hover:text-[#3D52A0] transition-colors"
                        onClick={toggleAlertsPopup}
                      >
                        <FaClose />
                      </button>
                    </div>
                    
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-[#8697C4]">
                        <FaRegLightbulb className="mx-auto text-2xl mb-2" />
                        <p>No notifications</p>
                      </div>
                    ) : (
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map(notification => (
                          <div 
                            key={notification.id} 
                            className="p-4 border-b border-gray-100 hover:bg-gray-50"
                          >
                            <div className="flex">
                              <div className="mr-3 mt-1">
                                {notification.icon}
                              </div>
                              <div>
                                <p className="text-[#3D52A0] font-medium">{notification.message}</p>
                                <p className="text-[#8697C4] text-xs mt-1">{formatRelativeTime(notification.timestamp)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="p-2 border-t border-gray-200">
                      <button
                        className="w-full py-2 text-center text-[#7091E6] hover:text-[#3D52A0] text-sm font-medium"
                        onClick={() => {
                          setShowAlertsPopup(false);
                          // Here you could navigate to a full alerts page if needed
                        }}
                      >
                        View All Notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" variants={containerVariants}>
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[#7091E6]"
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[#8697C4] text-sm font-medium">Total Revenue</p>
                <h3 className="text-3xl font-bold text-[#3D52A0] mt-1">${totalRevenue.toFixed(2)}</h3>
                <p className="text-green-500 text-sm mt-1">+5.3% from last month</p>
              </div>
              <div className="bg-[#EDE8F5] p-3 rounded-lg">
                <FaWallet className="text-[#3D52A0] text-2xl" />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[#7091E6]"
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[#8697C4] text-sm font-medium">Total Machines</p>
                <h3 className="text-3xl font-bold text-[#3D52A0] mt-1">{vendingMachines.length}</h3>
                <p className="text-[#8697C4] text-sm mt-1">machines online</p>
              </div>
              <div className="bg-[#EDE8F5] p-3 rounded-lg">
                <FaShoppingCart className="text-[#3D52A0] text-2xl" />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[#7091E6]"
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[#8697C4] text-sm font-medium">Alerts</p>
                <h3 className="text-3xl font-bold text-[#3D52A0] mt-1">{notifications.length}</h3>
                <p className="text-[#8697C4] text-sm mt-1">need attention</p>
              </div>
              <div className="bg-[#EDE8F5] p-3 rounded-lg">
                <FaExclamationCircle className="text-[#3D52A0] text-2xl" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          className="bg-white p-4 rounded-xl shadow-md mb-8 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4"
          variants={itemVariants}
        >
          <div className="relative flex-grow">
            <FaSearch className="absolute left-3 top-3 text-[#8697C4]" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-[#ADBBDA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7091E6]"
              placeholder="Search machines by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className="bg-[#3D52A0] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#7091E6] transition-colors"
            onClick={handleAddVendingMachine}
          >
            <span className="flex items-center">
              <FaPlus className="mr-2" /> Add Machine
            </span>
          </button>
        </motion.div>

        {/* Vending Machines Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3D52A0]"></div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
          >
            {filteredMachines.map((machine) => (
              <motion.div 
                key={machine.id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-[#ADBBDA] hover:shadow-lg transition-shadow"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-grow">
                      {editingMachine === machine.id ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            className="w-full border-b-2 border-[#3D52A0] focus:outline-none focus:border-[#7091E6] text-lg font-bold text-[#3D52A0] bg-transparent mr-2"
                            value={newMachineName}
                            onChange={(e) => setNewMachineName(e.target.value)}
                            autoFocus
                          />
                          <button 
                            onClick={() => saveMachineName(machine.id)}
                            className="text-green-500 hover:text-green-600 ml-1"
                          >
                            <FaCheck size={16} />
                          </button>
                          <button 
                            onClick={cancelEditing}
                            className="text-red-500 hover:text-red-600 ml-1"
                          >
                            <FaTimes size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <h3 className="text-lg font-bold text-[#3D52A0]">{machine.name}</h3>
                          <button 
                            onClick={() => startEditing(machine)}
                            className="text-[#8697C4] hover:text-[#3D52A0] ml-2"
                          >
                            <FaEdit size={14} />
                          </button>
                        </div>
                      )}
                      <p className="text-[#8697C4] text-sm">{machine.location}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-[#f5f7ff] p-3 rounded-lg">
                      <p className="text-[#8697C4] text-xs">Revenue</p>
                      <p className="font-bold text-[#3D52A0]">${machine.revenue.toFixed(2)}</p>
                    </div>
                    <div className="bg-[#f5f7ff] p-3 rounded-lg">
                      <p className="text-[#8697C4] text-xs">Stock</p>
                      <div className="flex items-center">
                        <div className="w-full bg-[#ADBBDA] rounded-full h-2.5 mr-2">
                          <div 
                            className={`h-2.5 rounded-full ${machine.stock.lowStock ? 'bg-red-500' : 'bg-green-500'}`}
                            style={{ width: `${(machine.stock.remaining / machine.stock.total) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-[#3D52A0] text-xs font-medium">{Math.round((machine.stock.remaining / machine.stock.total) * 100)}%</span>
                      </div>
                    </div>
                    
                    {/* Cash Deposit Status - Full width */}
                    <div className="bg-[#f5f7ff] p-3 rounded-lg col-span-2">
                      <p className="text-[#8697C4] text-xs">Cash Available Space</p>
                      <div className="flex items-center mt-1">
                        <div className="flex-grow flex items-center">
                          <div className={`h-3 w-3 rounded-full mr-2 ${machine.cashDeposit?.full ? 'bg-red-500' : 'bg-green-500'}`}></div>
                          <span className="text-[#3D52A0] text-xs font-medium">
                            {machine.cashDeposit?.full ? 'Full - Needs Collection' : 'Available'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-2">
                    <button
                      onClick={() => navigate('/map')}
                      className="flex-1 bg-[#EDE8F5] text-[#3D52A0] py-2 rounded-lg text-sm font-medium text-center hover:bg-[#ADBBDA] transition-colors flex items-center justify-center"
                    >
                      <FaMapMarkerAlt className="mr-2" />
                      See on Map
                    </button>
                    <Link
                      to={`/machine/${machine.id}/stock`}
                      className="flex-1 bg-[#EDE8F5] text-[#3D52A0] py-2 rounded-lg text-sm font-medium text-center hover:bg-[#ADBBDA] transition-colors flex justify-center items-center"
                    >
                      <FaBoxOpen className="mr-2" />
                      Inventory
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Add Machine Card */}
            <motion.div 
              className="bg-white rounded-xl shadow-md overflow-hidden border border-dashed border-[#ADBBDA] flex flex-col justify-center items-center p-6 h-full cursor-pointer"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)", transition: { duration: 0.2 } }}
              onClick={handleAddVendingMachine}
            >
              <div className="bg-[#EDE8F5] p-4 rounded-full mb-4">
                <FaPlus className="text-2xl text-[#3D52A0]" />
              </div>
              <p className="text-[#3D52A0] font-medium">Add New Machine</p>
            </motion.div>
            
            {/* Analytics Card */}
            <motion.div 
              className="bg-gradient-to-br from-[#3D52A0] to-[#7091E6] rounded-xl shadow-md overflow-hidden flex flex-col justify-center items-center p-6 h-full cursor-pointer"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)", transition: { duration: 0.2 } }}
              onClick={handleViewAnalytics}
            >
              <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-4 rounded-full mb-4">
                <FaChartBar className="text-2xl text-white" />
              </div>
              <p className="text-white font-medium mb-1">Advanced Analytics</p>
              <p className="text-white text-sm opacity-80">View detailed reports</p>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;