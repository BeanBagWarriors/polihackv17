const userModel = require('../models/userModel');

const signup = async (req, res) =>{
    try {
        const {email, password} = req.body || {};

        if(!email || !password){
            return res.status(400).json({error: 'All fields must be filled!'});
        }

        const existingUser = await userModel.findOne({ email});

        if(existingUser){
            return res.status(400).json({error: `There's already an account with this email!`});
        }

        const user = await userModel.create({email, password});

        res.status(200).json({username: user.email, token: user._id});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const signin = async (req, res) =>{
    try{
        const {email, password} = req.body || {};

        if(!email || !password){
            return res.status(400).json({error: 'All fields must be filled!'});
        }

        const user = await userModel.findOne({email});

        if(!user){
            return res.status(400).json({error: 'User does not exist!'});
        }

        if(user.password !== password){
            return res.status(400).json({error: 'Incorrect password!'});
        }

        res.status(200).json({username: user.email, token: user._id});
    }catch(error){
        res.status(400).json({error: error.message});
    }
}

const sendNotification = (email, message, type) => {
    const date = new Date().toLocaleDateString('en-US', {day: '2-digit', month: '2-digit', year: 'numeric'});
    const notification = {
        message,
        date,
        type
    };

    userModel.findOneAndUpdate(
        {email},
        {$push: {notifications: notification}},
        {new: true}
    ).then(() => {
        console.log('Notification sent successfully!');
    }).catch((error) => {
        console.error('Error sending notification:', error);
    });
}

const getNotifications = async (req, res) =>{
    try{
        const {email} = req.params || {};

        if(!email){
            return res.status(400).json({error: 'Email is required!'});
        }

        const user = await userModel.findOne({email});

        if(!user){
            return res.status(400).json({error: 'User does not exist!'});
        }

        res.status(200).json({notifications: user.notifications});
    }catch(error){
        res.status(400).json({error: error.message});
    }
}

module.exports = {
    signup,
    signin,
    getNotifications
};