const userModel = require('../models/userModel');

const signup = async (req, res) =>{
    try {
        const {username, password} = req.body;

        if(!username || !password){
            return res.status(400).json({error: 'All fields must be filled!'});
        }
        
        const user = await userModel.create({username, password});
        res.status(200).json({user});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

module.exports = {
    signup
};