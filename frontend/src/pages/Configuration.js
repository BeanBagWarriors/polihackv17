import React, { useState, useEffect} from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { 
  FaSave, 
  FaEdit, 
  FaMoneyBillWave,
  FaArrowLeft,
  FaShoppingCart,
  FaSort,
  FaTimes
} from 'react-icons/fa';
import { useAuthContext } from '../Hooks/useAuthContext';
import NotFound from './NotFound';


// Mock API service - replace with actual backend calls

// Helper function
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value);
};

// Product Item component for the list
const ProductItem = ({ item, onEdit }) => {
  return (
    <div className="bg-white rounded-lg border border-[#ADBBDA] p-4 mb-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <div className="flex-1">
            <h3 className="font-medium text-[#3D52A0]">{item.name}</h3>
            <div className="flex flex-wrap items-center text-sm mt-1">
              <div className="text-[#8697C4] mr-4">
                <span className="font-medium text-green-600">{formatCurrency(item.retailPrice)}</span> per unit
              </div>
              <div className="text-[#8697C4] mr-4">
                Original price: <span className="font-medium">{formatCurrency(item.originalPrice)}</span>
              </div>
              <div className="text-[#8697C4] mr-4">
                Retail price: <span className="font-medium">{formatCurrency(item.retailPrice)}</span>
              </div>
              <div className="text-[#8697C4]">
                Quantity: <span className="font-medium">{item.amount}</span>
              </div>
            </div>
            <div className="text-xs text-[#8697C4] mt-1">
              Expiry date: <span className="font-medium">{item.expiryDate !== "unset" ? item.expiryDate : "Not set"}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <p className="mr-4 font-medium">{formatCurrency(item.retailPrice * item.amount)}</p>
          <button 
            className="text-[#3D52A0] hover:text-[#7091E6] p-2"
            onClick={() => onEdit(item)}
          >
            <FaEdit />
          </button>
        </div>
      </div>
    </div>
  );
};

// Edit Product Modal


