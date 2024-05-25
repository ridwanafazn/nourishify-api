const express = require('express');
const { getAllMenus } = require('../controllers/menuController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', auth, getAllMenus);

module.exports = router;
