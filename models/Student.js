const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    claimedToday: { type: Boolean, default: false },
    lastClaimDate: { type: Date, default: null },
});

studentSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Reset claimedToday at midnight
const resetClaimedToday = () => {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0); // Set time to 00:00:00 next day

    // Reset claimedToday for all students
    this.updateMany({}, { $set: { claimedToday: false } })
        .then(() => console.log('Reset claimedToday for all students'))
        .catch(err => console.error('Failed to reset claimedToday:', err));
};

// Calculate time until midnight
const calculateTimeUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0); // Set time to 00:00:00 next day
    return midnight.getTime() - now.getTime();
};

// Run the resetClaimedToday function every day at midnight
setTimeout(() => {
    resetClaimedToday();
    setInterval(resetClaimedToday, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
}, calculateTimeUntilMidnight());

module.exports = mongoose.model('Student', studentSchema);
