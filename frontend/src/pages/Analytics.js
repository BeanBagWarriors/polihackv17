import React, { useState } from 'react';
import { FaLightbulb, FaRobot, FaArrowUp, FaArrowDown, FaChartLine, FaMapMarkerAlt, FaCalendarAlt, FaSync, FaCoins, FaBoxOpen, FaMoneyBillWave, FaCashRegister } from 'react-icons/fa';
import { useAuthContext } from '../Hooks/useAuthContext';
import NotFound from './NotFound';

// API service to handle backend requests
const apiService = {
  // Fetch recommendations based on all machine data
  fetchRecommendations: async () => {
    // For now, return mock data
    return [
      {
        id: 'rec1',
        title: 'Add healthier options to Campus Center',
        description: 'Students are increasingly looking for healthier snack alternatives. Adding more fruit and protein-based options could boost sales.',
        potentialImpact: '$210 increased revenue/month'
      },
      // Add more mock recommendations as needed
    ];
  },

  // Fetch machine-specific recommendations
  fetchMachineRecommendations: async (email) => {
    try {
      // First get user's machines
      const userMachinesResponse = await fetch(`${process.env.REACT_APP_API}/api/machine/getUserMachines/${email}`);
      if (!userMachinesResponse.ok) {
        throw new Error('Failed to fetch user machines');
      }
      
      const userMachines = await userMachinesResponse.json();
      
      // For each machine, get recommendations
      const recommendationsPromises = userMachines.map(async (machine) => {
        try {
          const recResponse = await fetch(`${process.env.REACT_APP_API}/api/machine/getMachineRecommendations/${machine.id}`);
          if (!recResponse.ok) {
            console.warn(`Failed to fetch recommendations for machine ${machine.id}`);
            return null;
          }
          return recResponse.json();
        } catch (error) {
          console.error(`Error fetching recommendations for machine ${machine.id}:`, error);
          return null;
        }
      });
      
      // Wait for all recommendation requests to complete
      const results = await Promise.all(recommendationsPromises);
      
      // Filter out any failed requests
      return results.filter(result => result !== null);
    } catch (error) {
      console.error('Error fetching machine recommendations:', error);
      return [];
    }
  },

  // Fetch analytics summary data
  fetchAnalyticsSummary: async (timeRange, selectedMachine) => {
    try {
      // If "all" is selected, we need to get data for all machines and aggregate it
      if (selectedMachine === 'all') {
        // First get user's machines
        const userMachinesResponse = await fetch(`${process.env.REACT_APP_API}/api/machine/getUserMachines/${JSON.parse(localStorage.getItem('user')).username}`);
        
        if (!userMachinesResponse.ok) {
          throw new Error('Failed to fetch user machines');
        }
        
        const userMachines = await userMachinesResponse.json();
        
        // Fetch metrics for each machine
        const metricsPromises = userMachines.map(async (machine) => {
          const response = await fetch(`${process.env.REACT_APP_API}/api/machine/getPerformanceMetrics/${machine.id}/${timeRange}`);
          
          if (!response.ok) {
            console.warn(`Failed to fetch metrics for machine ${machine.id}`);
            return null;
          }
          
          return response.json();
        });
        
        // Wait for all requests to complete
        const results = await Promise.all(metricsPromises);
        const validResults = results.filter(res => res !== null);
        
        // If no data, return empty defaults
        if (validResults.length === 0) {
          return {
            totalRevenue: 0,
            revenueTrend: 0,
            totalSales: 0,
            salesTrend: 0,
            topSeller: { name: "No data", units: 0 },
            monthlyComparisons: {
              revenue: { current: 0, previous: 0, percentChange: 0 },
              sales: { current: 0, previous: 0, percentChange: 0 },
              averageTicket: { current: 0, previous: 0, percentChange: 0 },
              stockTurnover: { current: 0, previous: 0, percentChange: 0 }
            },
            aiInsights: "No data available for analysis."
          };
        }
        
        // Aggregate metrics from all machines
        const aggregated = {
          totalRevenue: validResults.reduce((sum, item) => sum + item.monthlyComparisons.revenue.current, 0),
          revenueTrend: validResults.reduce((sum, item) => sum + item.monthlyComparisons.revenue.percentChange, 0) / validResults.length,
          totalSales: validResults.reduce((sum, item) => sum + item.monthlyComparisons.sales.current, 0),
          salesTrend: validResults.reduce((sum, item) => sum + item.monthlyComparisons.sales.percentChange, 0) / validResults.length,
          monthlyComparisons: {
            revenue: {
              current: validResults.reduce((sum, item) => sum + item.monthlyComparisons.revenue.current, 0),
              previous: validResults.reduce((sum, item) => sum + item.monthlyComparisons.revenue.previous, 0),
              percentChange: validResults.reduce((sum, item) => sum + item.monthlyComparisons.revenue.percentChange, 0) / validResults.length
            },
            sales: {
              current: validResults.reduce((sum, item) => sum + item.monthlyComparisons.sales.current, 0),
              previous: validResults.reduce((sum, item) => sum + item.monthlyComparisons.sales.previous, 0),
              percentChange: validResults.reduce((sum, item) => sum + item.monthlyComparisons.sales.percentChange, 0) / validResults.length
            },
            averageTicket: {
              current: validResults.reduce((sum, item) => sum + item.monthlyComparisons.averageTicket.current, 0) / validResults.length,
              previous: validResults.reduce((sum, item) => sum + item.monthlyComparisons.averageTicket.previous, 0) / validResults.length,
              percentChange: validResults.reduce((sum, item) => sum + item.monthlyComparisons.averageTicket.percentChange, 0) / validResults.length
            },
            stockTurnover: {
              current: validResults.reduce((sum, item) => sum + item.monthlyComparisons.stockTurnover.current, 0) / validResults.length,
              previous: validResults.reduce((sum, item) => sum + item.monthlyComparisons.stockTurnover.previous, 0) / validResults.length,
              percentChange: validResults.reduce((sum, item) => sum + item.monthlyComparisons.stockTurnover.percentChange, 0) / validResults.length
            }
          },
          aiInsights: "Combined insights from all machines: " + validResults.map(r => r.aiInsights).join(" ")
        };
        
        return aggregated;
      } else {
        // Fetch data for just one machine
        const response = await fetch(`${process.env.REACT_APP_API}/api/machine/getPerformanceMetrics/${selectedMachine}/${timeRange}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch machine performance metrics');
        }
        
        const data = await response.json();
        
        return {
          totalRevenue: data.monthlyComparisons.revenue.current,
          revenueTrend: data.monthlyComparisons.revenue.percentChange,
          totalSales: data.monthlyComparisons.sales.current,
          salesTrend: data.monthlyComparisons.sales.percentChange,
          monthlyComparisons: data.monthlyComparisons,
          aiInsights: data.aiInsights
        };
      }
    } catch (error) {
      console.error('Error fetching analytics summary:', error);
      // Return default values on error
      return {
        totalRevenue: 0,
        revenueTrend: 0,
        totalSales: 0,
        salesTrend: 0,
        topSeller: { name: "Error loading data", units: 0 },
        monthlyComparisons: {
          revenue: { current: 0, previous: 0, percentChange: 0 },
          sales: { current: 0, previous: 0, percentChange: 0 },
          averageTicket: { current: 0, previous: 0, percentChange: 0 },
          stockTurnover: { current: 0, previous: 0, percentChange: 0 }
        },
        aiInsights: "Error loading insights."
      };
    }
  },

  // Implement recommendation
  implementRecommendation: async (recommendationId) => {
    // Mock implementation
    console.log(`Implementing recommendation: ${recommendationId}`);
    return { success: true };
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

// Helper functions for priority colors
const getPriorityColor = (priority) => {
  switch (priority) {
    case 1:
      return "bg-red-100";
    case 2:
      return "bg-orange-100";
    case 3:
      return "bg-yellow-100";
    case 4:
      return "bg-green-100";
    case 5:
    default:
      return "bg-blue-100";
  }
};

// Helper function to get text color based on priority
const getPriorityTextColor = (priority) => {
  switch (priority) {
    case 1:
      return "text-red-600";
    case 2:
      return "text-orange-600";
    case 3:
      return "text-yellow-600";
    case 4:
      return "text-green-600";
    case 5:
    default:
      return "text-blue-600";
  }
};

const MetricCard = ({ icon, title, current, previous, percentChange, format = 'currency', bgClass = 'bg-white' }) => {
  const isPositive = percentChange > 0;
  
  // Format value based on type
  const formatValue = (value) => {
    if (format === 'currency') {
      return `$${value.toFixed(2)}`;
    } else if (format === 'decimal') {
      return value.toFixed(1);
    } else {
      return value;
    }
  };
  
  return (
    <div className={`${bgClass} rounded-lg shadow-md p-5`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-[#8697C4]">{title}</h3>
          <p className="text-2xl font-bold text-[#3D52A0] mt-1">
            {formatValue(current)}
          </p>
        </div>
        <div className={`p-3 rounded-full ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {icon}
        </div>
      </div>
      
      <div className="flex items-center mt-3">
        <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'} mr-2`}>
          {isPositive ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
          <span className="font-medium">{Math.abs(percentChange).toFixed(1)}%</span>
        </div>
        <p className="text-[#8697C4] text-sm">vs. last month</p>
      </div>
      
      <div className="mt-2 text-sm text-[#8697C4]">
        Last month: {formatValue(previous)}
      </div>
    </div>
  );
};

// Main Analytics component
const Analytics = () => {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [machineRecommendations, setMachineRecommendations] = useState([]);
  const [analyticsSummary, setAnalyticsSummary] = useState(null);
  const [timeRange, setTimeRange] = useState("month");
  const [selectedMachine, setSelectedMachine] = useState("all");
  const [machines, setMachines] = useState([
    { id: 'all', name: 'All Machines' },
  ]);
  
  // Load data based on filters when button is clicked
  const loadData = async () => {
    setIsLoading(true);
    try {
      // Check if user is available with email
      if (!user || !user.username){
        throw new Error('User email not available');
      }
      
      const [recommendations, machineRecs, summary] = await Promise.all([
        apiService.fetchRecommendations(),
        apiService.fetchMachineRecommendations(user.username),
        apiService.fetchAnalyticsSummary(timeRange, selectedMachine)
      ]);
      
      setSuggestions(recommendations);
      setMachineRecommendations(machineRecs);
      setAnalyticsSummary(summary);
      setDataFetched(true);
      
      // Update machines dropdown with actual machine data
      if (machineRecs.length > 0) {
        const uniqueMachines = [...new Set(machineRecs.map(rec => rec.machineId))];
        const machineOptions = [
          { id: 'all', name: 'All Machines' },
          ...uniqueMachines.map(id => ({
            id: id,
            name: id // You can replace with a more friendly name if available
          }))
        ];
        setMachines(machineOptions);
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
      // Handle error state
    } finally {
      setIsLoading(false);
    }
  };

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
  machineRecommendations.filter(rec => rec.machineId && rec.machineId.toString() === selectedMachine.toString());

if(!user){
  return(
    <NotFound/>
  )
}

  return (
    <div className="min-h-[calc(100vh-80px)] pt-[80px] mt-10 bg-[#f5f7ff] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with filters and generate button */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#3D52A0]">AI-Powered Analytics</h1>
            <p className="text-[#8697C4] mt-1">Smart insights to optimize your vending machine business</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3 items-center">
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
            
            <button 
              onClick={loadData}
              disabled={isLoading}
              className="bg-[#3D52A0] hover:bg-[#2A3A70] text-white px-4 py-2 rounded-lg shadow flex items-center transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Loading...
                </>
              ) : (
                <>
                  <FaSync className="mr-2" /> 
                  {dataFetched ? "Refresh Data" : "Generate Insights"}
                </>
              )}
            </button>
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : !dataFetched ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-md">
            <FaChartLine className="mx-auto text-5xl text-[#7091E6] mb-4" />
            <h2 className="text-2xl font-bold text-[#3D52A0] mb-2">Click to Generate AI Insights</h2>
            <p className="text-[#8697C4] mb-6">
              Our AI will analyze your vending machine data and provide tailored recommendations to improve your business.
            </p>
            <button 
              onClick={loadData} 
              className="bg-[#3D52A0] hover:bg-[#2A3A70] text-white px-6 py-3 rounded-lg transition-colors"
            >
              <FaRobot className="inline-block mr-2" /> Generate AI Insights
            </button>
          </div>
        ) : (
          <>
            {/* Monthly Performance Metrics */}
            {analyticsSummary && analyticsSummary.monthlyComparisons && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-[#3D52A0] mb-4">Monthly Performance</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <MetricCard 
                    icon={<FaMoneyBillWave size={20} />}
                    title="Monthly Revenue" 
                    current={analyticsSummary.monthlyComparisons.revenue.current}
                    previous={analyticsSummary.monthlyComparisons.revenue.previous}
                    percentChange={analyticsSummary.monthlyComparisons.revenue.percentChange}
                  />
                  
                  <MetricCard 
                    icon={<FaBoxOpen size={20} />}
                    title="Monthly Sales" 
                    current={analyticsSummary.monthlyComparisons.sales.current}
                    previous={analyticsSummary.monthlyComparisons.sales.previous}
                    percentChange={analyticsSummary.monthlyComparisons.sales.percentChange}
                    format="number"
                  />
                  
                  <MetricCard 
                    icon={<FaCashRegister size={20} />}
                    title="Average Transaction" 
                    current={analyticsSummary.monthlyComparisons.averageTicket.current}
                    previous={analyticsSummary.monthlyComparisons.averageTicket.previous}
                    percentChange={analyticsSummary.monthlyComparisons.averageTicket.percentChange}
                  />
                  
                  <MetricCard 
                    icon={<FaCoins size={20} />}
                    title="Stock Turnover Rate" 
                    current={analyticsSummary.monthlyComparisons.stockTurnover.current}
                    previous={analyticsSummary.monthlyComparisons.stockTurnover.previous}
                    percentChange={analyticsSummary.monthlyComparisons.stockTurnover.percentChange}
                    format="decimal"
                  />
                </div>
              </div>
            )}
            
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
                      <h3 className="text-xl font-bold text-[#3D52A0] mb-2">
                        {`Machine ${machineRec.machineId}`}
                      </h3>
                      <p className="text-sm text-[#8697C4] mb-4">
                        Generated on {new Date(machineRec.generatedAt).toLocaleString()}
                      </p>
                      
                      {machineRec.recommendations && machineRec.recommendations.length > 0 ? (
                        machineRec.recommendations.map((rec, index) => (
                          <Recommendation
                            key={`${machineRec.machineId}-rec-${index}`}
                            title={rec.recommendation}
                            description={rec.reasoning}
                            impact={`Priority: ${rec.priority} (${rec.category})`}
                            bgColor={getPriorityColor(rec.priority)}
                            textColor={getPriorityTextColor(rec.priority)}
                            onClick={() => handleImplementRecommendation(`machine-${machineRec.machineId}-rec-${index}`)}
                          />
                        ))
                      ) : (
                        <p className="text-[#8697C4] p-4">No recommendations available for this machine.</p>
                      )}
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