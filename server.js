const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

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
        pass: "plnhyagoqawnotsx"  // סיסמת אפליקציה מיוחדת
      }
    });

    // שולחים מייל ללקוח
    await transporter.sendMail({
      from: "codeformegpt@gmail.com",
      to: email,
      subject: "תודה על הפנייה שלך",
      text: "הנה הקישור לצפייה באתר שלנו: https://readdy.link/preview/e852898e-2322-4f90-9583-2473e004832c/2178168"
    });

    res.send("המייל נשלח בהצלחה ל: " + email);
  } catch (err) {
    console.error("שגיאה בשליחת המייל:", err);
    res.status(500).send("שגיאה בשליחת המייל");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`השרת רץ על http://localhost:${PORT}`));
