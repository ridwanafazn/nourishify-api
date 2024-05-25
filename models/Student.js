const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    nisn: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    gender: { type: String, required: true },
    birthPlace: { type: String, required: false },
    birthDate: { type: Date, required: false },
    school: { type: String, required: false },
    major: { type: String, required: false },
    class: { type: String, required: false },
    claimedToday: { type: Boolean, default: false }
});

module.exports = mongoose.model('Student', studentSchema);
