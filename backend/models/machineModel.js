const mongoose = require('mongoose');

const contentItemSchema = new mongoose.Schema({
    key:{
        type: String,
        required: true,
    },
    expiryDate:{
        type: String,
        required: true,
    },
    originalPrice:{
        type: Number,
        required: true,
    },
    retailPrice:{
        type: Number,
        required: true,
    },
    amount:{
        type: Number,
        required: true,
    },
    name:{
        type: String,
        required: true,
    }
  }, { _id: false });

const machineSchema = new mongoose.Schema({
    id:{
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
        type: [contentItemSchema],
        required: true,
        default: [],
    },
    location:{
        type: String,
        required: true,
        default: 'unset',
    },
    totalSales:{
        type: Array,
        required: true,
        default: [],
    },
    totalRevenue:{
        type: Number,
        required: true,
        default: 0,
    },
    activeRevenue:{
        type: Number,
        required: true,
        default: 0,
    },
    salesHistory:{
        type: Array,
        required: true,
        default: [],
    },

}, {timestamps: true});

const machineCollection = mongoose.model('Machines', machineSchema);

module.exports = machineCollection;