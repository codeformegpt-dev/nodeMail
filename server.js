import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// מסלול שמחזיר את הטופס
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// מסלול שמקבל את המייל ושולח תשובה
app.post("/contact", async (req, res) => {
  const email = req.body.email;
  console.log("mail added: ", email);

  try {
    // מגדירים טרנספורטר – כאן זה דרך Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "codeformegpt@gmail.com", // כתובת המייל שלך
        pass: "plnhyagoqawnotsx"      // סיסמת אפליקציה מיוחדת, לא הסיסמה הרגילה
      }
    });

    // שולחים מייל ללקוח
    await transporter.sendMail({
      from: "codeformegpt@gmail.com",
      to: email,
      subject: "תודה על הפנייה שלך",
      text: "קיבלנו את המייל שלך ונחזור אליך בהקדם."
    });

    res.send("המייל נשלח בהצלחה ל: " + email);
  } catch (err) {
    console.error("שגיאה בשליחת המייל:", err);
    res.status(500).send("שגיאה בשליחת המייל");
  }
});

app.listen(3000, () => console.log("השרת רץ על http://localhost:3000"));
