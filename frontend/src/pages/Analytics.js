import React, { useState, useEffect } from 'react';
import { FaLightbulb, FaRobot, FaArrowUp, FaChartLine, FaMapMarkerAlt, FaCalendarAlt, FaFilter } from 'react-icons/fa';

// API service to handle backend requests
const apiService = {
  // Fetch all AI recommendations
  fetchRecommendations: async () => {
    // TODO: Replace with actual API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            title: "Replace low-selling energy drinks with protein bars",
            description: "Energy drink sales have declined by 15% over the last 3 months while protein bars are trending upward at neighboring locations.",
            potentialImpact: "+$312.50 monthly (+7.8%)"
          },
          {
            id: 2,
            title: "Adjust pricing for premium water bottles",
            description: "Smart Water is currently priced at $2.25, but analytics indicate customers would pay up to $2.75 without impacting sales volume.",
            potentialImpact: "+$187.50 monthly (+4.2%)"
          },
          {
            id: 3,
            title: "Relocate sandwich inventory to high-traffic machine",
            description: "Sandwiches at the Office Park location sell 60% more during lunch hours vs. the Train Station location.",
            potentialImpact: "+$245.75 monthly (+5.5%)"
          }
        ]);
      }, 1000);
    });
  },
  
  // Fetch machine-specific recommendations
  fetchMachineRecommendations: async () => {
    // TODO: Replace with actual API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            machineId: 1,
            machineName: "Campus Center",
            recommendation: {
              title: "Adjust peak hour pricing",
              description: "Sales spike between 11:30am-1:30pm. Consider 10% price increase during this window.",
              potentialImpact: "+$124.50 monthly potential"
            }
          },
          {
            machineId: 2,
            machineName: "Office Park",
            recommendation: {
              title: "Address low stock issues",
              description: "This machine runs out of high-demand items frequently. Increase restock frequency to capture lost sales.",
              potentialImpact: "+$215.75 monthly potential"
            }
          },
          {
            machineId: 3,
            machineName: "Shopping Mall",
            recommendation: {
              title: "Optimize product mix",
              description: "Replace bottom 3 selling items with trending snacks from nearby retail sales data.",
              potentialImpact: "+$187.25 monthly potential"
            }
          },
          {
            machineId: 4,
            machineName: "Train Station",
            recommendation: {
              title: "Implement seasonal offerings",
              description: "Introduce hot beverage options during morning commute hours (6-9am) in colder months.",
              potentialImpact: "+$203.00 monthly potential"
            }
          }
        ]);
      }, 1200);
    });
  },
  
  // Fetch analytics summary data
  fetchAnalyticsSummary: async (timeRange = 'month', machineId = 'all') => {
    // TODO: Replace with actual API call that uses the parameters
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          totalRevenue: 5202.30,
          revenueTrend: +8.7,
          totalSales: 3847,
          salesTrend: +12.4,
          topSeller: {
            name: "Soda",
            units: 1230
          },
          totalPotentialIncrease: 746
        });
      }, 800);
    });
  },
  
  // Implement a recommendation
  implementRecommendation: async (recommendationId) => {
    // TODO: Replace with actual API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, message: "Recommendation scheduled for implementation" });
      }, 500);
    });
  }
};

