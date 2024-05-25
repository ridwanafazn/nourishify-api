const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    menu: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, default: 'claimed' } // status to indicate order is claimed
});

module.exports = mongoose.model('Order', orderSchema);
