const express = require('express');
const router = express.Router();
const Game = require('../models/game');

router.get('/', async (req, res) => {
  const games = await Game.find();
  res.json({ success: true, games });
});

module.exports = router;