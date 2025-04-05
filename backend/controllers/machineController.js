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

const removeItemsFromContent = async (req, res) =>{
    try{
        const {id, key} = req.body || {};

        const machine = await machineModel.findOne({id});

        if(!machine){
            return res.status(400).json({error: 'Machine does not exist!'});
        }

        if(!key){
            return res.status(400).json({error: 'key is required!'});
        }

        machine.content.forEach((item) => {
            if(item.key === key){
                if(item.amount == 0){
                    return res.status(400).json({error: 'There are no items to remove!'});
                }
                item.amount = 0;
            }
        });

        await machine.save();

        res.status(200).json("Removed items from machine!");
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

const setMachineContent = async (req, res) =>{
    try{
        const {id, key, expiryDate, originalPrice, retailPrice, name} = req.body || {};

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
                name ? item.name = name : item.name;
            }
        });

        await machine.save();

        res.status(200).json("Machine content has been updated!");
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

module.exports = {
    createMachine,
    addMachineToUser,
    getMachineContent,
    addItemsToContent,
    removeItemsFromContent,
    setMachineContent
}