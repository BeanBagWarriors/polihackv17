const express = require('express');
const {
    createMachine,
    addMachineToUser
} = require('../controllers/machineController');

const router = express.Router();

router.post('/createMachine', createMachine);
router.post('/addMachineToUser', addMachineToUser);

module.exports = router;
