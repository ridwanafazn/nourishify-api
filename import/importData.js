const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const Staff = require('../models/Staff');
const studentsData = require('./students.json');
const staffsData = require('./staffs.json');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
});

const importData = async () => {
    try {
        // Import students
        await Student.deleteMany();
        const salt = await bcrypt.genSalt(10);
        const hashedPasswords = await Promise.all(
            studentsData.map(async (student) => {
                const hashedPassword = await bcrypt.hash(student.password, salt);
                return { ...student, password: hashedPassword };
            })
        );
        await Student.insertMany(hashedPasswords);
        console.log('Students imported successfully');

        // Import staffs
        await Staff.deleteMany();
        const hashedStaffs = await Promise.all(
            staffsData.map(async (staff) => {
                const hashedPassword = await bcrypt.hash(staff.password, salt);
                return { ...staff, password: hashedPassword };
            })
        );
        await Staff.insertMany(hashedStaffs);
        console.log('Staffs imported successfully');

        process.exit(0);
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
};

importData();
