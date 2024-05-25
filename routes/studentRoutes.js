const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { 
    studentLogin,
    getStudentProfile,
    updateStudentProfile,
    updateStudentPassword,
    getAvailableMenus,
    checkClaimStatus,
    claimMenu,
    getOrderHistory
} = require('../controllers/studentController');

router.post('/student-login', studentLogin);
router.get('/profile', auth, getStudentProfile);
router.put('/profile', auth, updateStudentProfile);
router.put('/password', auth, updateStudentPassword);
router.get('/menus', auth, getAvailableMenus);
router.get('/check-claim-status', auth, checkClaimStatus);
router.post('/claim-menu', auth, claimMenu);
router.get('/order-history', auth, getOrderHistory);

module.exports = router;
