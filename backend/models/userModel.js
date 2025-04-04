const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
}, {timestamps: true});

userSchema.index({ email: 1 }, { unique: true });

const userCollection = mongoose.model('User', userSchema);

module.exports = userCollection;