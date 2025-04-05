const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    message:{
        type: String,
        required: true,
    },
    date:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        required: true,
        default: 'unread',
    },
    type:{
        type: String,
        required: true,
    }
  });

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    machines:{
        type: Array,
        required: true,
        default: [],
    },
    notifications:{
        type: [notificationSchema],
        required: true,
        default: [],
    }
}, {timestamps: true});

userSchema.index({ email: 1 }, { unique: true });

const userCollection = mongoose.model('User', userSchema);

module.exports = userCollection;