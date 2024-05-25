const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    stock: { type: Number, required: true },
    isActive: { type: Boolean, default: false }
});

module.exports = mongoose.model('Menu', menuSchema);
