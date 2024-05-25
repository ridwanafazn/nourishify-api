const Order = require('../models/Order');
const Student = require('../models/Student');
const Menu = require('../models/Menu');

// Claim order
exports.claimOrder = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id);
        if (student.claimedToday) {
            return res.status(400).json({ msg: 'You have already claimed an order today' });
        }

        const { menuId } = req.body;
        const menu = await Menu.findById(menuId);
        if (!menu) {
            return res.status(404).json({ msg: 'Menu not found' });
        }

        if (menu.stock <= 0) {
            return res.status(400).json({ msg: 'Menu out of stock' });
        }

        menu.stock -= 1;
        student.claimedToday = true;
        await menu.save();
        await student.save();

        const order = new Order({
            student: student.id,
            menu: menu.id,
            status: 'claimed'
        });

        await order.save();

        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get order history
exports.getOrderHistory = async (req, res) => {
    try {
        const orders = await Order.find({ student: req.user.id }).populate('menu');
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
