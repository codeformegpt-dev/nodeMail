import { addSubscriber, readSubscribers, deleteSubscriber } from '../backend/service';

export default async function handler(req, res) {
    try {
        if (req.method === 'POST') {
            const { email } = req.body;
            if (!email) return res.status(400).json({ error: 'Missing email' });

            await addSubscriber(email);
            // שליחת מייל נשארת ב-service.js (handled automatically)
            return res.status(200).json({ message: 'Subscriber added' });

        } else if (req.method === 'GET') {
            const subscribers = readSubscribers();
            return res.status(200).json(subscribers);

        } else if (req.method === 'DELETE') {
            const { email } = req.query;
            if (!email) return res.status(400).json({ error: 'Missing email' });

            deleteSubscriber(email);
            return res.status(200).json({ message: 'Subscriber deleted' });

        } else {
            return res.status(405).json({ message: 'Method Not Allowed' });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
