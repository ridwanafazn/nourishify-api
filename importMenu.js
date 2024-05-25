const mongoose = require('mongoose');
const Menu = require('./models/Menu'); // Sesuaikan path sesuai struktur proyek Anda
const dotenv = require('dotenv');

dotenv.config();

// Data menu yang ingin diimpor
const menuData = [
    {
        name: 'Nasi Goreng',
        description: 'Nasi goreng spesial dengan telur, ayam, dan kecap',
        imageUrl: 'https://storage.googleapis.com/ppl-menu/nasi_goreng.jpg',
        stock: 10
    },
    {
        name: 'Mie Ayam',
        description: 'Mie ayam dengan pangsit dan kuah kaldu ayam',
        imageUrl: 'https://storage.googleapis.com/ppl-menu/mie_ayam.jpg',
        stock: 15
    },
    {
        name: 'Soto Betawi',
        description: 'Soto Betawi dengan daging sapi, santan, dan bumbu rempah',
        imageUrl: 'https://storage.googleapis.com/ppl-menu/soto_betawi.jpg',
        stock: 8
    }
];

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI, {
})
    .then(() => {
        console.log('MongoDB connected');
        // Import data menu ke MongoDB
        importMenuData();
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

// Fungsi untuk mengimpor data menu ke MongoDB
async function importMenuData() {
    try {
        // Hapus semua data menu yang ada di koleksi
        await Menu.deleteMany();

        // Masukkan data menu baru
        const insertedMenus = await Menu.insertMany(menuData);
        console.log(`${insertedMenus.length} menus inserted successfully`);

        // Keluar dari proses Node.js
        process.exit(0);
    } catch (err) {
        console.error('Error importing data:', err);
        process.exit(1);
    }
}
