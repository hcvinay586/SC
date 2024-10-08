const express = require('express');
const { registerUser, authUser, logoutUser, refreshAccessToken, validateToken } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/token/refresh', refreshAccessToken);
router.post('/logout', logoutUser);
router.get('/validate-token', validateToken);

module.exports = router;
