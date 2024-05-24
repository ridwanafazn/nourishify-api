const express = require('express');
const { login, getProfile, updatePassword } = require('../controllers/studentController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/login', login);
router.get('/profile', auth, getProfile);
router.put('/update-password', auth, updatePassword);

module.exports = router;
