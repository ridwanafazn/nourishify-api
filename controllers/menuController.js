const { Storage } = require('@google-cloud/storage');
const path = require('path');
const Menu = require('../models/Menu');
const formidable = require('formidable');

// Inisialisasi Google Cloud Storage
const storage = new Storage({
    projectId: process.env.GCLOUD_PROJECT_ID,
    keyFilename: path.join(__dirname, '../', process.env.GOOGLE_APPLICATION_CREDENTIALS)
});

const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

// Fungsi untuk mengupload file ke Google Cloud Storage dengan Formidable
const uploadFileToStorage = (file) => {
    return new Promise((resolve, reject) => {
        const blob = bucket.file(file.name); // Memperbaiki bagian ini dengan menyertakan nama file
        const blobStream = blob.createWriteStream({
            resumable: false,
            metadata: {
                contentType: file.type
            }
        });

        blobStream.on('error', (err) => {
            reject(err);
        });

        blobStream.on('finish', () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            resolve(publicUrl);
        });

        blobStream.end(file.data);
    });
};

exports.addMenu = async (req, res) => {
    try {
        const form = new formidable.IncomingForm();

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(400).send({ msg: 'Error parsing form data' });
            }

            const { name, description, stock } = fields;

            if (!files.image) {
                return res.status(400).send({ msg: 'No file uploaded' });
            }

            const imageUrl = await uploadFileToStorage({
                name: files.image.name,
                type: files.image.type,
                data: files.image.data
            });

            const newMenu = new Menu({
                name,
                description,
                imageUrl,
                stock
            });

            const menu = await newMenu.save();

            res.json(menu);
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getAllMenus = async (req, res) => {
    try {
        const menus = await Menu.find();
        res.json(menus);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateMenu = async (req, res) => {
    const { id } = req.params;

    try {
        const menu = await Menu.findById(id);

        if (!menu) {
            return res.status(404).json({ msg: 'Menu not found' });
        }

        const form = new formidable.IncomingForm();

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(400).send({ msg: 'Error parsing form data' });
            }

            const { name, description, stock } = fields;

            let imageUrl = menu.imageUrl;

            if (files.image) {
                imageUrl = await uploadFileToStorage({
                    name: files.image.name,
                    type: files.image.type,
                    data: files.image.data
                });
            }

            menu.name = name;
            menu.description = description;
            menu.stock = stock;
            menu.imageUrl = imageUrl;

            await menu.save();

            res.json(menu);
        });
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

        await menu.remove();

        res.json({ msg: 'Menu removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
