const machineModel = require('../models/machineModel');
const userModel = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');

const createMachine = async (req, res) => {
    try {
        const { maxPins} = req.body || {};

        if(!maxPins){
            return res.status(400).json({ error: 'Invalid pins!' });
        }

        if(maxPins % 16 !== 0){
            return res.status(400).json({ error: 'Invalid pins!' });
        }

        const key = uuidv4();

        const machine = await machineModel.create({ key, maxPins });

        res.status(200).json(machine);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const addMachineToUser = async (req, res) =>{
    try{
        const {email, machineKey} = req.body || {};
        
        const user = await userModel.findOne({email});
        const machine = await machineModel.findOne({key: machineKey});

        if(!user){
            return res.status(400).json({error: 'User does not exist!'});
        }

        if(!machine){
            return res.status(400).json({error: 'Machine does not exist!'});
        }

        if(user.machines.includes(machineKey)){
            return res.status(400).json({error: 'Machine is already included!'});
        }

        user.machines.push(machineKey);
        await user.save();

        res.status(200).json({message: 'Machine added to user!'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const getMachineContent = async (req, res) =>{
    try{
        const {key} = req.params || {};

        if(!key){
            return res.status(400).json({error: 'Key is required!'});
        }

        const machine = await machineModel.findOne({key});

        if(!machine){
            return res.status(400).json({error: 'Machine does not exist!'});
        }

        res.status(200).json(machine);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

module.exports = {
    createMachine,
    addMachineToUser,
    getMachineContent
}