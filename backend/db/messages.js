import pool from './connection.js';

export async function readMessages() {
  const res = await pool.query('SELECT * FROM messages ORDER BY id DESC LIMIT 1');
  return res.rows[0] || {};
}

export async function addMessage(subject, text) {
  await pool.query('INSERT INTO messages (subject, text, date) VALUES ($1, $2, $3)',
    [subject, text, new Date().toISOString()]);
}
