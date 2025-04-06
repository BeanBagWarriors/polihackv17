import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMicrochip, FaCloud, FaChartBar, FaShoppingCart, FaCreditCard, FaChevronRight, FaCheck, FaArrowLeft, FaInfoCircle, FaQuestionCircle, FaLightbulb } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Product = () => {
  const navigate = useNavigate();
  
  // State for configuration
  const [selectedSlots, setSelectedSlots] = useState(8); // Default 8 slots
  const [quantity, setQuantity] = useState(1);
  const [currentStep, setCurrentStep] = useState(1); // 1: Configure, 2: Checkout, 3: Confirmation
  const [showTooltip, setShowTooltip] = useState(false); // For manual tooltip
  
  // Define base and slot prices
  const prices = {
    base: 39.99,
    extraSlotBundle: 1.99  // Price for every 8 extra slots
  };

  // Slot options - increasing by 8
  const slotOptions = [16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 112, 120, 128, 136, 144, 152, 160];
  
  // Calculate total price - now charging per 8 slots bundle
  const calculateTotal = () => {
    let total = prices.base * quantity;
    if (selectedSlots > 8) { // If more than base slots (8)
      // Calculate how many 8-slot bundles are needed
      const extraSlotBundles = Math.ceil((selectedSlots - 8) / 8);
      total += extraSlotBundles * prices.extraSlotBundle * quantity;
    }
    return total.toFixed(2);
  };

  // Get the number of extra slot bundles
  const getExtraSlotBundles = () => {
    if (selectedSlots <= 8) return 0;
    return Math.ceil((selectedSlots - 8) / 8);
  };
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  // Handle slot selection
  const selectSlots = (slots) => {
    setSelectedSlots(slots);
  };
  
  // Handle quantity changes
  const handleQuantityChange = (amount) => {
    const newQuantity = Math.max(1, quantity + amount);
    setQuantity(newQuantity);
  };
  
  // Submit order
  const handleSubmitOrder = (e) => {
    e.preventDefault();
    // Here you would typically process the payment and send the order to your backend
    setCurrentStep(3); // Move to confirmation step
  };

  // Handle back navigation based on current step
  const handleBackNavigation = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };

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

  // Toggle tooltip visibility
  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] pt-[90px] pb-10 px-6 bg-[#f5f7ff]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex flex-col md:flex-row md:justify-between md:items-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center">
            <button 
              className="mr-4 text-[#3D52A0] hover:text-[#7091E6] transition-colors"
              onClick={handleBackNavigation}
            >
              <FaArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-[#3D52A0]">MyVendingMachine device</h1>
              <p className="text-[#8697C4] mt-1">Configure and purchase your monitoring module</p>
            </div>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-[#3D52A0] text-white' : 'bg-[#ADBBDA] text-white'}`}>
              1
            </div>
            <div className={`h-1 w-16 ${currentStep >= 2 ? 'bg-[#3D52A0]' : 'bg-[#ADBBDA]'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-[#3D52A0] text-white' : 'bg-[#ADBBDA] text-white'}`}>
              2
            </div>
            <div className={`h-1 w-16 ${currentStep >= 3 ? 'bg-[#3D52A0]' : 'bg-[#ADBBDA]'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-[#3D52A0] text-white' : 'bg-[#ADBBDA] text-white'}`}>
              3
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <div className="text-xs text-center w-24 text-[#8697C4]">Configure</div>
            <div className="text-xs text-center w-24 text-[#8697C4]">Checkout</div>
            <div className="text-xs text-center w-24 text-[#8697C4]">Confirmation</div>
          </div>
        </div>

        {currentStep === 1 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Product Showcase */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10"
              variants={itemVariants}
            >
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="relative h-80 bg-gradient-to-r from-[#3D52A0] to-[#7091E6] flex items-center justify-center">
                  <div className="max-w-[250px] p-6 bg-white rounded-2xl shadow-xl transform rotate-12 border-4 border-white">
                    <div className="w-full h-32 bg-[#EDE8F5] rounded-lg flex items-center justify-center mb-4">
                      <FaMicrochip className="text-6xl text-[#3D52A0]" />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <div className="h-2 w-12 bg-[#ADBBDA] rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-2 w-8 bg-[#ADBBDA] rounded-full"></div>
                      <div className="h-2 w-4 bg-[#ADBBDA] rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Visual representation of slots */}
                  <div className="absolute top-1/4 right-1/4 bg-white p-2 rounded-lg shadow-lg">
                    <div className="font-bold text-[#3D52A0] text-xl">{selectedSlots} Slots</div>
                  </div>
                </div>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-[#3D52A0] mb-4">Vending Machine Monitor</h2>
                    <p className="text-[#8697C4] mb-4">
                        Our plug-and-play monitoring module connects to any vending machine to provide real-time data tracking, inventory management, and revenue reporting.
                    </p>
                    <div className="divide-y divide-[#ADBBDA]">
                        <div className="py-3 flex justify-between">
                            <span className="text-[#8697C4]">Dimensions</span>
                            <span className="font-medium text-[#3D52A0]"> 75 × 50 × 10 mm</span>
                        </div>
                        <div className="py-3 flex justify-between">
                            <span className="text-[#8697C4]">Weight</span>
                            <span className="font-medium text-[#3D52A0]">150 grams</span>
                        </div>
                        <div className="py-3 flex justify-between">
                            <span className="text-[#8697C4]">*Dimensions and weight may vary depending on the number of the slots*</span>
                        </div>
                        <div className="py-3 flex justify-between">
                            <span className="text-[#8697C4]">Connectivity</span>
                            <span className="font-medium text-[#3D52A0]">WiFi + GPS (Included)</span>
                        </div>
                    </div>
                    </div>
              </div>

              <div>
                <motion.div className="bg-white rounded-xl shadow-md p-6 mb-6" variants={itemVariants}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-[#3D52A0]">Configure Your Device</h2>
                    <div className="flex items-center">
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-[#8697C4] mb-4">
                      The base module includes WiFi, GPS tracking, and all necessary components for real-time monitoring. 
                      Select how many slots you need for your vending machine products.
                    </p>
                    
                    <div className="bg-[#f5f7ff] p-4 rounded-lg mb-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-[#3D52A0]">Base Device</div>
                        <div className="text-sm text-[#8697C4]">Includes WiFi, GPS, and cloud connectivity</div>
                      </div>
                      <div className="font-bold text-[#3D52A0]">${prices.base.toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <h3 className="font-bold text-[#3D52A0] mb-3 flex items-center">
                      Number of Slots 
                      <div className="relative inline-block ml-2">
                        <FaQuestionCircle 
                          className="text-[#7091E6] cursor-help" 
                          onMouseEnter={toggleTooltip}
                          onMouseLeave={toggleTooltip}
                        />
                        {showTooltip && (
                          <div className="absolute z-10 bg-white p-3 rounded-lg shadow-lg text-sm w-60 right-0 top-full mt-1">
                            The number of slots equals the number of pins needed on the device for each product in your vending machine.
                          </div>
                        )}
                      </div>
                    </h3>
                  </div>
                  
                  {/* Slot selection - now with 8 increment slots */}
                  <div className="grid grid-cols-5 gap-2 mb-6">
                    {slotOptions.map((slots) => (
                      <button
                        key={slots}
                        className={`py-2 rounded-lg border ${selectedSlots === slots 
                          ? 'bg-[#3D52A0] text-white border-[#3D52A0]' 
                          : 'bg-white text-[#8697C4] border-[#ADBBDA] hover:border-[#7091E6]'}`}
                        onClick={() => selectSlots(slots)}
                      >
                        {slots}
                      </button>
                    ))}
                  </div>
                  
                  <div className="mb-2 flex items-center">
                    <span className="text-[#8697C4] mr-2">Price per additional 8 slots:</span>
                    <span className="font-medium text-[#3D52A0]">${prices.extraSlotBundle}</span>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="font-bold text-[#3D52A0] mb-3">Quantity</h3>
                    <div className="flex items-center">
                      <button 
                        className="w-10 h-10 bg-[#f5f7ff] border border-[#ADBBDA] rounded-l-lg flex items-center justify-center"
                        onClick={() => handleQuantityChange(-1)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#8697C4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <div className="w-16 h-10 border-t border-b border-[#ADBBDA] flex items-center justify-center font-medium text-[#3D52A0]">
                        {quantity}
                      </div>
                      <button 
                        className="w-10 h-10 bg-[#f5f7ff] border border-[#ADBBDA] rounded-r-lg flex items-center justify-center"
                        onClick={() => handleQuantityChange(1)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#8697C4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-[#ADBBDA] pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[#8697C4]">Base Price:</span>
                      <span className="font-medium text-[#3D52A0]">${(prices.base * quantity).toFixed(2)}</span>
                    </div>
                    {selectedSlots > 8 && (
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[#8697C4]">Extra Slots Cost:</span>
                        <span className="font-medium text-[#3D52A0]">
                          ${(getExtraSlotBundles() * prices.extraSlotBundle * quantity).toFixed(2)}
                          <span className="text-xs text-[#8697C4] ml-1">
                            ({getExtraSlotBundles()} × 8-slot bundle{getExtraSlotBundles() > 1 ? 's' : ''})
                          </span>
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span className="text-[#3D52A0]">Total:</span>
                      <span className="text-[#3D52A0]">${calculateTotal()}</span>
                    </div>
                  </div>

                  <motion.button
                    className="w-full mt-6 bg-[#3D52A0] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#7091E6] transition-all flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentStep(2)}
                  >
                    Proceed to Checkout <FaChevronRight className="ml-2" />
                  </motion.button>
                </motion.div>

                <motion.div className="bg-[#f5f7ff] border border-[#ADBBDA] rounded-xl p-6" variants={itemVariants}>
                  <div className="flex items-start mb-2">
                    <FaInfoCircle className="text-[#7091E6] mr-3 mt-1" />
                    <p className="text-[#8697C4] text-sm">
                      Remember, you only pay the device cost once. Our business model is based on a 5% share of the additional profits we help you generate.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Benefits section */}
            <motion.div className="bg-white rounded-xl shadow-md p-8 mb-10" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-[#3D52A0] mb-6 text-center">Why Choose Our Monitoring System?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-[#f5f7ff] h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaChartBar className="text-2xl text-[#3D52A0]" />
                  </div>
                  <h3 className="font-bold text-[#3D52A0] mb-2">Real-time Analytics</h3>
                  <p className="text-[#8697C4]">Get instant insights into your sales patterns and inventory levels to optimize your business.</p>
                </div>
                <div className="text-center">
                  <div className="bg-[#f5f7ff] h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCloud className="text-2xl text-[#3D52A0]" />
                  </div>
                  <h3 className="font-bold text-[#3D52A0] mb-2">Cloud-Based Platform</h3>
                  <p className="text-[#8697C4]">Access your data from anywhere with our secure, cloud-based management dashboard.</p>
                </div>
                <div className="text-center">
                  <div className="bg-[#f5f7ff] h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaLightbulb className="text-2xl text-[#3D52A0]" />
                  </div>
                  <h3 className="font-bold text-[#3D52A0] mb-2">Reduced Stockouts</h3>
                  <p className="text-[#8697C4]">Our predictive analysis helps prevent empty machines, ensuring maximum product availability.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div className="md:col-span-2" variants={itemVariants}>
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold text-[#3D52A0] mb-4">Shipping Information</h2>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[#8697C4] text-sm font-medium mb-2" htmlFor="name">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-[#ADBBDA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7091E6]"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[#8697C4] text-sm font-medium mb-2" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-[#ADBBDA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7091E6]"
                      placeholder="john.doe@example.com"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[#8697C4] text-sm font-medium mb-2" htmlFor="address">
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-[#ADBBDA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7091E6]"
                      placeholder="123 Main St"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#8697C4] text-sm font-medium mb-2" htmlFor="city">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-[#ADBBDA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7091E6]"
                      placeholder="New York"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#8697C4] text-sm font-medium mb-2" htmlFor="state">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-[#ADBBDA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7091E6]"
                        placeholder="NY"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[#8697C4] text-sm font-medium mb-2" htmlFor="zip">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        id="zip"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-[#ADBBDA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7091E6]"
                        placeholder="10001"
                        required
                      />
                    </div>
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-[#3D52A0] mb-4">Payment Details</h2>
                <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[#8697C4] text-sm font-medium mb-2" htmlFor="cardName">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-[#ADBBDA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7091E6]"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[#8697C4] text-sm font-medium mb-2" htmlFor="cardNumber">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-[#ADBBDA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7091E6]"
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                      <FaCreditCard className="absolute top-3 right-3 text-[#ADBBDA]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#8697C4] text-sm font-medium mb-2" htmlFor="expiry">
                      Expiration Date
                    </label>
                    <input
                      type="text"
                      id="expiry"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-[#ADBBDA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7091E6]"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#8697C4] text-sm font-medium mb-2" htmlFor="cvv">
                      Security Code (CVV)
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-[#ADBBDA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7091E6]"
                      placeholder="123"
                      required
                    />
                  </div>
                  <div className="md:col-span-2 mt-4">
                    <motion.button
                      type="submit"
                      className="w-full bg-[#3D52A0] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#7091E6] transition-all flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Complete Purchase <FaChevronRight className="ml-2" />
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-[#3D52A0] mb-4">Order Summary</h2>
                
                <div className="border-b border-[#ADBBDA] pb-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="bg-[#f5f7ff] w-12 h-12 rounded-lg flex items-center justify-center mr-3">
                        <FaMicrochip className="text-xl text-[#3D52A0]" />
                      </div>
                      <div>
                        <div className="font-medium text-[#3D52A0]">Base Device</div>
                        <div className="text-xs text-[#8697C4]">WiFi & GPS included</div>
                      </div>
                    </div>
                    <div className="font-medium text-[#3D52A0]">${(prices.base * quantity).toFixed(2)}</div>
                  </div>
                  
                  {selectedSlots > 8 && (
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="bg-[#f5f7ff] w-12 h-12 rounded-lg flex items-center justify-center mr-3">
                          <div className="font-bold text-[#3D52A0]">{selectedSlots}</div>
                        </div>
                        <div>
                          <div className="font-medium text-[#3D52A0]">Product Slots</div>
                          <div className="text-xs text-[#8697C4]">
                            {getExtraSlotBundles()} × 8-slot bundle{getExtraSlotBundles() > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                      <div className="font-medium text-[#3D52A0]">
                        ${(getExtraSlotBundles() * prices.extraSlotBundle * quantity).toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-[#8697C4]">Subtotal</span>
                    <span className="font-medium text-[#3D52A0]">${calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-[#8697C4]">Shipping</span>
                    <span className="font-medium text-[#3D52A0]">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8697C4]">Tax</span>
                    <span className="font-medium text-[#3D52A0]">Calculated at checkout</span>
                  </div>
                </div>
                
                <div className="border-t border-[#ADBBDA] pt-4">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span className="text-[#3D52A0]">Total</span>
                    <span className="text-[#3D52A0]">${calculateTotal()}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    className="w-full bg-white border border-[#3D52A0] text-[#3D52A0] px-6 py-3 rounded-lg hover:bg-[#f5f7ff] transition-all"
                    onClick={handleBackNavigation}
                  >
                    Edit Configuration
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="bg-white rounded-xl shadow-md p-8 max-w-3xl mx-auto"
          >
            <motion.div className="text-center" variants={itemVariants}>
              <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <FaCheck className="text-green-500 text-4xl" />
              </div>
              <h2 className="text-3xl font-bold text-[#3D52A0] mb-4">Thank You For Your Order!</h2>
              <p className="text-[#8697C4] mb-6">
                Your order has been successfully placed. We've sent a confirmation email to <span className="font-medium text-[#3D52A0]">{formData.email}</span>.
              </p>
              
              <div className="bg-[#f5f7ff] p-6 rounded-lg mb-8 text-left">
                <h3 className="font-bold text-[#3D52A0] mb-2">Order Summary</h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#8697C4]">Order Number:</span>
                    <span className="font-medium text-[#3D52A0]">VP-{Math.floor(Math.random() * 10000)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#8697C4]">Date:</span>
                    <span className="font-medium text-[#3D52A0]">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#8697C4]">Device Configuration:</span>
                    <span className="font-medium text-[#3D52A0]">{selectedSlots}-Slot Monitoring Device</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8697C4]">Total Amount:</span>
                    <span className="font-medium text-[#3D52A0]">${calculateTotal()}</span>
                  </div>
                </div>
                
                <h3 className="font-bold text-[#3D52A0] mb-2">Shipping Address</h3>
                <p className="text-[#8697C4] text-sm">
                  {formData.name}<br />
                  {formData.address}<br />
                  {formData.city}, {formData.state} {formData.zip}
                </p>
              </div>
              
              <p className="text-[#8697C4] mb-8">
                We'll send you shipping confirmation once your order is on the way. 
                Your device will arrive within 5-7 business days.
              </p>
              
              <div className="flex justify-center gap-4">
                <motion.button
                  className="bg-[#3D52A0] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#7091E6] transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard
                </motion.button>
                <motion.button
                  className="bg-white border border-[#3D52A0] text-[#3D52A0] px-6 py-3 rounded-lg hover:bg-[#f5f7ff] transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/')}
                >
                  Return to Home
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Product;