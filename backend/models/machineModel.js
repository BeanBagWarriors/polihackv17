const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
    key:{
        type: String,
        required: true,
        unique: true,
    },
    name:{
        type: String,
        required: true,
        default: 'Vending Machine',
    },
    content:{
        type: Array,
        required: true,
        default: [],
    },
    maxPins:{
        type: String,
        required: true,
    }
}, {timestamps: true});

const machineCollection = mongoose.model('Machines', machineSchema);

module.exports = machineCollection;