const express = require('express');
const {
    createMachine,
    addMachineToUser,
    getMachineContent
} = require('../controllers/machineController');

const router = express.Router();

router.post('/createMachine', createMachine);
router.post('/addMachineToUser', addMachineToUser);
router.get('/getMachineContent/:key', getMachineContent);

module.exports = router;
