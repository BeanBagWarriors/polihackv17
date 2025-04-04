const machineModel = require('../models/machineModel');
const userModel = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');

const createMachine = async (req, res) => {
    try {
        const key = uuidv4();

        const machine = await machineModel.create({ key });

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

module.exports = {
    createMachine,
    addMachineToUser
}