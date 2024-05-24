const express = require('express');
const { login } = require('../controllers/staffController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/login', login);
// Tambahkan rute lain yang diperlukan untuk staff

module.exports = router;
