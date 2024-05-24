const Order = require('../models/Order');
const Student = require('../models/Student');
const Menu = require('../models/Menu');

exports.claimOrder = async (req, res) => {
    const { menuId } = req.body;

    try {
        const student = await Student.findById(req.user.id);
        if (student.claimedToday) {
            return res.status(400).json({ msg: 'Order already claimed today' });
        }

        const menu = await Menu.findById(menuId);
        if (!menu) {
            return res.status(404).json({ msg: 'Menu not found' });
        }

        const order = new Order({
            user: req.user.id,
            menu: menuId,
        });

        student.claimedToday = true;
        await student.save();
        await order.save();

        res.json({ msg: 'Order claimed', order });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getOrderHistory = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate('menu', 'name description');
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
