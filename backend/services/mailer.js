import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// יצירת transporter יחיד לשימוש חוזר
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * שליחת מייל
 * @param {string} to - כתובת יעד
 * @param {string} subject - נושא המייל
 * @param {string} text - תוכן המייל (טקסט בלבד)
 * @returns {Promise} - מבטיח סיום שליחה או שגיאה
 */
export async function sendMail(to, subject, text) {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        });
        return info;
    } catch (error) {
        console.error('שגיאה בשליחת המייל:', error);
        throw error;
    }
}
