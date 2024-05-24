const Menu = require('../models/Menu');

exports.getAllMenus = async (req, res) => {
    try {
        const menus = await Menu.find();
        res.json(menus);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.addMenu = async (req, res) => {
    const { name, description, imageUrl, stock } = req.body;

    try {
        const newMenu = new Menu({
            name,
            description,
            imageUrl,
            stock
        });

        const menu = await newMenu.save();
        res.json(menu);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateMenu = async (req, res) => {
    const { id } = req.params;
    const { name, description, imageUrl, stock } = req.body;

    try {
        let menu = await Menu.findById(id);

        if (!menu) {
            return res.status(404).json({ msg: 'Menu not found' });
        }

        menu = await Menu.findByIdAndUpdate(id, { $set: { name, description, imageUrl, stock } }, { new: true });

        res.json(menu);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteMenu = async (req, res) => {
    const { id } = req.params;

    try {
        const menu = await Menu.findById(id);

        if (!menu) {
            return res.status(404).json({ msg: 'Menu not found' });
        }

        await Menu.findByIdAndRemove(id);

        res.json({ msg: 'Menu removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
