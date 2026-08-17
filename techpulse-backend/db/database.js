const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'techpulse.db'));

db.pragma('journal_mode = WAL');

// --- Schema ---
db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tag TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    author TEXT NOT NULL,
    published_at TEXT NOT NULL DEFAULT (datetime('now')),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// --- Seed articles if table is empty ---
const count = db.prepare('SELECT COUNT(*) AS c FROM articles').get().c;

if (count === 0) {
  const insert = db.prepare(`
    INSERT INTO articles (tag, title, summary, author, published_at)
    VALUES (@tag, @title, @summary, @author, @published_at)
  `);

  const seed = [
    {
      tag: 'AI',
      title: 'OpenAI unveils new reasoning tools for enterprise teams',
      summary:
        'New workflows aim to reduce manual analysis and speed up internal decision-making across data-heavy orgs.',
      author: 'AI desk',
      published_at: new Date().toISOString()
    },
    {
      tag: 'Cloud',
      title: 'Major providers cut storage costs for long-term archival workloads',
      summary:
        'A pricing refresh is pushing more businesses to modernize cold-storage strategies and reduce egress surprises.',
      author: 'Infra watch',
      published_at: new Date().toISOString()
    },
    {
      tag: 'Security',
      title: 'Zero-trust frameworks become default in large-scale deployments',
      summary:
        'Security teams are increasingly requiring stricter access controls to protect distributed work environments.',
      author: 'Security brief',
      published_at: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  const insertMany = db.transaction((rows) => {
    for (const row of rows) insert.run(row);
  });

  insertMany(seed);
}

module.exports = db;
