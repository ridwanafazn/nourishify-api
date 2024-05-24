const express = require('express');
const { getAllMenus, addMenu, updateMenu, deleteMenu } = require('../controllers/menuController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', auth, getAllMenus);
router.post('/', auth, addMenu);
router.put('/:id', auth, updateMenu);
router.delete('/:id', auth, deleteMenu);

module.exports = router;
