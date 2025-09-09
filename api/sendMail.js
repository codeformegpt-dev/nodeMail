import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }

  try {
    // הגדרת טרנספורטר Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "codeformegpt@gmail.com",  // המייל שלך
        pass: "plnhyagoqawnotsx"        // סיסמת אפליקציה
      }
    });

    await transporter.sendMail({
      from: "codeformegpt@gmail.com",
      to: email,
      subject: "תודה על הפנייה שלך",
      text: "הנה הקישור לאתר: https://readdy.link/preview/e852898e-2322-4f90-9583-2473e004832c/2178168"
    });

    res.status(200).json({ message: "המייל נשלח בהצלחה ל: " + email });
  } catch (err) {
    console.error("שגיאה בשליחת המייל:", err);
    res.status(500).json({ error: "שגיאה בשליחת המייל" });
  }
}
