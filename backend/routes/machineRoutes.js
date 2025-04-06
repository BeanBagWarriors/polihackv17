const express = require('express');
const {
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
} = require('../controllers/machineController');

const router = express.Router();

router.post('/createMachine', createMachine);
router.post('/addMachineToUser', addMachineToUser);
router.get('/getMachineContent/:id', getMachineContent);
router.post('/addItemsToContent', addItemsToContent);
router.post('/removeItemsFromContent', removeItemsFromContent);
router.post('/setMachineContent', setMachineContent);
router.get('/getUserMachines/:email', getUserMachines);
router.post('/updateMachineStockMoney', updateMachineStockMoney);
router.get('/getMachineRecommendations/:id', getMachineRecommendations);
router.get('/getPerformanceMetrics/:id/:timeRange', getMachinePerformanceMetrics);

module.exports = router;
