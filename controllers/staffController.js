const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Staff = require('../models/Staff');
const Student = require('../models/Student');
const Menu = require('../models/Menu');
const Order = require('../models/Order');

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Login staff
exports.staffLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const staff = await Staff.findOne({ username });

        if (!staff) {
            return res.status(404).json({ msg: 'Staff not found' });
        }

        const isMatch = await bcrypt.compare(password, staff.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const token = generateToken(staff._id);

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Check student claim status
exports.checkStudentClaimStatus = async (req, res) => {
    try {
        const student = await Student.findOne({ nisn: req.params.nisn });

        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        res.json({ claimedToday: student.claimedToday });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Claim order for student
exports.claimOrderForStudent = async (req, res) => {
    try {
        const student = await Student.findOne({ nisn: req.params.nisn });

        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        const newOrder = new Order({
            student: student._id,
            menu: req.body.menuId,
            status: 'claimed'
        });

        await newOrder.save();

        student.claimedToday = true;
        await student.save();

        res.json({ msg: 'Order claimed successfully', order: newOrder });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


// Get all menus
exports.getAllMenus = async (req, res) => {
    try {
        const menus = await Menu.find();
        res.json(menus);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Update menu availability
exports.updateMenuAvailability = async (req, res) => {
    const { menuId, isActive, stock } = req.body;

    try {
        let menu = await Menu.findById(menuId);

        if (!menu) {
            return res.status(404).json({ msg: 'Menu not found' });
        }

        menu.isActive = isActive;
        menu.stock = stock;

        await menu.save();

        res.json({ msg: 'Menu updated successfully', menu });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
