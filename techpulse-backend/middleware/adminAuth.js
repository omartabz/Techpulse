// Simple bearer-token auth for admin-only routes.
// Set ADMIN_TOKEN in your .env file.
function adminAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!process.env.ADMIN_TOKEN) {
    return res.status(500).json({ error: 'Server misconfigured: ADMIN_TOKEN not set' });
  }

  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}

module.exports = adminAuth;
