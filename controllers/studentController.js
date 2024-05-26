const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const Menu = require('../models/Menu');
const Order = require('../models/Order');

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Login student
exports.studentLogin = async (req, res) => {
    const { nisn, password } = req.body;

    try {
        const student = await Student.findOne({ nisn });

        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        const isMatch = await bcrypt.compare(password, student.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const token = generateToken(student._id);

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// View student profile
exports.getStudentProfile = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    try {
        const student = await Student.findById(decoded.id).select('-password');

        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        res.json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Update student profile
exports.updateStudentProfile = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { name, gender, birthPlace, birthDate, school, major, class: studentClass } = req.body;

    try {
        let student = await Student.findById(decoded.id);

        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        const updateData = {
            name,
            gender,
            birthPlace,
            birthDate,
            school,
            major,
            class: studentClass
        };

        student = await Student.findByIdAndUpdate(decoded.id, { $set: updateData }, { new: true }).select('-password');

        res.json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Update student password
exports.updateStudentPassword = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { currentPassword, newPassword } = req.body;

    try {
        let student = await Student.findById(decoded.id);

        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, student.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Current password is incorrect' });
        }

        student.password = newPassword;
        await student.save();

        res.json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get available menus
exports.getAvailableMenus = async (req, res) => {
    try {
        const menus = await Menu.find({ isActive: true });

        res.json(menus);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Check claim status
exports.checkClaimStatus = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    try {
        const student = await Student.findById(decoded.id);

        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        res.json({ claimedToday: student.claimedToday });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Claim menu
exports.claimMenu = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { menuId } = req.body;

    try {
        const student = await Student.findById(decoded.id);

        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        if (student.claimedToday) {
            return res.status(400).json({ msg: 'You have already claimed a menu today' });
        }

        const menu = await Menu.findById(menuId);

        if (!menu || !menu.isActive || menu.stock <= 0) {
            return res.status(404).json({ msg: 'Menu not available' });
        }

        const newOrder = new Order({
            student: student._id,
            menu: menu._id,
            status: 'claimed'
        });

        await newOrder.save();

        menu.stock -= 1;
        await menu.save();

        student.claimedToday = true;
        await student.save();

        res.json({ msg: 'Menu claimed successfully', order: newOrder });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get order history
exports.getOrderHistory = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    try {
        const orders = await Order.find({ student: decoded.id }).populate('menu');

        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
