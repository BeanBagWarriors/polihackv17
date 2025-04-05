import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaSave, 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaCog, 
  FaExchangeAlt,
  FaMoneyBillWave,
  FaArrowLeft
} from 'react-icons/fa';

// Mock API service - replace with actual backend calls
const apiService = {
  getVendingMachineTypes: async () => {
    return [
      { id: 1, name: "Standard", rows: 6, columns: 5, description: "30 slots (6×5)" },
      { id: 2, name: "Compact", rows: 5, columns: 4, description: "20 slots (5×4)" },
      { id: 3, name: "Large", rows: 8, columns: 6, description: "48 slots (8×6)" },
      { id: 4, name: "Mini", rows: 4, columns: 3, description: "12 slots (4×3)" },
      { id: 5, name: "Custom", rows: 6, columns: 6, description: "Fully customizable" }
    ];
  },
  
  getProducts: async () => {
    return [
      { id: 1, name: "Cola", defaultPrice: 1.50, image: "🥤" },
      { id: 2, name: "Water", defaultPrice: 1.00, image: "💧" },
      { id: 3, name: "Chocolate", defaultPrice: 1.75, image: "🍫" },
      { id: 4, name: "Chips", defaultPrice: 1.25, image: "🍟" },
      { id: 5, name: "Sandwich", defaultPrice: 3.50, image: "🥪" },
      { id: 6, name: "Energy Drink", defaultPrice: 2.25, image: "⚡" },
      { id: 7, name: "Candy", defaultPrice: 0.75, image: "🍬" },
      { id: 8, name: "Protein Bar", defaultPrice: 2.00, image: "🍫" },
      { id: 9, name: "Gum", defaultPrice: 0.50, image: "🍬" },
      { id: 10, name: "Fruit", defaultPrice: 1.25, image: "🍎" },
    ];
  },
  
  saveMachineConfiguration: async (machineConfig) => {
    console.log("Saving configuration:", machineConfig);
    return { success: true, id: 123 };
  }
};

// Helpers
const generateSlotId = (row, col) => `${row}-${col}`;

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value);
};

