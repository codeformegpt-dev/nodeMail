import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { sendMail } from './mailer.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// SQLite DB
const db = new Database('data/subscribers.db');

// יצירת טבלאות אם לא קיימות
db.prepare(`
  CREATE TABLE IF NOT EXISTS subscribers (
    email TEXT PRIMARY KEY,
    date TEXT
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT,
    text TEXT,
    date TEXT
  )
`).run();

// פונקציות DB
function readSubscribers() {
  return db.prepare('SELECT * FROM subscribers').all();
}

function addSubscriber(email) {
  const existing = db.prepare('SELECT COUNT(*) AS count FROM subscribers WHERE email = ?').get(email);
  if (existing.count > 0) throw new Error('Email already exists');
  db.prepare('INSERT INTO subscribers (email, date) VALUES (?, ?)').run(email, new Date().toISOString());
}

function deleteSubscriber(email) {
  db.prepare('DELETE FROM subscribers WHERE email = ?').run(email);
}

function readMessages() {
  const row = db.prepare('SELECT * FROM messages ORDER BY id DESC LIMIT 1').get();
  return row || {};
}

function addMessage(subject, text) {
  db.prepare('INSERT INTO messages (subject, text, date) VALUES (?, ?, ?)').run(subject, text, new Date().toISOString());
}

// API Endpoints
app.get('/api/subscribers', (req, res) => {
  try {
    res.json(readSubscribers());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/subscribers', (req, res) => {
  try {
    const { email } = req.body;
    addSubscriber(email);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/subscribers/:email', (req, res) => {
  try {
    deleteSubscriber(req.params.email);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/messages', (req, res) => {
  try {
    res.json(readMessages());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/messages', (req, res) => {
  try {
    const { subject, text } = req.body;
    addMessage(subject, text);

    // שליחת מייל לכל הרשומים
    const subscribers = readSubscribers();
    subscribers.forEach(sub => sendMail(sub.email, subject, text));

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
