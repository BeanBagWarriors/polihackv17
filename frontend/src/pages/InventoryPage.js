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

//   if (error) {
//     return (
//       <div className="container mx-auto px-4 mt-8">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//           <strong className="font-bold">Error:</strong>
//           <span className="block sm:inline"> {error}</span>
//         </div>
//       </div>
//     );
//   }

  if (!machine) {
    return (
      <NotFound/>    
    );
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

  return (
    <div className="container mx-auto px-4 mt-28    ">
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

      {/* Inventory Table */}
      <h3 className="text-2xl font-semibold mb-4">Inventory Items</h3>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Price</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retail Price</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {machine?.content.map((item, index) => {
              // Calculate item status
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
                    statusText = `Expires in ${daysDifference} days`;
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

              return (
                <tr key={item.key || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.key}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.name === 'empty' ? '—' : item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.originalPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.retailPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.expiryDate === 'unset' ? '—' : new Date(item.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                      {statusIcon} {statusText}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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