const express = require('express');
const {
    createMachine,
    addMachineToUser,
    getMachineContent,
    addItemsToContent,
    removeItemsFromContent,
    setMachineContent,
    getUserMachines
} = require('../controllers/machineController');

const router = express.Router();

router.post('/createMachine', createMachine);
router.post('/addMachineToUser', addMachineToUser);
router.get('/getMachineContent/:id', getMachineContent);
router.post('/addItemsToContent', addItemsToContent);
router.post('/removeItemsFromContent', removeItemsFromContent);
router.post('/setMachineContent', setMachineContent);
router.get('/getUserMachines/:email', getUserMachines);

module.exports = router;
