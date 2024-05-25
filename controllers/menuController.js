const Menu = require('../models/Menu');

// Get all menus
exports.getAllMenus = async (req, res) => {
    try {
        const menus = await Menu.find();
        res.json(menus);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Activate menu
exports.activateMenu = async (req, res) => {
    const { id } = req.params;
    const { stock } = req.body;

    try {
        const activeMenus = await Menu.find({ active: true });
        if (activeMenus.length >= 5) {
            return res.status(400).json({ msg: 'Maximum 5 menus can be active' });
        }

        const menu = await Menu.findById(id);
        if (!menu) {
            return res.status(404).json({ msg: 'Menu not found' });
        }

        menu.active = true;
        menu.stock = stock;
        await menu.save();

        res.json(menu);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Deactivate menu
exports.deactivateMenu = async (req, res) => {
    const { id } = req.params;

    try {
        const menu = await Menu.findById(id);
        if (!menu) {
            return res.status(404).json({ msg: 'Menu not found' });
        }

        menu.active = false;
        await menu.save();

        res.json(menu);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
