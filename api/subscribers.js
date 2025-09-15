import {
  readSubscribers,
  addSubscriber,
  deleteSubscriber,
} from "../backend/db/subscribers.js";
import { sendMail } from "../backend/services/mailer.js";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const subs = await readSubscribers();
      return res.status(200).json(subs);
    }

    if (req.method === "POST") {
      const { fullname, phone, email } = req.body;
      if (!fullname) return res.status(400).json({ error: "Missing fullname" });
      if (!phone) return res.status(400).json({ error: "Missing phone" });
      if (!email) return res.status(400).json({ error: "Missing email" });

      try {
        // הוספה למסד
        await addSubscriber(fullname, email, phone);

        // שליחת מייל
        const to = email;
        const subject = "הסרטונים שלך";
        const text = "שלום! הנה הקישור לסרטונים שלך...";
        const info = await sendMail(to, subject, text);

        return res.status(200).json({ success: true, info });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }

    if (req.method === "DELETE") {
      const { email } = req.body;
      await deleteSubscriber(email);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
