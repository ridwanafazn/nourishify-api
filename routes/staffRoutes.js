const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
    staffLogin,
    checkStudentClaimStatus,
    claimOrderForStudent,
    updateMenuAvailability
} = require('../controllers/staffController');

router.post('/staff-login', staffLogin);
router.get('/check-claim-status/:nisn', auth, checkStudentClaimStatus);
router.put('/claim-order/:nisn', auth, claimOrderForStudent);
router.put('/manage-menu', auth, updateMenuAvailability);

module.exports = router;
