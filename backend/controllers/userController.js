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

        res.status(200).json({user});
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

        res.status(200).json({user});
    }catch(error){
        res.status(400).json({error: error.message});
    }
}

module.exports = {
    signup,
    signin
};