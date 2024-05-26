const express = require('express');
const router = express.Router();
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
router.get('/profile', getStudentProfile);
router.put('/profile', updateStudentProfile);
router.put('/password', updateStudentPassword);
router.get('/menus', getAvailableMenus);
router.get('/check-claim-status', checkClaimStatus);
router.post('/claim-menu', claimMenu);
router.get('/order-history', getOrderHistory);

module.exports = router;
