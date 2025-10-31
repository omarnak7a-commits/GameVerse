const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// === تسجيل دخول + تسجيل جديد تلقائي ===
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, msg: 'Email and password required' });
    }

    let user = await User.findOne({ email });

    // لو مفيش يوزر → نعمل واحد جديد
    if (!user) {
      const hashed = await bcrypt.hash(password, 10);
      user = await User.create({ email, password: hashed });
      console.log(`New user created: ${email}`);
    }

    // تحقق من الباسورد
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, msg: 'Wrong password' });
    }

    // إصدار توكن
    const token = jwt.sign({ id: user._id }, 'secret123', { expiresIn: '7d' });

    res.json({ success: true, token, msg: 'Login successful' });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server error' });
  }
});

module.exports = router;