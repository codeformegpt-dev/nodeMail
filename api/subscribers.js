import fs from 'fs/promises';
import path from 'path';
import { sendMail } from '../services/mailer.js';

const subscribersFile = path.join(process.cwd(), 'data', 'subscribers.json');

async function readSubscribers() {
  try {
    const data = await fs.readFile(subscribersFile, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeSubscribers(subscribers) {
  await fs.mkdir(path.dirname(subscribersFile), { recursive: true });
  await fs.writeFile(subscribersFile, JSON.stringify(subscribers, null, 2));
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Missing email' });

    try {
      const subscribers = await readSubscribers();

      if (subscribers.some(sub => sub.email === email)) {
        return res.status(409).json({ error: 'Email already exists' });
      }

      subscribers.push({ email, date: new Date().toISOString() });
      await writeSubscribers(subscribers);

      try {
        await sendMail(email, 'תודה על ההרשמה', 'קיבלת גישה לסדרת הסרטונים שלנו');
        return res.status(200).json({ message: 'Subscriber added and email sent' });
      } catch (mailErr) {
        console.error(mailErr);
        return res.status(500).json({ error: 'Subscriber added but failed to send email' });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }

  } else if (req.method === 'GET') {
    const subscribers = await readSubscribers();
    return res.status(200).json(subscribers);

  } else if (req.method === 'DELETE') {
    const { email } = req.query;
    let subscribers = await readSubscribers();
    subscribers = subscribers.filter(sub => sub.email !== email);
    await writeSubscribers(subscribers);
    return res.status(200).json({ message: 'Subscriber deleted' });

  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
