const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const Student = require('../models/Student');
const Staff = require('../models/Staff');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
        importData();
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Function to import data
const importData = async () => {
    try {
        // Read student data from JSON file
        const studentData = JSON.parse(fs.readFileSync('students.json', 'utf-8'));
        // Encrypt passwords and save students to database
        for (let student of studentData) {
            const salt = await bcrypt.genSalt(10);
            student.password = await bcrypt.hash(student.password, salt);
            const newStudent = new Student(student);
            await newStudent.save();
        }
        console.log('Student data imported successfully');

        // Read staff data from JSON file
        const staffData = JSON.parse(fs.readFileSync('staffs.json', 'utf-8'));
        // Encrypt passwords and save staff to database
        for (let staff of staffData) {
            const salt = await bcrypt.genSalt(10);
            staff.password = await bcrypt.hash(staff.password, salt);
            const newStaff = new Staff(staff);
            await newStaff.save();
        }
        console.log('Staff data imported successfully');

        process.exit();
    } catch (err) {
        console.error('Error importing data:', err);
        process.exit(1);
    }
};
