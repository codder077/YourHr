const express = require('express');
const { signupUser, getUserProfile, updateUserProfile } = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signupUser);
router.get('/profile/:userId', getUserProfile);
router.put('/profile/:userId',updateUserProfile);
module.exports = router;
