const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff');
const Student = require('../models/Student');
const Menu = require('../models/Menu');

// @route   POST /api/staff/login
// @desc    Staff login
// @access  Public
exports.staffLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        let staff = await Staff.findOne({ username });

        if (!staff) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, staff.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: staff.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   GET /api/staff/check-claim-status/:nisn
// @desc    Check student claim status for today
// @access  Private (Staff)
exports.checkStudentClaimStatus = async (req, res) => {
    const { nisn } = req.params;

    try {
        const student = await Student.findOne({ nisn });

        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        const claimedToday = student.claimedToday;
        const status = claimedToday ? 'tersedia' : 'tidak tersedia';

        res.json({ status });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   PUT /api/staff/claim-order/:nisn
// @desc    Claim order for student and update claimed status
// @access  Private (Staff)
exports.claimOrderForStudent = async (req, res) => {
    const { nisn } = req.params;

    try {
        let student = await Student.findOne({ nisn });

        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        student.claimedToday = false;
        await student.save();

        res.json({ msg: 'Claimed order and updated status successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   PUT /api/staff/manage-menu
// @desc    Update menu availability
// @access  Private (Staff)
exports.updateMenuAvailability = async (req, res) => {
    const { menuIds, isActive } = req.body;

    try {
        const updatePromises = menuIds.map(async (menuId) => {
            await Menu.findByIdAndUpdate(menuId, { isActive });
        });

        await Promise.all(updatePromises);

        res.json({ msg: 'Menu availability updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
