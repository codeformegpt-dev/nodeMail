import { readMessages, addMessage } from '../backend/db/messages.js';
import { readSubscribers } from '../backend/db/subscribers.js';
import { sendMail } from '../backend/services/mailer.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const message = await readMessages();
      return res.status(200).json(message || {});
    }

    if (req.method === 'POST') {
      const { subject, text } = req.body;
      if (!subject || !text) return res.status(400).json({ error: 'Missing subject or text' });

      // 1️⃣ שמירה במסד
      await addMessage(subject, text);

      // 2️⃣ שליחת מייל לכל המנויים
      const subscribers = await readSubscribers();
      await Promise.all(
        subscribers.map(sub => sendMail(sub.email, subject, text))
      );

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
