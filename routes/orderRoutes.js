const express = require('express');
const { claimOrder, getOrderHistory } = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/claim', auth, claimOrder);
router.get('/history', auth, getOrderHistory);

module.exports = router;
