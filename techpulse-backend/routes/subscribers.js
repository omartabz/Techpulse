const express = require('express');
const db = require('../db/database');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/subscribe (public)
router.post('/', (req, res) => {
  const { email } = req.body;

  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'A valid email is required' });
  }

  try {
    db.prepare('INSERT INTO subscribers (email) VALUES (?)').run(email.toLowerCase().trim());
    res.status(201).json({ message: 'Subscribed' });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(200).json({ message: 'Already subscribed' });
    }
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// GET /api/subscribe/count (admin only) - quick sanity check / dashboard number
router.get('/count', adminAuth, (req, res) => {
  const { c } = db.prepare('SELECT COUNT(*) AS c FROM subscribers').get();
  res.json({ count: c });
});

// GET /api/subscribe (admin only) - export list
router.get('/', adminAuth, (req, res) => {
  const subscribers = db.prepare('SELECT id, email, created_at FROM subscribers ORDER BY created_at DESC').all();
  res.json(subscribers);
});

module.exports = router;
