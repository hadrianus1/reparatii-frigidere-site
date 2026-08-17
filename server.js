require('dotenv').config();
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');

const app = express();

app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '15mb' }));

// ===== RATE LIMITERS =====

const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false, message: { error: 'Prea multe cereri, încearcă mai târziu.' } });
const postLimiter   = rateLimit({ windowMs: 15 * 60 * 1000, max: 10,  standardHeaders: true, legacyHeaders: false, message: { error: 'Prea multe trimiteri, încearcă mai târziu.' } });
const authLimiter   = rateLimit({ windowMs: 15 * 60 * 1000, max: 5,   standardHeaders: true, legacyHeaders: false, message: { error: 'Prea multe încercări de autentificare.' } });

app.use('/api/', generalLimiter);

// ===== JWT AUTH =====

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) console.warn('⚠️  JWT_SECRET not set — admin login disabled');

const requireAdmin = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try { jwt.verify(auth.slice(7), JWT_SECRET); next(); } catch { return res.status(401).json({ error: 'Token expired or invalid' }); }
};

const isAdminReq = (req) => {
  const auth = req.headers.authorization;
  return auth && JWT_SECRET && (() => { try { jwt.verify(auth.slice(7), JWT_SECRET); return true; } catch { return false; } })();
};

// ===== DATABASE (real pg or in-memory fallback) =====

const PLACEHOLDER = 'postgresql://user:password@host/dbname';
const useRealDB = process.env.DATABASE_URL && process.env.DATABASE_URL !== PLACEHOLDER;

let db;

if (useRealDB) {
  const { Pool } = require('pg');
  const isRemote = !process.env.DATABASE_URL.includes('localhost');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: isRemote ? { rejectUnauthorized: false } : false });
  db = { query: (text, params) => pool.query(text, params), isReal: true };
  console.log('🐘 Using PostgreSQL database');
} else {
  let postIdSeq = 1, commentIdSeq = 1;
  const posts = new Map();
  const comments = new Map();
  const postReactions = new Map();    // Map<postId, Map<sessionId, type>>
  const commentReactions = new Map(); // Map<commentId, Map<sessionId, type>>
  db = { isReal: false, posts, comments, postReactions, commentReactions, nextPostId: () => postIdSeq++, nextCommentId: () => commentIdSeq++ };
  console.log('💾 Using in-memory store (data resets on restart)');
}

const initDB = async () => {
  if (!db.isReal) return;
  await db.query(`CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY, title VARCHAR(200) NOT NULL, slug VARCHAR(200) NOT NULL UNIQUE,
    excerpt TEXT, content TEXT NOT NULL, category VARCHAR(100) DEFAULT 'General',
    image_url VARCHAR(500), published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
  )`);
  await db.query(`CREATE TABLE IF NOT EXISTS post_comments (
    id SERIAL PRIMARY KEY, post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES post_comments(id) ON DELETE CASCADE,
    username VARCHAR(100) NOT NULL DEFAULT 'Anonim', text TEXT NOT NULL,
    approved BOOLEAN DEFAULT false, created_at TIMESTAMPTZ DEFAULT NOW()
  )`);
  await db.query(`CREATE TABLE IF NOT EXISTS post_reactions (
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    session_id VARCHAR(64) NOT NULL, type VARCHAR(10) NOT NULL,
    PRIMARY KEY (post_id, session_id)
  )`);
  await db.query(`CREATE TABLE IF NOT EXISTS comment_reactions (
    comment_id INTEGER REFERENCES post_comments(id) ON DELETE CASCADE,
    session_id VARCHAR(64) NOT NULL, type VARCHAR(10) NOT NULL,
    PRIMARY KEY (comment_id, session_id)
  )`);
};

// ===== FILE UPLOAD (base64 JSON — avoids CRA proxy multipart issues) =====

const uploadsDir = path.join(__dirname, 'public', 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
} catch (err) {
  // Read-only filesystem (e.g. Vercel serverless) — /api/upload will fail gracefully per-request instead.
  console.warn('⚠️  Could not create uploads dir:', err.message);
}

