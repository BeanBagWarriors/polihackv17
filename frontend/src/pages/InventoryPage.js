import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  FaCoins, FaBoxOpen, FaExclamationTriangle, FaCalendarTimes,
  FaCheck, FaExclamationCircle, FaMoneyBillWave, FaHistory,
  FaDollarSign, FaPercentage, FaMapMarkerAlt, FaSyncAlt
} from 'react-icons/fa';
import NotFound from './NotFound';
import { useAuthContext } from '../Hooks/useAuthContext';

const InventoryPage = () => {
  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchMachineData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API}/api/machine/getMachineContent/${id}`);
        
        const data = await response.json();

        console.log(data);
        setMachine(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching machine data:', err);
      } finally {
        setLoading(false);
      }
    };

    if(user && id)
        fetchMachineData();
  }, [id, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!machine) {
    return <NotFound />;
  }

  // Calculate inventory statistics
  const totalItems = machine?.content.reduce((sum, item) => sum + item.amount, 0);
  const lowStockItems = machine?.content.filter(item => item.amount < 10).length;
  const expiringSoonItems = machine?.content.filter(item => {
    if (item.expiryDate === 'unset') return false;
    const expiryDate = new Date(item.expiryDate);
    const today = new Date();
    const daysDifference = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
    return daysDifference < 30 && daysDifference >= 0;
  }).length;

  // Group items by row (assuming keys like A1, A2, B1, B2, etc.)
  const organizeInventoryGrid = () => {
    // Sort items by key to organize properly
    const sortedItems = [...(machine?.content || [])].sort((a, b) => {
      if (!a.key || !b.key) return 0;
      return a.key.localeCompare(b.key);
    });

    // Create a mapping of rows and their slots
    const rows = {};
    sortedItems.forEach(item => {
      if (!item.key) return;
      
      // Extract the row letter (e.g., 'A' from 'A1')
      const rowLetter = item.key.match(/^[A-Za-z]+/)?.[0] || 'Other';
      
      if (!rows[rowLetter]) {
        rows[rowLetter] = [];
      }
      
      rows[rowLetter].push(item);
    });
    
    return rows;
  };
  
  const inventoryGrid = organizeInventoryGrid();

  // Helper function to determine status color and icon
  const getItemStatus = (item) => {
    let statusColor = "bg-green-100 text-green-800";
    let statusText = "OK";
    let statusIcon = <FaCheck className="mr-1" />;
    
    // Low stock check
    if (item.amount < 10) {
      statusColor = "bg-yellow-100 text-yellow-800";
      statusText = "Low Stock";
      statusIcon = <FaExclamationTriangle className="mr-1" />;
    }
    
    // Expired check
    if (item.expiryDate !== 'unset') {
      const expiryDate = new Date(item.expiryDate);
      const today = new Date();
      
      if (expiryDate < today) {
        statusColor = "bg-red-100 text-red-800";
        statusText = "Expired";
        statusIcon = <FaExclamationCircle className="mr-1" />;
      } else {
        const daysDifference = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
        if (daysDifference < 30) {
          statusColor = "bg-yellow-100 text-yellow-800";
          statusText = `Expires ${daysDifference}d`;
          statusIcon = <FaCalendarTimes className="mr-1" />;
        }
      }
    }
    
    // Empty check
    if (item.amount === 0) {
      statusColor = "bg-red-100 text-red-800";
      statusText = "Empty";
      statusIcon = <FaExclamationCircle className="mr-1" />;
    }

    return { statusColor, statusText, statusIcon };
  };

  return (
    <div className="container mx-auto px-4 mt-28">
      <h1 className="text-3xl font-bold mb-2">Inventory: {machine?.name || `Machine ${machine?.id}`}</h1>
      <p className="text-gray-500 mb-6 flex items-center">
        <FaMapMarkerAlt className="mr-2" /> Location: {machine?.location}
      </p>

      {/* Machine Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-600 text-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Total Revenue</h2>
            <FaMoneyBillWave className="text-2xl" />
          </div>
          <p className="text-3xl font-bold">${machine?.totalRevenue?.toFixed(2) || 0}</p>
        </div>
        
        <div className="bg-blue-500 text-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Total Items</h2>
            <FaBoxOpen className="text-2xl" />
          </div>
          <p className="text-3xl font-bold">{totalItems}</p>
        </div>
        
        <div className="bg-yellow-500 text-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Low Stock</h2>
            <FaExclamationTriangle className="text-2xl" />
          </div>
          <p className="text-3xl font-bold">{lowStockItems}</p>
        </div>
        
        <div className="bg-red-500 text-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Expiring Soon</h2>
            <FaCalendarTimes className="text-2xl" />
          </div>
          <p className="text-3xl font-bold">{expiringSoonItems}</p>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Machine Status</h2>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <FaCoins className="mr-2 text-gray-600" />
              <span>Cash Status:</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${machine?.isCashFull ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
              {machine?.isCashFull ? "Collection Needed" : "OK"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FaBoxOpen className="mr-2 text-gray-600" />
              <span>Stock Status:</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${machine?.isStockFull ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {machine?.isStockFull ? "Full" : "Refill Needed"}
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <FaDollarSign className="mr-2 text-gray-600" />
              <span>Active Revenue:</span>
            </div>
            <span className="font-bold">${machine?.activeRevenue?.toFixed(2) || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FaSyncAlt className="mr-2 text-gray-600" />
              <span>Last Updated:</span>
            </div>
            <span>{new Date(machine?.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Vending Machine Grid View */}
      <h3 className="text-2xl font-semibold mb-4">Vending Machine Layout</h3>
      <div className="bg-gray-100 rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 gap-4">
          {Object.entries(inventoryGrid).map(([rowLetter, items]) => (
            <div key={rowLetter} className="mb-4">
              <div className="text-lg font-bold text-gray-700 mb-2">Row {rowLetter}</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {items.map((item) => {
                  const { statusColor, statusText, statusIcon } = getItemStatus(item);
                  
                  return (
                    <div 
                      key={item.key} 
                      className="bg-white rounded-lg border-2 border-gray-200 p-3 shadow-md hover:shadow-lg transition-shadow flex flex-col"
                    >
                      <div className="bg-blue-100 rounded-t-md py-1 px-2 text-center font-bold text-blue-800 mb-2">
                        {item.key}
                      </div>
                      
                      <div className="flex-1 flex flex-col">
                        <h4 className="font-medium text-gray-800 mb-1 truncate">
                          {item.name === 'empty' ? '—' : item.name}
                        </h4>
                        
                        <div className="mb-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Price:</span>
                            <span className="font-medium">${item.retailPrice.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Stock:</span>
                            <span className="font-medium">{item.amount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Expires:</span>
                            <span className="font-medium">
                              {item.expiryDate === 'unset' ? '—' : new Date(item.expiryDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-auto pt-2">
                          <span className={`inline-flex items-center w-full justify-center px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                            {statusIcon} {statusText}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sales History Section */}
      {machine?.salesHistory && machine?.salesHistory.length > 0 && (
        <>
          <h3 className="text-2xl font-semibold mb-4 flex items-center">
            <FaHistory className="mr-2" /> Recent Sales
          </h3>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retail Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Margin</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {machine?.salesHistory.slice(0, 10).map((sale, index) => {
                  const margin = ((sale.retailPrice - sale.originalPrice) / sale.originalPrice * 100).toFixed(1);
                  
                  return (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sale.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                        <FaDollarSign className="mr-1" size={12} />{sale.retailPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                        <FaDollarSign className="mr-1" size={12} />{sale.originalPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                        <FaPercentage className="mr-1" size={12} />{margin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(sale.date).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default InventoryPage;