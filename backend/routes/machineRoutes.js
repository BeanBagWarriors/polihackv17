const express = require('express');
const {
    createMachine,
    addMachineToUser,
    getMachineContent,
    addItemsToContent,
    removeItemsFromContent,
    setMachineContent,
    getUserMachines,
    updateMachineStockMoney
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

module.exports = router;
