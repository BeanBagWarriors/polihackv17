const express = require('express');
const { 
    signup,
    signin,
    getNotifications
} = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/getNotifications/:email', getNotifications);

module.exports = router;