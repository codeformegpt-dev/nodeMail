import { readSubscribers, addSubscriber, deleteSubscriber } from '../db/subscribers.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const subs = await readSubscribers();
      return res.status(200).json(subs);
    }

    if (req.method === 'POST') {
      const { email } = req.body;
      await addSubscriber(email);
      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      const { email } = req.body;
      await deleteSubscriber(email);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
