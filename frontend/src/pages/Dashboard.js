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
import { useAuthContext } from '../Hooks/useAuthContext';
import NotFound from './NotFound';
const Dashboard = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [vendingMachines, setVendingMachines] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [lowStockAlerts, setLowStockAlerts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showAddMachinePopup, setShowAddMachinePopup] = useState(false);
  const [machineId, setMachineId] = useState('');
  const [popupError, setPopupError] = useState('');
  const [popupSuccess, setPopupSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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


  const handleAddVendingMachine = () => {
    // Instead of navigating, show popup
    setShowAddMachinePopup(true);
  };
  
  const handleClosePopup = () => {
    setShowAddMachinePopup(false);
    setMachineId('');
    setPopupError('');
    setPopupSuccess('');
  };

  const handleAddMachineToUser = async (e) => {
    e.preventDefault();
    
    if (!machineId) {
      setPopupError('Please enter a machine ID');
      return;
    }

    try {
      setIsSubmitting(true);
      setPopupError('');
      
      const response = await fetch(`${process.env.REACT_APP_API}/api/machine/addMachineToUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: user.username, 
          id: machineId 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPopupError(data.error);
      } else {
        setPopupSuccess(data.message || 'Machine added successfully!');
        setMachineId('');
        
        // Refresh machine list after a short delay
        setTimeout(() => {
          fetchData();
          handleClosePopup();
        }, 2000);
      }
    } catch (error) {
      setPopupError('Failed to add machine. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API}/api/machine/getUserMachines/${user?.username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const json = await response.json();

      if(!response.ok){
        console.log(json.error);
        setIsLoading(false);
      }
    
      if(response.ok){
        setIsLoading(false);
        setVendingMachines(json);
      }
      
      // Calculate total revenue
      console.log(json);
      const total = json.reduce((sum, machine) => sum + machine.totalRevenue, 0);
      setTotalRevenue(total);
      
      // // Generate notifications based on machine statuses
      const alerts = [];
      json.forEach(machine => {
        if (machine.isStockFull) {
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
        
        if (machine.isCashFull) {
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
      
      setLowStockAlerts(alerts.length);
      setNotifications(alerts);
      
      setIsLoading(false);
  };

  useEffect(() => {
    if(user)
      fetchData();
  }, [user]);

  // Filter vending machines based on search
  const filteredMachines = vendingMachines.filter(machine => {
    return machine.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           machine.location.toLowerCase().includes(searchTerm.toLowerCase());
  });

  
  const handleViewAnalytics = () => {
    navigate('/analytics');
  };

  if(!user){
    return(
      <NotFound/>
    )
  }

  return (
    <div className="mt-10 min-h-[calc(100vh-80px)] pt-[80px] bg-[#f5f7ff] p-6">
      <AnimatePresence>
        {showAddMachinePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#3D52A0]">Add Machine to Your Account</h3>
                <button 
                  onClick={handleClosePopup}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaClose />
                </button>
              </div>
              
              <form onSubmit={handleAddMachineToUser}>
                <div className="mb-4">
                  <label htmlFor="machineId" className="block text-sm font-medium text-gray-700 mb-1">
                    Machine ID
                  </label>
                  <input
                    type="text"
                    id="machineId"
                    value={machineId}
                    onChange={(e) => setMachineId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7091E6]"
                    placeholder="Enter the machine ID"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the ID of the machine you want to add to your account
                  </p>
                </div>
                
                {popupError && (
                  <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
                    {popupError}
                  </div>
                )}
                
                {popupSuccess && (
                  <div className="mb-4 p-2 bg-green-100 text-green-700 rounded-md text-sm">
                    {popupSuccess}
                  </div>
                )}
                
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={handleClosePopup}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#3D52A0] rounded-md hover:bg-[#7091E6] disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Add Machine'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
                <h3 className="text-3xl font-bold text-[#3D52A0] mt-1">${totalRevenue}</h3>
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
                        <div className="flex items-center">
                          <h3 className="text-lg font-bold text-[#3D52A0]">{machine.name}</h3>
                          <button 
                            className="text-[#8697C4] hover:text-[#3D52A0] ml-2"
                          >
                            <FaEdit size={14} />
                          </button>
                        </div>
                      <p className="text-[#8697C4] text-sm">{machine.location}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-[#f5f7ff] p-3 rounded-lg">
                      <p className="text-[#8697C4] text-xs">Revenue</p>
                      <p className="font-bold text-[#3D52A0]">${machine.totalRevenue}</p>
                    </div>
                    <div className="bg-[#f5f7ff] p-3 rounded-lg">
                      <p className="text-[#8697C4] text-xs mb-2">Stock</p>
                      <div className="flex items-center">
                        <div className="w-full bg-[#ADBBDA] rounded-full h-2.5 mr-2">
                          <div 
                            className={`h-2.5 rounded-full ${machine.isStockFull ? 'bg-red-500' : 'bg-green-500'}`}
                            style={{ width: `${machine.isStockFull ? '90%' : '40%'}%` }}
                          ></div>
                        </div>
                        <span className="text-[#3D52A0] text-xs font-medium">
                          {machine.isStockFull ? 'Low' : 'OK'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Cash Deposit Status - Full width */}
                    <div className="bg-[#f5f7ff] p-3 rounded-lg col-span-2">
                      <p className="text-[#8697C4] text-xs">Cash Available Space</p>
                      <div className="flex items-center mt-1">
                        <div className="flex-grow flex items-center">
                          <div className={`h-3 w-3 rounded-full mr-2 ${machine.isCashFull ? 'bg-red-500' : 'bg-green-500'}`}></div>
                          <span className="text-[#3D52A0] text-xs font-medium">
                            {machine.isCashFull ? 'Full - Needs Collection' : 'Available'}
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