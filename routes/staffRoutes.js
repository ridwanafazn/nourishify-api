const express = require('express');
const router = express.Router();
const {
    staffLogin,
    checkStudentClaimStatus,
    claimOrderForStudent,
    updateMenuAvailability,
    getAllMenus
} = require('../controllers/staffController');

router.post('/staff-login', staffLogin);
router.get('/check-claim-status/:nisn', checkStudentClaimStatus);
router.put('/claim-order/:nisn', claimOrderForStudent);
router.put('/manage-menu', updateMenuAvailability);
router.get('/all-menus', getAllMenus);

module.exports = router;
