import { readSubscribers, addSubscriber, deleteSubscriber } from '../backend/db/subscribers.js';
import { sendMail } from '../backend/services/mailer.js';


export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const subs = await readSubscribers();
      return res.status(200).json(subs);
    }

    if (req.method === 'ADD') {
      const { email } = req.body;
      await addSubscriber(email);
      return res.status(200).json({ success: true });
    }

    if (req.method === 'POST') {
      req.method = 'ADD';
      handler(req, res);

       const { email } = req.body; 
    const to      = email;           
    const subject = 'הסרטונים שלך';
    const text    = 'שלום! הנה הקישור לסרטונים שלך...';

    try {
      const info = await sendMail(to, subject, text);
      res.status(200).json({ success: true, info });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
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
