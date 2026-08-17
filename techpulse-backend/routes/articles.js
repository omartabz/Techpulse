const express = require('express');
const db = require('../db/database');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// GET /api/articles?limit=10 - list latest articles (public)
router.get('/', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);

  const articles = db
    .prepare('SELECT * FROM articles ORDER BY published_at DESC LIMIT ?')
    .all(limit);

  res.json(articles);
});

// GET /api/articles/:id (public)
router.get('/:id', (req, res) => {
  const article = db
    .prepare('SELECT * FROM articles WHERE id = ?')
    .get(req.params.id);

  if (!article) return res.status(404).json({ error: 'Article not found' });
  res.json(article);
});

// POST /api/articles (admin only)
router.post('/', adminAuth, (req, res) => {
  const { tag, title, summary, author, published_at } = req.body;

  if (!tag || !title || !summary || !author) {
    return res.status(400).json({ error: 'tag, title, summary, and author are required' });
  }

  const result = db
    .prepare(
      `INSERT INTO articles (tag, title, summary, author, published_at)
       VALUES (?, ?, ?, ?, COALESCE(?, datetime('now')))`
    )
    .run(tag, title, summary, author, published_at || null);

  const created = db.prepare('SELECT * FROM articles WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(created);
});

// PUT /api/articles/:id (admin only)
router.put('/:id', adminAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Article not found' });

  const { tag, title, summary, author, published_at } = req.body;

  db.prepare(
    `UPDATE articles
     SET tag = ?, title = ?, summary = ?, author = ?, published_at = ?
     WHERE id = ?`
  ).run(
    tag ?? existing.tag,
    title ?? existing.title,
    summary ?? existing.summary,
    author ?? existing.author,
    published_at ?? existing.published_at,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// DELETE /api/articles/:id (admin only)
router.delete('/:id', adminAuth, (req, res) => {
  const result = db.prepare('DELETE FROM articles WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Article not found' });
  res.status(204).send();
});

module.exports = router;
