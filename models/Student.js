const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    nisn: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    gender: { type: String, required: true },
    birthPlace: { type: String, required: true },
    birthDate: { type: Date, required: true },
    major: { type: String, required: true },
    class: { type: String, required: true },
    claimedToday: { type: Boolean, default: false }
});

module.exports = mongoose.model('Student', studentSchema);