const EditProductModal = ({ item, onSave, onClose }) => {
  const [name, setName] = useState(item.name || "");
  const [retailPrice, setRetailPrice] = useState(item.retailPrice || 0);
  const [originalPrice, setOriginalPrice] = useState(item.originalPrice || 0);
  const [amount, setAmount] = useState(item.amount || 0);
  const [expiryDate, setExpiryDate] = useState(item.expiryDate === "unset" ? "" : item.expiryDate);
  
  const handleSave = () => {
    const updatedProduct = {
      ...item,
      key: item.key,
      name,
      retailPrice,
      originalPrice,
      amount: parseInt(amount) || 0, // Asigură-te că este un număr întreg
      expiryDate: expiryDate || "unset"
    };
    console.log("Saving updated product:", updatedProduct); // Log pentru debug
    onSave(updatedProduct);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <motion.div 
        className="bg-white rounded-xl w-full max-w-md p-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[#3D52A0]">Edit Product</h3>
          <button 
            className="text-[#8697C4] hover:text-[#3D52A0]"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>
        
        {/* Product Name */}
        <div className="mb-4">
          <label className="block text-[#8697C4] text-sm font-medium mb-2">Product Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-[#ADBBDA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7091E6]"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        {/* Retail Price */}
        <div className="mb-4">
          <label className="block text-[#8697C4] text-sm font-medium mb-2">Retail Price ($)</label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-[#8697C4]">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full pl-8 pr-4 py-2 border border-[#ADBBDA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7091E6]"
              value={retailPrice}
              onChange={(e) => setRetailPrice(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
        
        {/* Amount */}
        <div className="mb-4">
          <label className="block text-[#8697C4] text-sm font-medium mb-2">Quantity</label>
          <input
            type="number"
            min="0"
            className="w-full px-4 py-2 border border-[#ADBBDA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7091E6]"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
          />
        </div>
        
        {/* Expiry Date */}
        <div className="mb-6">
          <label className="block text-[#8697C4] text-sm font-medium mb-2">Expiry Date</label>
          <input
            type="date"
            className="w-full px-4 py-2 border border-[#ADBBDA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7091E6]"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
          <p className="text-xs text-[#8697C4] mt-1">Leave empty if no expiry date</p>
        </div>
        
        <div className="bg-[#f5f7ff] p-4 rounded-lg mb-6">
          <div className="flex justify-between text-[#3D52A0]">
            <span>Total value:</span>
            <span className="font-bold">{formatCurrency(retailPrice * amount)}</span>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button 
            className="text-[#8697C4] hover:text-[#3D52A0] mr-4"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="bg-[#3D52A0] text-white px-4 py-2 rounded-lg hover:bg-[#7091E6]"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Main Configuration component
const Configuration = () => {
  const { user } = useAuthContext();
  // Get machine ID from URL params if needed
  // const { machineId } = useParams(); // Uncomment if using React Router with URL params
  const {id} = useParams(); // Get the machine ID from the URL
  const machineId = id;
  console.log("Machine ID from URL:", machineId); // Log the machine ID for debugging
  
  // State for machine configuration
  const [machineName, setMachineName] = useState("");
  
  // State for product management
  const [machineProducts, setMachineProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [sortKey, setSortKey] = useState('position');
  
  // Status states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [machineData, setMachineData] = useState(null);
  
  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Load machine data including products
        //const machineData = await apiService.getMachineData(machineId);

        const response = await fetch(`${process.env.REACT_APP_API}/api/machine/getMachineContent/${machineId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const json = await response.json();
        
        if (!response.ok) {
          throw new Error(json.error || "Failed to fetch machine data");
        }
        
        setMachineName(json.name);
        setMachineProducts(json.content);
        console.log("Machine data:", json);
        setMachineData(json);
      } catch (err) {
        console.error("Error loading machine data:", err);
        setError("Failed to load machine data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [machineId]);
  
  // Handle editing a product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };
  
  // Handle saving product changes
  // Handle saving product changes
  const handleSaveProduct = async (updatedProduct) => {
    try {
      // Pregătește datele pentru API
      const payload = {
        id: machineId,
        key: updatedProduct.key,
        name: updatedProduct.name,
        retailPrice: updatedProduct.retailPrice,
        originalPrice: updatedProduct.originalPrice == 0 ? updatedProduct.originalPrice = updatedProduct.retailPrice : updatedProduct.originalPrice,
        expiryDate: updatedProduct.expiryDate,
        amount: updatedProduct.amount // Asigură-te că acest câmp este inclus
      };
      
      console.log("Sending payload:", payload); // Log pentru debug
      
      // Apelează endpoint-ul
      const response = await fetch(`${process.env.REACT_APP_API}/api/machine/setMachineContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || "Failed to update product");
      }
      
      // Actualizează state-ul local după succes
      setMachineProducts(machineProducts.map(product => 
        product.key === updatedProduct.key ? updatedProduct : product
      ));
      
      // Afișează un mesaj de succes (opțional)
      setSuccessMessage("Product updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Închide modalul de editare
      setEditingProduct(null);
      
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Failed to update product: " + error.message);
      setTimeout(() => setError(null), 5000);
    }
  };
  
  // Sort products
  const sortedProducts = [...machineProducts].sort((a, b) => {
    if (sortKey === 'position') {
      return a.position - b.position;
    } else if (sortKey === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortKey === 'price') {
      return a.price - b.price;
    } else if (sortKey === 'quantity') {
      return a.amount - b.amount;
    }
    return 0;
  });
  
  // Calculate machine stats
  const totalItems = machineProducts.reduce((sum, item) => sum + (item.amount || 0), 0);
  
  const totalRevenue = machineProducts.reduce((sum, item) => {
    return sum + (item.retailPrice || 0) * (item.amount || 0);
  }, 0);
  
  // Navigate back to dashboard
const handleBackToDashboard = () => {
    window.location.href = '/dashboard'; // Changed from '/' to '/dashboard'
  };
  
  // Handle saving the configuration

  
  // If still loading initial data
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] pt-[80px] bg-[#f5f7ff] p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3D52A0]"></div>
      </div>
    );
  }


  if(!user){
    return(
      <NotFound/>
    )
  }
  
  return (
    <div className="min-h-[calc(100vh-80px)] pt-[80px] bg-[#f5f7ff] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div className="flex items-center">
            <button 
              className="mr-4 text-[#3D52A0] hover:text-[#7091E6]"
              onClick={handleBackToDashboard}
            >
              <FaArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-[#3D52A0]">Configure Pricing</h1>
              <p className="text-[#8697C4] mt-1">Set prices for products in your vending machine</p>
            </div>
          </div>
        </div>
        
        {/* Error and success messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
            <button 
              className="text-sm underline"
              onClick={() => setError(null)}
            >
              Dismiss
            </button>
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
            <p>{successMessage}</p>
          </div>
        )}
        
        {/* Basic Machine Information */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-[#3D52A0] mb-6">Machine Information</h2>
          
          <div className="mb-6">
            <label className="block text-[#8697C4] text-sm font-medium mb-2">Machine Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-[#ADBBDA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7091E6]"
              placeholder="Enter machine name"
              value={machineName}
              onChange={(e) => setMachineName(e.target.value)}
            />
          </div>
          
          {/* Machine stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <div className="bg-[#f5f7ff] p-4 rounded-lg">
              <p className="text-[#8697C4] text-sm">Products</p>
              <p className="text-xl font-bold text-[#3D52A0]">{machineProducts.length}</p>
            </div>
            <div className="bg-[#f5f7ff] p-4 rounded-lg">
              <p className="text-[#8697C4] text-sm">Total Items</p>
              <p className="text-xl font-bold text-[#3D52A0]">{totalItems}</p>
            </div>
            <div className="bg-[#f5f7ff] p-4 rounded-lg">
              <p className="text-[#8697C4] text-sm">Potential Revenue</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>
        
        {/* Product Configuration */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#3D52A0]">Product Pricing</h2>
            
            {machineProducts.length > 0 && (
              <div className="flex items-center text-sm text-[#8697C4]">
                <span className="mr-2">Sort by:</span>
                <select 
                  className="border border-[#ADBBDA] rounded-lg p-2 text-[#3D52A0]"
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value)}
                >
                  <option value="position">Position</option>
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="quantity">Quantity</option>
                </select>
              </div>
            )}
          </div>
          
          {machineProducts.length > 0 ? (
            <div className="max-h-[400px] overflow-y-auto">
              {sortedProducts.map((item) => (
                <ProductItem 
                  key={item.id}
                  item={item}
                  onEdit={handleEditProduct}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border border-dashed border-[#ADBBDA] rounded-lg">
              <FaShoppingCart className="mx-auto text-4xl text-[#7091E6] mb-4" />
              <h3 className="text-lg font-bold text-[#3D52A0]">No Products Available</h3>
              <p className="text-[#8697C4] mb-6">This machine has no products configured yet</p>
              <p className="text-[#8697C4]">Products will appear here after they are assigned to this machine</p>
            </div>
          )}
        </div>
        
        {/* Edit Product Modal */}
        {editingProduct && (
          <EditProductModal
            item={editingProduct}
            onSave={handleSaveProduct}
            onClose={() => setEditingProduct(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Configuration;