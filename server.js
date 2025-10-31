require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rate Limit
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

// Multer (رفع صور)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Models
const User = require('./models/user');
const Game = require('./models/game');

// === Routes ===
app.use('/api/auth', require('./routes/auth'));
app.use('/api/games', require('./routes/games'));

// === HTML Pages ===
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'home.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

// === إضافة لعبة (Admin) ===
app.post('/api/games/add', upload.single('img'), async (req, res) => {
  try {
    const { name, download } = req.body;
    const img = '/uploads/' + req.file.filename;
    await Game.create({ name, img, download });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// === Start Server ===
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gameverse', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected');

    // Default Admin
    if (!await User.findOne({ email: 'admin@gameverse.com' })) {
      const hashed = await bcrypt.hash('admin123', 10);
      await User.create({ email: 'admin@gameverse.com', password: hashed });
      console.log('Admin created: admin@gameverse.com / admin123');
    }

    // Default Games
    if (await Game.countDocuments() === 0) {
      await Game.insertMany([
        { name: 'GTA V', img: '/uploads/gta.jpg', download: 'https://example.com/gta.zip' },
        { name: 'Minecraft', img: '/uploads/mc.jpg', download: 'https://example.com/mc.zip' }
      ]);
      console.log('Default games added');
    }

    app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed:', err);
  }
})();