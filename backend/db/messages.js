import pool from './pool.js'; // חיבור למסד PostgreSQL

export async function addMessage(subject, text) {
  await pool.query(
    'INSERT INTO messages (subject, text, date) VALUES ($1, $2, $3)',
    [subject, text, new Date().toISOString()]
  );
}

export async function readMessages() {
  const { rows } = await pool.query(
    'SELECT * FROM messages ORDER BY id DESC LIMIT 1'
  );
  return rows[0] || {};
}
