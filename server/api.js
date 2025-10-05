// Simple Express API server to persist JSON submissions to disk (ESM)
import express from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

function appendJson(file, obj) {
  const filePath = path.join(dataDir, file);
  let arr = [];
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    arr = JSON.parse(raw);
    if (!Array.isArray(arr)) arr = [];
  } catch (_) {
    arr = [];
  }
  arr.push({ ...obj, ts: new Date().toISOString() });
  fs.writeFileSync(filePath, JSON.stringify(arr, null, 2));
}

app.post('/api/auth/signup', (req, res) => {
  const { fullName, email, phone } = req.body || {};
  if (!fullName || !email || !phone) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' });
  }
  appendJson('auth_users.json', { fullName, email, phone });
  return res.json({ ok: true });
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ ok: false, error: 'Email required' });
  appendJson('auth_logins.json', { email });
  return res.json({ ok: true });
});

app.post('/api/contact', (req, res) => {
  const payload = req.body || {};
  const required = ['firstName','lastName','email','company','phone','subject','message'];
  for (const k of required) {
    if (!payload[k] || String(payload[k]).trim() === '') {
      return res.status(400).json({ ok: false, error: `Missing field: ${k}` });
    }
  }
  appendJson('contact_messages.json', payload);
  return res.json({ ok: true });
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Static frontend serving (after building with `npm run build`)
const staticDir = path.resolve(__dirname, '../dist');
if (fs.existsSync(staticDir)) {
  app.use(express.static(staticDir));
  // SPA fallback (only for non-API requests)
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(staticDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
