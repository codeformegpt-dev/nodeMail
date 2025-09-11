import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { sendMail } from './services/mailer.js';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// מסלול קובץ JSON לשמירת הרשומים
const subscribersFile = path.join(process.cwd(), 'data', 'subscribers.json');

// פונקציה לקרוא רשומים
async function readSubscribers() {
  try {
    const data = await fs.readFile(subscribersFile, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// פונקציה לשמור רשומים
async function writeSubscribers(subscribers) {
  await fs.mkdir(path.dirname(subscribersFile), { recursive: true });
  await fs.writeFile(subscribersFile, JSON.stringify(subscribers, null, 2));
}

// API: הוספת רשום חדש
app.post('/api/subscribers', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Missing email' });

  const subscribers = await readSubscribers();
  if (subscribers.some(sub => sub.email === email)) {
    return res.status(409).json({ error: 'Email already exists' });
  }

  subscribers.push({ email, date: new Date().toISOString() });
  await writeSubscribers(subscribers);

  try {
    await sendMail(email, 'תודה על ההרשמה', 'קיבלת גישה לסדרת הסרטונים שלנו');
    res.json({ message: 'Subscriber added and email sent' });
  } catch (err) {
    res.status(500).json({ error: 'Error sending email' });
  }
});

// API: קבלת כל הרשומים
app.get('/api/subscribers', async (req, res) => {
  const subscribers = await readSubscribers();
  res.json(subscribers);
});

// API: מחיקת רשום
app.delete('/api/subscribers/:email', async (req, res) => {
  const { email } = req.params;
  let subscribers = await readSubscribers();
  subscribers = subscribers.filter(sub => sub.email !== email);
  await writeSubscribers(subscribers);
  res.json({ message: 'Subscriber deleted' });
});

// API: עדכון תוכן הודעה אוטומטית (ניתן להרחיב לעתיד)
const messagesFile = path.join(process.cwd(), 'data', 'messages.json');
async function readMessages() {
  try {
    const data = await fs.readFile(messagesFile, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
}
async function writeMessages(messages) {
  await fs.mkdir(path.dirname(messagesFile), { recursive: true });
  await fs.writeFile(messagesFile, JSON.stringify(messages, null, 2));
}

app.get('/api/messages', async (req, res) => {
  const messages = await readMessages();
  res.json(messages);
});

app.post('/api/messages', async (req, res) => {
  const { subject, text } = req.body;
  if (!subject || !text) return res.status(400).json({ error: 'Missing subject or text' });

  const messages = await readMessages();
  messages.latest = { subject, text, date: new Date().toISOString() };
  await writeMessages(messages);

  res.json({ message: 'Message updated' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});