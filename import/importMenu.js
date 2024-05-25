const mongoose = require('mongoose');
const Menu = require('../models/Menu');
const menusData = require('./menus.json');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
});

const importMenu = async () => {
    try {
        await Menu.deleteMany();
        await Menu.insertMany(menusData);
        console.log('Menus imported successfully');
        process.exit(0);j
    } catch (error) {
        console.error('Error importing menus:', error);
        process.exit(1);
    }
};

importMenu();