// Recommendation component - reusable for both general and machine-specific recommendations
const Recommendation = ({ icon = <FaLightbulb />, title, description, impact, bgColor = "bg-blue-100", textColor = "text-blue-600", onClick }) => {
  return (
    <div className="bg-[#f5f7ff] rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <div className={`p-2 rounded-full ${bgColor} ${textColor} mr-4`}>
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-[#3D52A0]">{title}</h4>
          <p className="text-[#8697C4]">{description}</p>
          <div className="flex justify-between items-center mt-2">
            <p className="text-green-500 flex items-center">
              <FaArrowUp className="mr-1" /> {impact}
            </p>
            {onClick && (
              <button 
                onClick={onClick}
                className="text-[#3D52A0] hover:text-[#7091E6] text-sm font-medium"
              >
                Implement
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Section header component
const SectionHeader = ({ icon, title, subtitle, bgClass = "bg-[#3D52A0]" }) => (
  <div className={`text-white rounded-t-xl p-5 flex items-center ${bgClass}`}>
    <div className="text-3xl mr-4">
      {icon}
    </div>
    <div>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-sm opacity-80">{subtitle}</p>
    </div>
  </div>
);

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3D52A0]"></div>
  </div>
);

// Main Analytics component
const Analytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [machineRecommendations, setMachineRecommendations] = useState([]);
  const [analyticsSummary, setAnalyticsSummary] = useState(null);
  const [timeRange, setTimeRange] = useState("month");
  const [selectedMachine, setSelectedMachine] = useState("all");
  const [machines, setMachines] = useState([
    { id: 'all', name: 'All Machines' },
    { id: 1, name: 'Campus Center' },
    { id: 2, name: 'Office Park' },
    { id: 3, name: 'Shopping Mall' },
    { id: 4, name: 'Train Station' }
  ]);
  
  // Load data based on filters
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [recommendations, machineRecs, summary] = await Promise.all([
          apiService.fetchRecommendations(),
          apiService.fetchMachineRecommendations(),
          apiService.fetchAnalyticsSummary(timeRange, selectedMachine)
        ]);
        
        setSuggestions(recommendations);
        setMachineRecommendations(machineRecs);
        setAnalyticsSummary(summary);
      } catch (error) {
        console.error('Error loading analytics data:', error);
        // Handle error state
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [timeRange, selectedMachine]);

  // Handle implementing a recommendation
  const handleImplementRecommendation = async (recommendationId) => {
    try {
      const result = await apiService.implementRecommendation(recommendationId);
      
      // Show success message or update UI accordingly
      alert("Recommendation scheduled for implementation!");
      
      // Reload data to reflect changes
      const updatedRecommendations = await apiService.fetchRecommendations();
      setSuggestions(updatedRecommendations);
      
    } catch (error) {
      console.error('Error implementing recommendation:', error);
      // Handle error state
      alert("There was an error implementing the recommendation. Please try again.");
    }
  };
  
  // Filter machine recommendations based on selected machine
  const filteredMachineRecommendations = selectedMachine === "all" ? 
    machineRecommendations : 
    machineRecommendations.filter(rec => rec.machineId.toString() === selectedMachine.toString());

  return (
    <div className="min-h-[calc(100vh-80px)] pt-[80px] bg-[#f5f7ff] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with filters */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#3D52A0]">AI-Powered Analytics</h1>
            <p className="text-[#8697C4] mt-1">Smart insights to optimize your vending machine business</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
              <FaCalendarAlt className="text-[#8697C4]" />
              <select 
                className="bg-transparent text-[#3D52A0] focus:outline-none cursor-pointer"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
                <option value="quarter">Last 90 days</option>
                <option value="year">Last 12 months</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
              <FaMapMarkerAlt className="text-[#8697C4]" />
              <select 
                className="bg-transparent text-[#3D52A0] focus:outline-none cursor-pointer"
                value={selectedMachine}
                onChange={(e) => setSelectedMachine(e.target.value)}
              >
                {machines.map(machine => (
                  <option key={machine.id} value={machine.id}>
                    {machine.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* AI Recommendations Section */}
            <div className="mb-8">
              <SectionHeader 
                icon={<FaRobot />} 
                title="AI-Powered Recommendations" 
                subtitle="Machine learning insights to maximize your profits" 
              />
              
              <div className="bg-white rounded-b-xl shadow-md">
                <div className="divide-y divide-[#ADBBDA]/30">
                  {suggestions.length === 0 ? (
                    <div className="p-8 text-center">
                      <FaLightbulb className="mx-auto text-4xl text-[#7091E6] mb-4" />
                      <h3 className="text-lg font-bold text-[#3D52A0] mb-2">No Recommendations Yet</h3>
                      <p className="text-[#8697C4]">
                        The AI needs more sales data to generate meaningful suggestions.
                        <br />Continue operating your machines to unlock smart recommendations.
                      </p>
                    </div>
                  ) : (
                    suggestions.map(suggestion => (
                      <div key={suggestion.id} className="p-5">
                        <Recommendation
                          title={suggestion.title}
                          description={suggestion.description}
                          impact={suggestion.potentialImpact}
                          onClick={() => handleImplementRecommendation(suggestion.id)}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          
            {/* Basic Stats */}
            {analyticsSummary && (
              <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                <h2 className="text-xl font-bold text-[#3D52A0] mb-6">Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#f5f7ff] p-4 rounded-xl">
                    <h3 className="text-[#3D52A0] font-bold mb-2 text-lg">Total Revenue</h3>
                    <p className="text-2xl font-bold text-[#3D52A0]">
                      ${analyticsSummary.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </p>
                    <p className={`${analyticsSummary.revenueTrend > 0 ? 'text-green-500' : 'text-red-500'} text-sm mt-1 flex items-center`}>
                      {analyticsSummary.revenueTrend > 0 ? <FaArrowUp className="mr-1" /> : null}
                      {analyticsSummary.revenueTrend > 0 ? '+' : ''}{analyticsSummary.revenueTrend}% from last {timeRange}
                    </p>
                  </div>
                  
                  <div className="bg-[#f5f7ff] p-4 rounded-xl">
                    <h3 className="text-[#3D52A0] font-bold mb-2 text-lg">Total Sales</h3>
                    <p className="text-2xl font-bold text-[#3D52A0]">{analyticsSummary.totalSales.toLocaleString()} items</p>
                    <p className={`${analyticsSummary.salesTrend > 0 ? 'text-green-500' : 'text-red-500'} text-sm mt-1 flex items-center`}>
                      {analyticsSummary.salesTrend > 0 ? <FaArrowUp className="mr-1" /> : null}
                      {analyticsSummary.salesTrend > 0 ? '+' : ''}{analyticsSummary.salesTrend}% from last {timeRange}
                    </p>
                  </div>
                  
                  <div className="bg-[#f5f7ff] p-4 rounded-xl">
                    <h3 className="text-[#3D52A0] font-bold mb-2 text-lg">Top Seller</h3>
                    <p className="text-2xl font-bold text-[#3D52A0]">{analyticsSummary.topSeller.name}</p>
                    <p className="text-[#8697C4] text-sm mt-1">{analyticsSummary.topSeller.units.toLocaleString()} units sold</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Pro Tip Section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <SectionHeader 
                icon={<FaChartLine />}
                title="Pro Tip"
                subtitle="How to use this data effectively"
                bgClass="bg-gradient-to-r from-[#3D52A0] to-[#7091E6]"
              />
              
              <div className="p-6">
                <p className="text-[#3D52A0] text-lg mb-4">
                  Our AI analysis suggests you could increase your monthly revenue by up to <strong>${analyticsSummary?.totalPotentialIncrease || 746}</strong> by implementing the recommendations above.
                </p>
                <p className="text-[#8697C4]">
                  Each suggestion is carefully analyzed using machine learning algorithms that identify patterns in your sales data and predict customer behavior.
                  Start with the highest impact changes first, then track results in your dashboard.
                </p>
                <div className="mt-6 flex justify-center">
                  <button 
                    className="bg-[#3D52A0] text-white px-6 py-3 rounded-lg hover:bg-[#7091E6] transition-colors"
                    onClick={() => handleImplementRecommendation(suggestions[0]?.id)}
                    disabled={!suggestions.length}
                  >
                    Implement Top Recommendation
                  </button>
                </div>
              </div>
            </div>
            
            {/* Machine-specific recommendations */}
            {filteredMachineRecommendations.length > 0 && (
              <div className="bg-white rounded-xl shadow-md mb-8">
                <SectionHeader 
                  icon={<FaMapMarkerAlt />}
                  title="Machine-Specific Insights"
                  subtitle="Tailored recommendations for each location"
                  bgClass="bg-gradient-to-r from-[#7091E6] to-[#ADBBDA]"
                />
                
                <div className="divide-y divide-[#ADBBDA]/30">
                  {filteredMachineRecommendations.map(machineRec => (
                    <div key={machineRec.machineId} className="p-5">
                      <h3 className="text-xl font-bold text-[#3D52A0] mb-2">{machineRec.machineName}</h3>
                      <Recommendation
                        title={machineRec.recommendation.title}
                        description={machineRec.recommendation.description}
                        impact={machineRec.recommendation.potentialImpact}
                        bgColor="bg-green-100"
                        textColor="text-green-600"
                        onClick={() => handleImplementRecommendation(`machine-${machineRec.machineId}`)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;