const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { nisn, password } = req.body;

    try {
        const student = await Student.findOne({ nisn });
        if (!student) {
            return res.status(400).json({ msg: 'Student not found' });
        }

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: student.id,
                role: 'student'
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id).select('-password');
        res.json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updatePassword = async (req, res) => {
    const { password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt);

        await Student.findByIdAndUpdate(req.user.id, { password: newPassword });

        res.json({ msg: 'Password updated' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
