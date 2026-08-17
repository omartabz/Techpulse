require('dotenv').config();
const express = require('express');
const cors = require('cors');

const articlesRouter = require('./routes/articles');
const subscribersRouter = require('./routes/subscribers');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // for production, restrict this to your site's origin
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/articles', articlesRouter);
app.use('/api/subscribe', subscribersRouter);

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Tech Pulse backend running on http://localhost:${PORT}`);
});