app.post('/api/upload', requireAdmin, async (req, res) => {
  try {
    const { filename = 'upload.jpg', type = 'image/jpeg', data } = req.body;
    if (!data) return res.status(400).json({ error: 'No file data' });
    if (!type.startsWith('image/')) return res.status(400).json({ error: 'Only images allowed' });
    const ext = path.extname(filename).toLowerCase() || '.jpg';
    const name = Date.now() + '-' + Math.random().toString(36).slice(2) + ext;
    fs.writeFileSync(path.join(uploadsDir, name), Buffer.from(data, 'base64'));
    res.json({ url: '/uploads/' + name });
  } catch (err) {
    console.error('Upload error:', err.message);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Serve uploaded files in dev mode too
app.use('/uploads', express.static(uploadsDir));

// ===== IMAGE PROXY (bypasses hotlink protection on external gallery images) =====

app.get('/api/img-proxy', (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).end();
  let parsed;
  try { parsed = new URL(url); } catch { return res.status(400).end(); }
  if (!['http:', 'https:'].includes(parsed.protocol)) return res.status(400).end();

  const mod = parsed.protocol === 'https:' ? https : http;
  const proxyReq = mod.get({
    hostname: parsed.hostname,
    port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
    path: parsed.pathname + (parsed.search || ''),
    headers: {
      'Referer': `${parsed.protocol}//${parsed.hostname}/`,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'image/webp,image/*,*/*',
    },
  }, (imgRes) => {
    if (imgRes.statusCode < 200 || imgRes.statusCode >= 300) {
      imgRes.resume();
      return res.status(502).end();
    }
    res.setHeader('Content-Type', imgRes.headers['content-type'] || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    imgRes.pipe(res);
  });
  proxyReq.on('error', () => { if (!res.headersSent) res.status(502).end(); });
  proxyReq.setTimeout(10000, () => { proxyReq.destroy(); if (!res.headersSent) res.status(504).end(); });
});

// ===== ADMIN =====

app.post('/api/admin/login', authLimiter, (req, res) => {
  const { password } = req.body;
  if (!JWT_SECRET || !process.env.ADMIN_PASSWORD) return res.status(503).json({ error: 'Admin not configured' });
  if (password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'Parolă incorectă' });
  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

app.get('/api/admin/verify', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ') || !JWT_SECRET) return res.json({ valid: false });
  try { jwt.verify(auth.slice(7), JWT_SECRET); res.json({ valid: true }); } catch { res.json({ valid: false }); }
});

// ===== BLOG POSTS =====

const makeSlug = (title) => title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now();

app.get('/api/posts', async (req, res) => {
  try {
    const admin = isAdminReq(req);
    if (db.isReal) {
      const result = admin
        ? await db.query('SELECT id, title, slug, excerpt, category, image_url, published, created_at, updated_at FROM posts ORDER BY created_at DESC')
        : await db.query('SELECT id, title, slug, excerpt, category, image_url, published, created_at FROM posts WHERE published = true ORDER BY created_at DESC');
      return res.json(result.rows);
    }
    let rows = Array.from(db.posts.values()).sort((a, b) => b.created_at.localeCompare(a.created_at));
    if (!admin) rows = rows.filter(p => p.published).map(({ content: _c, updated_at: _u, ...rest }) => rest);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    if (db.isReal) {
      const result = await db.query('SELECT * FROM posts WHERE id = $1', [req.params.id]);
      if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
      return res.json(result.rows[0]);
    }
    const post = db.posts.get(Number(req.params.id));
    if (!post) return res.status(404).json({ error: 'Not found' });
    res.json(post);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/posts', requireAdmin, async (req, res) => {
  try {
    const { title, excerpt, content, category, image_url } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title and content required' });
    const slug = makeSlug(title);
    if (db.isReal) {
      const result = await db.query('INSERT INTO posts (title, slug, excerpt, content, category, image_url) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [title, slug, excerpt || '', content, category || 'General', image_url || null]);
      return res.status(201).json(result.rows[0]);
    }
    const id = db.nextPostId();
    const ts = new Date().toISOString();
    const post = { id, title, slug, excerpt: excerpt || '', content, category: category || 'General', image_url: image_url || null, published: false, created_at: ts, updated_at: ts };
    db.posts.set(id, post);
    res.status(201).json(post);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/posts/:id', requireAdmin, async (req, res) => {
  try {
    const { title, excerpt, content, category, image_url } = req.body;
    if (db.isReal) {
      const result = await db.query('UPDATE posts SET title=$1, excerpt=$2, content=$3, category=$4, image_url=$5, updated_at=NOW() WHERE id=$6 RETURNING *', [title, excerpt, content, category, image_url, req.params.id]);
      if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
      return res.json(result.rows[0]);
    }
    const post = db.posts.get(Number(req.params.id));
    if (!post) return res.status(404).json({ error: 'Not found' });
    Object.assign(post, { title, excerpt, content, category, image_url, updated_at: new Date().toISOString() });
    res.json(post);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/posts/:id/publish', requireAdmin, async (req, res) => {
  try {
    const { published } = req.body;
    if (db.isReal) {
      const result = await db.query('UPDATE posts SET published=$1, updated_at=NOW() WHERE id=$2 RETURNING *', [published, req.params.id]);
      if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
      return res.json(result.rows[0]);
    }
    const post = db.posts.get(Number(req.params.id));
    if (!post) return res.status(404).json({ error: 'Not found' });
    post.published = published; post.updated_at = new Date().toISOString();
    res.json(post);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/posts/:id', requireAdmin, async (req, res) => {
  try {
    if (db.isReal) { await db.query('DELETE FROM posts WHERE id = $1', [req.params.id]); return res.json({ success: true }); }
    const id = Number(req.params.id);
    db.posts.delete(id);
    for (const [cid, c] of db.comments) { if (c.post_id === id) db.comments.delete(cid); }
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ===== POST REACTIONS =====

const reactionTypes = new Set(['like', 'love', 'dislike']);

app.get('/api/posts/:id/reactions', async (req, res) => {
  try {
    const postId = Number(req.params.id);
    const { session } = req.query;
    if (db.isReal) {
      const result = await db.query('SELECT type, COUNT(*) FROM post_reactions WHERE post_id=$1 GROUP BY type', [postId]);
      const counts = { like: 0, love: 0, dislike: 0 };
      result.rows.forEach(r => { counts[r.type] = Number(r.count); });
      let mine = null;
      if (session) {
        const mr = await db.query('SELECT type FROM post_reactions WHERE post_id=$1 AND session_id=$2', [postId, session]);
        if (mr.rows.length) mine = mr.rows[0].type;
      }
      return res.json({ ...counts, mine });
    }
    const m = db.postReactions.get(postId) || new Map();
    const counts = { like: 0, love: 0, dislike: 0 };
    for (const t of m.values()) counts[t]++;
    res.json({ ...counts, mine: session ? (m.get(session) || null) : null });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/posts/:id/reactions', postLimiter, async (req, res) => {
  try {
    const postId = Number(req.params.id);
    const { session_id, type } = req.body;
    if (!session_id || !reactionTypes.has(type)) return res.status(400).json({ error: 'Invalid' });
    if (db.isReal) {
      await db.query('INSERT INTO post_reactions (post_id, session_id, type) VALUES ($1,$2,$3) ON CONFLICT (post_id, session_id) DO UPDATE SET type=$3', [postId, session_id, type]);
    } else {
      if (!db.postReactions.has(postId)) db.postReactions.set(postId, new Map());
      db.postReactions.get(postId).set(session_id, type);
    }
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/posts/:id/reactions', async (req, res) => {
  try {
    const postId = Number(req.params.id);
    const { session_id } = req.body;
    if (!session_id) return res.status(400).json({ error: 'Invalid' });
    if (db.isReal) {
      await db.query('DELETE FROM post_reactions WHERE post_id=$1 AND session_id=$2', [postId, session_id]);
    } else {
      db.postReactions.get(postId)?.delete(session_id);
    }
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ===== BLOG COMMENTS =====

app.get('/api/posts/:id/comments', async (req, res) => {
  try {
    const admin = isAdminReq(req);
    const postId = Number(req.params.id);
    if (db.isReal) {
      const result = admin
        ? await db.query('SELECT * FROM post_comments WHERE post_id=$1 ORDER BY created_at ASC', [req.params.id])
        : await db.query('SELECT * FROM post_comments WHERE post_id=$1 AND approved=true ORDER BY created_at ASC', [req.params.id]);
      return res.json(result.rows);
    }
    let rows = Array.from(db.comments.values()).filter(c => c.post_id === postId);
    if (!admin) rows = rows.filter(c => c.approved);
    rows.sort((a, b) => a.created_at.localeCompare(b.created_at));
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/posts/:id/comments', postLimiter, async (req, res) => {
  try {
    const { username, text, parent_id } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'Textul este obligatoriu' });
    if (db.isReal) {
      const result = await db.query('INSERT INTO post_comments (post_id, parent_id, username, text) VALUES ($1,$2,$3,$4) RETURNING *', [req.params.id, parent_id || null, (username || 'Anonim').slice(0, 100), text.slice(0, 2000)]);
      return res.status(201).json(result.rows[0]);
    }
    const id = db.nextCommentId();
    const comment = { id, post_id: Number(req.params.id), parent_id: parent_id || null, username: (username || 'Anonim').slice(0, 100), text: text.slice(0, 2000), approved: false, created_at: new Date().toISOString() };
    db.comments.set(id, comment);
    res.status(201).json(comment);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/posts/:postId/comments/:id/approve', requireAdmin, async (req, res) => {
  try {
    if (db.isReal) {
      const result = await db.query('UPDATE post_comments SET approved=true WHERE id=$1 AND post_id=$2 RETURNING *', [req.params.id, req.params.postId]);
      if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
      return res.json(result.rows[0]);
    }
    const comment = db.comments.get(Number(req.params.id));
    if (!comment || comment.post_id !== Number(req.params.postId)) return res.status(404).json({ error: 'Not found' });
    comment.approved = true;
    res.json(comment);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/posts/:postId/comments/:id', requireAdmin, async (req, res) => {
  try {
    if (db.isReal) { await db.query('DELETE FROM post_comments WHERE id=$1 AND post_id=$2', [req.params.id, req.params.postId]); return res.json({ success: true }); }
    db.comments.delete(Number(req.params.id));
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ===== COMMENT REACTIONS =====

app.get('/api/comments/:id/reactions', async (req, res) => {
  try {
    const commentId = Number(req.params.id);
    const { session } = req.query;
    if (db.isReal) {
      const result = await db.query('SELECT type, COUNT(*) FROM comment_reactions WHERE comment_id=$1 GROUP BY type', [commentId]);
      const counts = { like: 0, love: 0, dislike: 0 };
      result.rows.forEach(r => { counts[r.type] = Number(r.count); });
      let mine = null;
      if (session) {
        const mr = await db.query('SELECT type FROM comment_reactions WHERE comment_id=$1 AND session_id=$2', [commentId, session]);
        if (mr.rows.length) mine = mr.rows[0].type;
      }
      return res.json({ ...counts, mine });
    }
    const m = db.commentReactions.get(commentId) || new Map();
    const counts = { like: 0, love: 0, dislike: 0 };
    for (const t of m.values()) counts[t]++;
    res.json({ ...counts, mine: session ? (m.get(session) || null) : null });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/comments/:id/reactions', postLimiter, async (req, res) => {
  try {
    const commentId = Number(req.params.id);
    const { session_id, type } = req.body;
    if (!session_id || !reactionTypes.has(type)) return res.status(400).json({ error: 'Invalid' });
    if (db.isReal) {
      await db.query('INSERT INTO comment_reactions (comment_id, session_id, type) VALUES ($1,$2,$3) ON CONFLICT (comment_id, session_id) DO UPDATE SET type=$3', [commentId, session_id, type]);
    } else {
      if (!db.commentReactions.has(commentId)) db.commentReactions.set(commentId, new Map());
      db.commentReactions.get(commentId).set(session_id, type);
    }
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/comments/:id/reactions', async (req, res) => {
  try {
    const commentId = Number(req.params.id);
    const { session_id } = req.body;
    if (!session_id) return res.status(400).json({ error: 'Invalid' });
    if (db.isReal) {
      await db.query('DELETE FROM comment_reactions WHERE comment_id=$1 AND session_id=$2', [commentId, session_id]);
    } else {
      db.commentReactions.get(commentId)?.delete(session_id);
    }
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ===== GOOGLE REVIEWS (live, newest-first, via Places API) =====

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACE_QUERY = 'Opris Adrian P.F.A.- reparatii frigidere, Bulevardul Timișoara 53, Sector 6, București';
const REVIEWS_TTL_MS = 6 * 60 * 60 * 1000; // 6h — reviews come in rarely, no need to refresh more often
let cachedPlaceId = process.env.GOOGLE_PLACE_ID || null;
let reviewsCache = null; // { data, fetchedAt }

async function resolvePlaceId() {
  if (cachedPlaceId) return cachedPlaceId;
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName',
    },
    body: JSON.stringify({ textQuery: GOOGLE_PLACE_QUERY, languageCode: 'ro', regionCode: 'RO' }),
  });
  const data = await res.json();
  if (!data.places?.length) throw new Error('Place not found: ' + JSON.stringify(data.error || data));
  cachedPlaceId = data.places[0].id;
  return cachedPlaceId;
}

app.get('/api/google-reviews', async (req, res) => {
  try {
    if (!GOOGLE_PLACES_API_KEY) return res.status(503).json({ error: 'Google Places API key not configured' });
    if (reviewsCache && Date.now() - reviewsCache.fetchedAt < REVIEWS_TTL_MS) return res.json(reviewsCache.data);

    const placeId = await resolvePlaceId();
    const detailsRes = await fetch(`https://places.googleapis.com/v1/places/${placeId}?languageCode=ro&reviewsSort=newest`, {
      headers: {
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'rating,userRatingCount,reviews',
      },
    });
    const details = await detailsRes.json();
    if (details.error) throw new Error('Place Details error: ' + JSON.stringify(details.error));

    const data = {
      rating: details.rating,
      userRatingCount: details.userRatingCount,
      reviews: (details.reviews || []).map(r => ({
        name: r.authorAttribution?.displayName || 'Client Google', rating: r.rating,
        text: r.originalText?.text || r.text?.text || '',
        relativeTime: r.relativePublishTimeDescription, time: r.publishTime,
      })),
    };
    reviewsCache = { data, fetchedAt: Date.now() };
    res.json(data);
  } catch (err) {
    console.error('Google reviews error:', err.message);
    res.status(502).json({ error: 'Failed to fetch reviews' });
  }
});

// ===== HEALTH =====

app.get('/api/health', async (req, res) => {
  if (!db.isReal) return res.json({ status: 'ok', mode: 'in-memory', timestamp: new Date().toISOString() });
  try { await db.query('SELECT 1'); res.json({ status: 'ok', timestamp: new Date().toISOString() }); }
  catch (err) { res.status(503).json({ status: 'db_error', error: err.message }); }
});

// ===== STATIC FILES (production) =====

if (process.env.NODE_ENV === 'production') {
  const buildDir = path.join(__dirname, 'build');
  app.use(express.static(buildDir, {
    index: false, // index.html is served explicitly below, with no-cache headers
    setHeaders: (res, filePath) => {
      // CRA content-hashes filenames under build/static/** — safe to cache forever.
      // Everything else (images, manifest.json, etc.) gets a short cache instead.
      res.setHeader('Cache-Control', filePath.includes(`${path.sep}static${path.sep}`)
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=3600');
    },
  }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) return next();
    // A path with a file extension that express.static didn't already serve is a
    // missing asset (e.g. a stale hashed bundle reference) — 404 it instead of
    // falling back to index.html, which would serve HTML mislabeled as JS/CSS
    // and get rejected by the browser's MIME sniffing instead of failing clearly.
    if (/\.[a-zA-Z0-9]+$/.test(req.path)) return res.status(404).end();
    // Never cache the HTML shell, and skip conditional-request validation (ETag /
    // Last-Modified) entirely — express.static's default ETag is size+mtime, not a
    // content hash, and a stale serverless instance with a matching size can produce
    // a false-positive 304 for genuinely different content. no-store + no validators
    // forces a real fetch every time instead of trusting a conditional match.
    res.set('Cache-Control', 'no-store');
    res.sendFile(path.join(buildDir, 'index.html'), { etag: false, lastModified: false });
  });
}

// ===== START =====

initDB().catch(err => console.error('⚠️  DB init failed:', err.message));

if (require.main === module) {
  const PORT = process.env.PORT || 3003;
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}

module.exports = app;
