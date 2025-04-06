const machineModel = require('../models/machineModel');
const userModel = require('../models/userModel');

const createMachine = async (req, res) => {
    try {
        const {keys, id, location} = req.body || {};

        if(!location){
            return res.status(400).json({ error: 'Location is required!' });
        }

        if(!keys){
            return res.status(400).json({ error: 'Invalid keys!' });
        }

        if(!id){
            return res.status(400).json({ error: 'Id is required!' });
        }

        const verifier = await machineModel.findOne({id});
        if(verifier){
            await machineModel.updateOne({id}, {$set: {location}});
            return res.status(200).json({message: `The machine already exists! We've updated the location!`});
        }

        // if(pins.length % 16 !== 0){
        //     return res.status(400).json({ error: 'Invalid pins!' });
        // }

        const content = keys.map((keyId) => ({
            name: 'empty',
            key: keyId,
            originalPrice: 0,
            retailPrice: 0,
            expiryDate: 'unset',
            amount: 0
        }));

        const machine = await machineModel.create({ id, content, location });

        res.status(200).json(machine);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const addMachineToUser = async (req, res) =>{
    try{
        const {email, id} = req.body || {};
        
        const user = await userModel.findOne({email});
        const machine = await machineModel.findOne({id});

        if(!user){
            return res.status(400).json({error: 'User does not exist!'});
        }

        if(!machine){
            return res.status(400).json({error: 'Machine does not exist!'});
        }

        if(user.machines.includes(id)){
            return res.status(400).json({error: 'Machine is already included!'});
        }

        user.machines.push(id);
        await user.save();

        res.status(200).json({message: 'Machine added to user!'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const getMachineContent = async (req, res) =>{
    try{
        const {id} = req.params || {};

        if(!id){
            return res.status(400).json({error: 'Id is required!'});
        }

        const machine = await machineModel.findOne({id});

        if(!machine){
            return res.status(400).json({error: 'Machine does not exist!'});
        }

        res.status(200).json(machine);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const addItemsToContent = async (req, res) =>{
    try{
        const {id, key, amount} = req.body || {};

        const machine = await machineModel.findOne({id});

        if(!amount){
            return res.status(400).json({error: 'Amount is required!'});
        }

        if(!machine){
            return res.status(400).json({error: 'Machine does not exist!'});
        }

        if(!key){
            return res.status(400).json({error: 'Key is required!'});
        }

        machine.content.forEach((item) => {
            if(item.key === key){
                item.amount += amount;
            }
        });

        await machine.save();

        res.status(200).json("Added items to machine!");
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

const updateSellingHistory = (machine, item) => {
    const foundItem = machine.totalSales.find(h => h.name === item.name);
    if (foundItem) {
        foundItem.amount++;
        machine.markModified('totalSales');
    } else {
        machine.totalSales.push({
            name: item.name,
            amount: 1,
        });
    }
};


const removeItemsFromContent = async (req, res) =>{
    try{
        const {id, key} = req.body || {};

        let machine = await machineModel.findOne({id});

        if(!machine){
            return res.status(400).json({error: 'Machine does not exist!'});
        }

        if(!key){
            return res.status(400).json({error: 'key is required!'});
        }

        let found = false;

        for (const item of machine.content) {
            if (item.key === key) {
                found = true;

                if (item.amount === 0) {
                    return res.status(400).json({ error: 'There are no items to remove!' });
                }

                updateSellingHistory(machine, item);
                item.amount--;
                machine.totalRevenue += item.retailPrice;
                machine.activeRevenue += item.retailPrice;

                const sale = {
                    name: item.name,
                    originalPrice: item.originalPrice,
                    retailPrice: item.retailPrice,
                    date: new Date().toISOString(),
                }

                machine.salesHistory.push(sale);

                break;
            }
        }

        if (!found) {
            return res.status(404).json({ error: 'Item not found in machine content!' });
        }

        await machine.save();

        res.status(200).json("Removed items from machine!");
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

const setMachineContent = async (req, res) =>{
    try{
        const {id, key, expiryDate, originalPrice, retailPrice, name, amount} = req.body || {};

        const machine = await machineModel.findOne({id});

        if(!machine){
            return res.status(400).json({error: 'Machine does not exist!'});
        }

        if(!key){
            return res.status(400).json({error: 'Key is required!'});
        }

        machine.content.forEach((item) => {
            if(item.key === key){
                expiryDate ? item.expiryDate = expiryDate : item.expiryDate;
                originalPrice ? item.originalPrice = originalPrice : item.originalPrice;
                retailPrice ? item.retailPrice = retailPrice : item.retailPrice;
                originalPrice == 0 ? item.originalPrice = item.retailPrice : item.originalPrice;
                name ? item.name = name : item.name;
                amount ? item.amount = amount : item.amount;
            }
        });


        await machine.save();

        res.status(200).json("Machine content has been updated!");
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

const getUserMachines = async (req, res) =>{
    try{
        const {email} = req.params || {};

        if(!email){
            return res.status(400).json({error: 'Email is required!'});
        }

        const user = await userModel.findOne({email});

        if(!user){
            return res.status(400).json({error: 'User does not exist!'});
        }

        const machines = await machineModel.find({id: {$in: user.machines}});

        res.status(200).json(machines);
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

const updateMachineStockMoney = async (req, res) =>{
    try{
        const {id} = req.body || {};

        const machine = await machineModel.findOneAndUpdate({id}, {$set: {isCashFull: true}}); 

        if(!machine){
            return res.status(400).json({error: 'Machine does not exist!'});
        }

        return res.status(200).json({message: 'Machine is now full!'});
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

const getMachineRecommendations = async (req, res) => {
    try {
        const { id } = req.params || {};
        
        if (!id) {
            return res.status(400).json({ error: 'Machine ID is required!' });
        }
        
        const machine = await machineModel.findOne({ id });
        
        if (!machine) {
            return res.status(400).json({ error: 'Machine does not exist!' });
        }

        // Configure OpenAI API request
        const openaiApiKey = process.env.OPEN_AI_KEY;
        
        if (!openaiApiKey) {
            return res.status(500).json({ error: 'OpenAI API key is not configured' });
        }

        // Create prompt with machine data
        const prompt = `
        As an AI assistant specializing in vending machine optimization, please analyze the following vending machine data and provide recommendations:

        Machine ID: ${machine.id}
        Location: ${machine.location}
        Total Revenue: $${machine.totalRevenue}
        Active Revenue: $${machine.activeRevenue}
        Cash Collection Status: ${machine.isCashFull ? 'Full - Needs collection' : 'Space available'}
        
        Current Inventory:
        ${machine.content.map(item => 
            `- ${item.name}: ${item.amount} units, Price: $${item.retailPrice}, Expiry: ${item.expiryDate}`
        ).join('\n')}
        
        Sales History:
        ${machine.salesHistory.slice(-5).map(sale => 
            `- ${sale.name}: Sold for $${sale.retailPrice} (Cost: $${sale.originalPrice}) on ${new Date(sale.date).toLocaleDateString()}`
        ).join('\n')}
        
        Top Selling Products:
        ${machine.totalSales.sort((a, b) => b.amount - a.amount).slice(0, 3).map(item => 
            `- ${item.name}: ${item.amount} units sold`
        ).join('\n')}

        Based on this data, please provide recommendations in JSON format.
        `;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openaiApiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { 
                        role: "system", 
                        content: `You are a vending machine optimization specialist. Provide recommendations as a JSON array with objects containing:
                        - category: One of ["inventory", "pricing", "product_mix", "expiry", "revenue", "other"]
                        - recommendation: A clear action recommendation
                        - reasoning: Brief explanation
                        - priority: Number from 1-5 (1 being highest)
                        
                        Format example:
                        {"recommendations": [
                          {
                            "category": "inventory",
                            "recommendation": "Restock product X immediately",
                            "reasoning": "Currently at 2 units but selling 15 units/week",
                            "priority": 1
                          },
                          {
                            "category": "pricing",
                            "recommendation": "Increase price of product Y by 10%",
                            "reasoning": "High demand with current 40% margin can be optimized",
                            "priority": 2
                          }
                        ]}`
                    },
                    { role: "user", content: prompt }
                ],
                temperature: 0.5
            })
        });

        const data = await response.json();
        
        if (data.error) {
            console.error("OpenAI API error:", data.error);
            return res.status(500).json({ error: `OpenAI API error: ${data.error.message || 'Unknown error'}` });
        }

        // Extract content from response
        const content = data.choices && data.choices[0]?.message?.content;
        if (!content) {
            console.error("Unexpected API response format:", data);
            return res.status(500).json({ error: "Invalid response from recommendation service" });
        }

        // Parse recommendations from the content
        let recommendationsArray = [];
        try {
            // Try to extract JSON from the response text
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            const jsonStr = jsonMatch ? jsonMatch[0] : content;
            
            const parsedContent = JSON.parse(jsonStr);
            recommendationsArray = parsedContent.recommendations || [];
            
            if (!Array.isArray(recommendationsArray)) {
                // If we didn't get an array in 'recommendations', check if the whole response is an array
                recommendationsArray = Array.isArray(parsedContent) ? parsedContent : [];
            }
        } catch (parseError) {
            console.error("Error parsing recommendations:", parseError);
            return res.status(500).json({ 
                error: "Failed to parse recommendations", 
                rawResponse: content
            });
        }

        // Structure the response
        res.status(200).json({
            machineId: machine.id,
            location: machine.location,
            recommendations: recommendationsArray,
            generatedAt: new Date().toISOString()
        });
        
    } catch (error) {
        console.error("Error getting recommendations:", error);
        res.status(500).json({ error: error.message });
    }
};

const getMachinePerformanceMetrics = async (req, res) => {
    try {
        const { id, timeRange } = req.params || {};
        
        if (!id) {
            return res.status(400).json({ error: 'Machine ID is required!' });
        }
        
        const machine = await machineModel.findOne({ id });
        
        if (!machine) {
            return res.status(400).json({ error: 'Machine does not exist!' });
        }

        // Get date ranges for current and previous periods
        const now = new Date();
        let currentPeriodStart, previousPeriodStart;
        
        switch (timeRange) {
            case 'week':
                currentPeriodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
                previousPeriodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14);
                break;
            case 'quarter':
                currentPeriodStart = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
                previousPeriodStart = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
                break;
            case 'year':
                currentPeriodStart = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                previousPeriodStart = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
                break;
            case 'month':
            default:
                // Default to month
                currentPeriodStart = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                previousPeriodStart = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
        }

        const previousPeriodEnd = new Date(currentPeriodStart.getTime() - 1);

        // Calculate metrics for current period
        const currentSales = machine.salesHistory.filter(sale => 
            new Date(sale.date) >= currentPeriodStart && new Date(sale.date) <= now
        );

        const previousSales = machine.salesHistory.filter(sale => 
            new Date(sale.date) >= previousPeriodStart && new Date(sale.date) < currentPeriodStart
        );

        // Current period metrics
        const currentRevenue = currentSales.reduce((total, sale) => total + sale.retailPrice, 0);
        const currentSalesCount = currentSales.length;
        const currentAverageTicket = currentSalesCount > 0 ? currentRevenue / currentSalesCount : 0;
        
        // Previous period metrics
        const previousRevenue = previousSales.reduce((total, sale) => total + sale.retailPrice, 0);
        const previousSalesCount = previousSales.length;
        const previousAverageTicket = previousSalesCount > 0 ? previousRevenue / previousSalesCount : 0;

        // Calculate percentages
        const calculatePercentChange = (current, previous) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return ((current - previous) / previous) * 100;
        };

        // Calculate stock turnover
        // For simplicity: Sales volume / average inventory level
        const calculateStockTurnover = (sales, startInventory, endInventory) => {
            const averageInventory = (startInventory + endInventory) / 2;
            return averageInventory > 0 ? sales.length / averageInventory : 0;
        };

        // Estimate current period's starting inventory
        // This is a simplified approach - in a real system you'd track inventory changes
        const totalCurrentInventory = machine.content.reduce((sum, item) => sum + item.amount, 0);
        const totalSold = currentSales.length;
        const estimatedStartInventory = totalCurrentInventory + totalSold;
        
        // Same for previous period
        const totalPreviousSold = previousSales.length;
        const estimatedPreviousStartInventory = estimatedStartInventory + totalPreviousSold;
        
        const currentStockTurnover = calculateStockTurnover(
            currentSales, 
            estimatedStartInventory, 
            totalCurrentInventory
        );
        
        const previousStockTurnover = calculateStockTurnover(
            previousSales, 
            estimatedPreviousStartInventory, 
            estimatedStartInventory
        );

        // Prepare data for AI analysis
        const openaiApiKey = process.env.OPEN_AI_KEY;
        
        if (!openaiApiKey) {
            return res.status(500).json({ error: 'OpenAI API key is not configured' });
        }

        // Create prompt with performance data for AI insights
        const prompt = `
        As a vending machine analytics specialist, analyze the following performance metrics for machine ${machine.id}:
        
        Time Period: ${timeRange === 'week' ? 'Last Week' : timeRange === 'month' ? 'Last Month' : timeRange === 'quarter' ? 'Last Quarter' : 'Last Year'}
        
        Current Period:
        - Revenue: $${currentRevenue.toFixed(2)}
        - Sales Count: ${currentSalesCount}
        - Average Transaction: $${currentAverageTicket.toFixed(2)}
        - Stock Turnover Rate: ${currentStockTurnover.toFixed(2)}
        
        Previous Period:
        - Revenue: $${previousRevenue.toFixed(2)}
        - Sales Count: ${previousSalesCount}
        - Average Transaction: $${previousAverageTicket.toFixed(2)}
        - Stock Turnover Rate: ${previousStockTurnover.toFixed(2)}
        
        Performance Change:
        - Revenue Change: ${calculatePercentChange(currentRevenue, previousRevenue).toFixed(1)}%
        - Sales Count Change: ${calculatePercentChange(currentSalesCount, previousSalesCount).toFixed(1)}%
        - Average Transaction Change: ${calculatePercentChange(currentAverageTicket, previousAverageTicket).toFixed(1)}%
        - Stock Turnover Change: ${calculatePercentChange(currentStockTurnover, previousStockTurnover).toFixed(1)}%
        
        Current Best Sellers:
        ${machine.totalSales.sort((a, b) => b.amount - a.amount).slice(0, 3).map(item => 
            `- ${item.name}: ${item.amount} units sold`
        ).join('\n')}
        
        Based on this data, provide 1-2 brief insights about the machine's performance trends and 1 actionable suggestion for improvement.
        `;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openaiApiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { 
                        role: "system", 
                        content: `You are a vending machine analytics specialist. Provide brief, data-driven insights and actionable advice.`
                    },
                    { role: "user", content: prompt }
                ],
                temperature: 0.5
            })
        });

        const aiData = await response.json();
        
        if (aiData.error) {
            console.error("OpenAI API error:", aiData.error);
        }

        const aiInsights = aiData.choices && aiData.choices[0]?.message?.content || 
            "Unable to generate AI insights at this time.";

        // Structure final response
        const performanceData = {
            machineId: machine.id,
            location: machine.location,
            timeRange,
            generatedAt: new Date().toISOString(),
            monthlyComparisons: {
                revenue: {
                    current: currentRevenue,
                    previous: previousRevenue,
                    percentChange: calculatePercentChange(currentRevenue, previousRevenue)
                },
                sales: {
                    current: currentSalesCount,
                    previous: previousSalesCount,
                    percentChange: calculatePercentChange(currentSalesCount, previousSalesCount)
                },
                averageTicket: {
                    current: currentAverageTicket,
                    previous: previousAverageTicket,
                    percentChange: calculatePercentChange(currentAverageTicket, previousAverageTicket)
                },
                stockTurnover: {
                    current: currentStockTurnover,
                    previous: previousStockTurnover,
                    percentChange: calculatePercentChange(currentStockTurnover, previousStockTurnover)
                }
            },
            aiInsights
        };

        res.status(200).json(performanceData);
        
    } catch (error) {
        console.error("Error calculating machine performance metrics:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createMachine,
    addMachineToUser,
    getMachineContent,
    addItemsToContent,
    removeItemsFromContent,
    setMachineContent,
    getUserMachines,
    updateMachineStockMoney,
    getMachineRecommendations,
    getMachinePerformanceMetrics
}