import { readMessages, addMessage } from '../backend/service.js';

export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const message = readMessages();
            return res.status(200).json(message || {});

        } else if (req.method === 'POST') {
            const { subject, text } = req.body;
            if (!subject || !text) return res.status(400).json({ error: 'Missing subject or text' });

            addMessage(subject, text); // שולח מייל לכל הרשומים בתוך addMessage
            return res.status(200).json({ message: 'Message updated' });

        } else {
            return res.status(405).json({ message: 'Method Not Allowed' });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
