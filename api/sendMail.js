import { sendMail } from '../backend/services/mailer.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body; // מקבל מהטופס
    const to = email;           // מגדיר את to
    const subject = 'הסרטונים שלך';
    const text = 'שלום! הנה הקישור לסרטונים שלך...';


    try {
      const info = await sendMail(to, subject, text);
      res.status(200).json({ success: true, info });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
