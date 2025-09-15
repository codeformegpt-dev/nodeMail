import pool from './connection.js';

export async function readSubscribers() {
  const res = await pool.query('SELECT * FROM subscribers');
  return res.rows;
}

export async function addSubscriber(fullname, email, phone) {
  const existing = await pool.query('SELECT COUNT(*) AS count FROM subscribers WHERE email=$1', [email]);
  if (existing.rows[0].count > 0) throw new Error('Email already exists');
  await pool.query('INSERT INTO subscribers (fullname, email, phone, date) VALUES ($1, $2, $3, $4)', [email, new Date().toISOString()]);
}

export async function deleteSubscriber(email) {
  await pool.query('DELETE FROM subscribers WHERE email=$1', [email]);
}