// ProductSelector component
const ProductSelector = ({ products, onSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div 
        className="bg-white rounded-xl w-full max-w-md p-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-[#3D52A0]">Select Product</h3>
          <button 
            className="text-[#8697C4] hover:text-[#3D52A0]"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        
        <div className="mb-4">
          <input
            type="text"
            className="w-full p-2 border border-[#ADBBDA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7091E6]"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {filteredProducts.length === 0 ? (
            <p className="text-center text-[#8697C4] py-4">No products found</p>
          ) : (
            filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="flex items-center border-b border-gray-100 p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelect(product)}
              >
                <div className="text-2xl mr-3">{product.image}</div>
                <div className="flex-1">
                  <p className="font-medium text-[#3D52A0]">{product.name}</p>
                  <p className="text-sm text-[#8697C4]">{formatCurrency(product.defaultPrice)}</p>
                </div>
                <button 
                  className="bg-[#3D52A0] text-white px-3 py-1 rounded-lg hover:bg-[#7091E6] text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(product);
                  }}
                >
                  Select
                </button>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-4 flex justify-end">
          <button 
            className="text-[#3D52A0] hover:text-[#7091E6]"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Slot component
const Slot = ({ row, col, product, price, quantity, onEdit, isEditing }) => {
  const slotId = generateSlotId(row, col);
  
  return (
    <motion.div 
      className={`border ${isEditing ? 'border-[#3D52A0] shadow-md' : 'border-[#ADBBDA]'} rounded-lg p-2 h-32 flex flex-col justify-between relative transition-all duration-300`}
      whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}
    >
      <div className="absolute top-1 left-1 text-xs text-[#8697C4]">{`${row}${col}`}</div>
      
      {product ? (
        <>
          <div className="flex justify-center items-center text-3xl mt-2">
            {product.image}
          </div>
          <div className="text-center mt-1">
            <p className="font-medium text-[#3D52A0] truncate text-sm">{product.name}</p>
            <div className="flex justify-between items-center mt-1">
              <p className="text-sm font-bold text-green-600">{formatCurrency(price)}</p>
              <p className="text-xs text-[#8697C4]">Qty: {quantity}</p>
            </div>
          </div>
        </>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-[#8697C4]">
          <FaPlus className="mb-2" />
          <p className="text-xs">Empty Slot</p>
        </div>
      )}
      
      <button 
        className="absolute right-1 top-1 text-[#8697C4] opacity-60 hover:opacity-100 bg-white rounded-full p-1 shadow-sm"
        onClick={() => onEdit(slotId)}
      >
        <FaEdit size={14} />
      </button>
    </motion.div>
  );
};

// SlotEditor component
const SlotEditor = ({ slot, products, onSave, onClose, onDelete }) => {
  const [selectedProduct, setSelectedProduct] = useState(slot.product || null);
  const [price, setPrice] = useState(slot.price || 0);
  const [quantity, setQuantity] = useState(slot.quantity || 0);
  const [showProductSelector, setShowProductSelector] = useState(false);
  
  const handleSave = () => {
    onSave({
      slotId: slot.id,
      product: selectedProduct,
      price,
      quantity
    });
  };
  
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setPrice(product.defaultPrice);
    setShowProductSelector(false);
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
          <h3 className="text-xl font-bold text-[#3D52A0]">Configure Slot {slot.id}</h3>
          <button 
            className="text-[#8697C4] hover:text-[#3D52A0]"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        
        <div className="mb-6">
          <label className="block text-[#8697C4] text-sm font-medium mb-2">Product</label>
          {selectedProduct ? (
            <div className="flex items-center border border-[#ADBBDA] rounded-lg p-3">
              <div className="text-3xl mr-3">{selectedProduct.image}</div>
              <div className="flex-1">
                <p className="font-medium text-[#3D52A0]">{selectedProduct.name}</p>
                <p className="text-sm text-[#8697C4]">Default price: {formatCurrency(selectedProduct.defaultPrice)}</p>
              </div>
              <button 
                className="text-[#3D52A0] hover:text-[#7091E6]"
                onClick={() => setShowProductSelector(true)}
              >
                <FaExchangeAlt />
              </button>
            </div>
          ) : (
            <button 
              className="w-full border border-dashed border-[#ADBBDA] rounded-lg p-6 flex flex-col items-center justify-center text-[#8697C4] hover:text-[#3D52A0] hover:border-[#3D52A0]"
              onClick={() => setShowProductSelector(true)}
            >
              <FaPlus className="mb-2" size={20} />
              <span>Select Product</span>
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-[#8697C4] text-sm font-medium mb-2">Price ($)</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-[#8697C4]">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                className="w-full pl-8 pr-4 py-2 border border-[#ADBBDA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7091E6]"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          <div>
            <label className="block text-[#8697C4] text-sm font-medium mb-2">Quantity</label>
            <input
              type="number"
              min="0"
              className="w-full px-4 py-2 border border-[#ADBBDA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7091E6]"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
        
        <div className="flex justify-between">
          <button 
            className="text-red-500 hover:text-red-700 flex items-center"
            onClick={onDelete}
          >
            <FaTrash size={14} className="mr-1" /> Remove Product
          </button>
          <div>
            <button 
              className="text-[#8697C4] hover:text-[#3D52A0] mr-4"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="bg-[#3D52A0] text-white px-4 py-2 rounded-lg hover:bg-[#7091E6] disabled:opacity-50"
              onClick={handleSave}
              disabled={!selectedProduct}
            >
              Save
            </button>
          </div>
        </div>
        
        {showProductSelector && (
          <ProductSelector 
            products={products} 
            onSelect={handleSelectProduct}
            onClose={() => setShowProductSelector(false)}
          />
        )}
      </motion.div>
    </div>
  );
};

// Main Configuration component
const Configuration = () => {
  // State for machine configuration
  const [machineTypes, setMachineTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [customRows, setCustomRows] = useState(6);
  const [customColumns, setCustomColumns] = useState(6);
  const [machineName, setMachineName] = useState("");
  const [machineLocation, setMachineLocation] = useState("");
  
  // State for product management
  const [products, setProducts] = useState([]);
  const [slots, setSlots] = useState({});
  const [currentEditingSlot, setCurrentEditingSlot] = useState(null);
  
  // Status states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Calculate actual rows and columns based on machine type
  const rows = selectedType?.id === 5 ? customRows : selectedType?.rows || 6;
  const columns = selectedType?.id === 5 ? customColumns : selectedType?.columns || 5;
  
  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Load machine types and products in parallel
        const [typeData, productData] = await Promise.all([
          apiService.getVendingMachineTypes(),
          apiService.getProducts()
        ]);
        
        setMachineTypes(typeData);
        setProducts(productData);
        setSelectedType(typeData[0]); // Select the first type by default
      } catch (err) {
        console.error("Error loading configuration data:", err);
        setError("Failed to load configuration data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Handle slot editing
  const handleEditSlot = (slotId) => {
    setCurrentEditingSlot({
      id: slotId,
      product: slots[slotId]?.product || null,
      price: slots[slotId]?.price || 0,
      quantity: slots[slotId]?.quantity || 0
    });
  };
  
  // Handle slot update
  const handleSaveSlot = (slotData) => {
    setSlots(prev => ({
      ...prev,
      [slotData.slotId]: {
        product: slotData.product,
        price: slotData.price,
        quantity: slotData.quantity
      }
    }));
    setCurrentEditingSlot(null);
  };
  
  // Handle removing product from slot
  const handleDeleteSlot = () => {
    if (!currentEditingSlot) return;
    
    setSlots(prev => {
      const newSlots = { ...prev };
      delete newSlots[currentEditingSlot.id];
      return newSlots;
    });
    
    setCurrentEditingSlot(null);
  };
  
  // Handle saving the entire configuration
  const handleSaveConfiguration = async () => {
    if (!selectedType || !machineName) {
      setError("Please select a machine type and provide a name.");
      return;
    }
    
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const configData = {
        name: machineName,
        location: machineLocation,
        machineTypeId: selectedType.id,
        rows,
        columns,
        slots: Object.keys(slots).map(slotId => {
          const [row, col] = slotId.split('-');
          return {
            row,
            column: col,
            productId: slots[slotId].product?.id,
            price: slots[slotId].price,
            quantity: slots[slotId].quantity
          };
        })
      };
      
      const result = await apiService.saveMachineConfiguration(configData);
      
      if (result.success) {
        setSuccessMessage("Vending machine configuration saved successfully!");
        // Could redirect to the machine list or dashboard here
      }
    } catch (err) {
      console.error("Error saving configuration:", err);
      setError("Failed to save configuration. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Generate slot grid
  const renderSlots = () => {
    const slotElements = [];
    
    for (let r = 1; r <= rows; r++) {
      const rowElements = [];
      
      for (let c = 1; c <= columns; c++) {
        const slotId = generateSlotId(r, c);
        const slotData = slots[slotId] || {};
        
        rowElements.push(
          <Slot
            key={slotId}
            row={r}
            col={c}
            product={slotData.product}
            price={slotData.price}
            quantity={slotData.quantity}
            onEdit={handleEditSlot}
            isEditing={currentEditingSlot?.id === slotId}
          />
        );
      }
      
      slotElements.push(
        <div key={`row-${r}`} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {rowElements}
        </div>
      );
    }
    
    return slotElements;
  };
  
  // Calculate machine stats
  const totalSlots = rows * columns;
  const filledSlots = Object.keys(slots).length;
  const emptySlots = totalSlots - filledSlots;
  
  const totalItems = Object.values(slots).reduce((sum, slot) => sum + (slot.quantity || 0), 0);
  
  const totalRevenue = Object.values(slots).reduce((sum, slot) => {
    return sum + (slot.price || 0) * (slot.quantity || 0);
  }, 0);
  
  // If still loading initial data
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] pt-[80px] bg-[#f5f7ff] p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3D52A0]"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-[calc(100vh-80px)] pt-[80px] bg-[#f5f7ff] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div className="flex items-center">
            <button 
              className="mr-4 text-[#3D52A0] hover:text-[#7091E6]"
              onClick={() => window.history.back()}
            >
              <FaArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-[#3D52A0]">Vending Machine Configuration</h1>
              <p className="text-[#8697C4] mt-1">Set up your machine's layout and products</p>
            </div>
          </div>
          <button 
            className="bg-[#3D52A0] text-white px-6 py-3 rounded-lg hover:bg-[#7091E6] transition-colors flex items-center mt-4 md:mt-0"
            onClick={handleSaveConfiguration}
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            ) : (
              <FaSave className="mr-2" />
            )}
            Save Configuration
          </button>
        </div>
        
        {/* Error and success messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
            <p>{successMessage}</p>
          </div>
        )}
        
        {/* Configuration form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-[#3D52A0] mb-6">Machine Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[#8697C4] text-sm font-medium mb-2">Machine Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-[#ADBBDA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7091E6]"
                placeholder="Enter machine name"
                value={machineName}
                onChange={(e) => setMachineName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[#8697C4] text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-[#ADBBDA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7091E6]"
                placeholder="Enter machine location"
                value={machineLocation}
                onChange={(e) => setMachineLocation(e.target.value)}
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-[#8697C4] text-sm font-medium mb-2">Machine Type</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {machineTypes.map(type => (
                <div
                  key={type.id}
                  className={`border ${selectedType?.id === type.id ? 'border-[#3D52A0] bg-[#f5f7ff]' : 'border-[#ADBBDA]'} rounded-lg p-4 cursor-pointer transition-colors`}
                  onClick={() => setSelectedType(type)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-[#3D52A0]">{type.name}</h3>
                    {selectedType?.id === type.id && (
                      <div className="h-4 w-4 bg-[#3D52A0] rounded-full"></div>
                    )}
                  </div>
                  <p className="text-[#8697C4] text-sm mt-1">{type.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Custom dimensions (only for custom type) */}
          {selectedType?.id === 5 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 bg-[#f5f7ff] rounded-lg border border-[#ADBBDA]">
              <div>
                <label className="block text-[#8697C4] text-sm font-medium mb-2">Rows</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  className="w-full px-4 py-2 border border-[#ADBBDA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7091E6]"
                  value={customRows}
                  onChange={(e) => setCustomRows(parseInt(e.target.value) || 1)}
                />
              </div>
              <div>
                <label className="block text-[#8697C4] text-sm font-medium mb-2">Columns</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  className="w-full px-4 py-2 border border-[#ADBBDA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7091E6]"
                  value={customColumns}
                  onChange={(e) => setCustomColumns(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
          )}
          
          {/* Configuration stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
            <div className="bg-[#f5f7ff] p-4 rounded-lg">
              <p className="text-[#8697C4] text-sm">Total Slots</p>
              <p className="text-xl font-bold text-[#3D52A0]">{totalSlots}</p>
            </div>
            <div className="bg-[#f5f7ff] p-4 rounded-lg">
              <p className="text-[#8697C4] text-sm">Configured Slots</p>
              <p className="text-xl font-bold text-[#3D52A0]">{filledSlots} <span className="text-xs text-[#8697C4]">({emptySlots} empty)</span></p>
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
        
        {/* Slot Configuration */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#3D52A0]">Slot Configuration</h2>
            <div className="text-[#8697C4] text-sm">Click on a slot to configure it</div>
          </div>
          
          {/* Machine visualization */}
          <div className="p-4 border border-[#ADBBDA] rounded-lg bg-[#f9faff] mb-6">
            <div className="space-y-2">
              {renderSlots()}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center text-[#8697C4] text-sm">
              <FaCog className="mr-2" /> 
              <span>{filledSlots} of {totalSlots} slots configured</span>
            </div>
            <div className="flex items-center text-[#8697C4] text-sm">
              <FaMoneyBillWave className="mr-2 text-green-600" />
              <span>Total value: {formatCurrency(totalRevenue)}</span>
            </div>
          </div>
        </div>
        
        {/* Slot Editor Modal */}
        {currentEditingSlot && (
          <SlotEditor
            slot={currentEditingSlot}
            products={products}
            onSave={handleSaveSlot}
            onClose={() => setCurrentEditingSlot(null)}
            onDelete={handleDeleteSlot}
          />
        )}
      </div>
    </div>
  );
};

export default Configuration;