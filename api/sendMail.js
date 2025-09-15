import { sendMail } from '../backend/services/mailer.js';
import { addSubscriber } from "../backend/service.js"


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  // // קודם לבדוק אם כבר קיים
  // try {
  //   addSubscriber(email);
  // } catch (err) {
  //   return res.status(400).json({ success: false, message: err.message });
  // }

  const subject = 'הסרטונים שלך';
  const text = 'שלום! הנה הקישור לסרטונים שלך...';

  try {
    const info = await sendMail(email, subject, text);
    res.status(200).json({ success: true, info });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
  }
}

