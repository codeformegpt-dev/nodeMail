import fs from 'fs/promises';
import path from 'path';

const messagesFile = path.join(process.cwd(), 'data', 'messages.json');

async function readMessages() {
  try {
    const data = await fs.readFile(messagesFile, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function writeMessages(messages) {
  await fs.mkdir(path.dirname(messagesFile), { recursive: true });
  await fs.writeFile(messagesFile, JSON.stringify(messages, null, 2));
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const messages = await readMessages();
    return res.status(200).json(messages);

  } else if (req.method === 'POST') {
    const { subject, text } = req.body;
    if (!subject || !text) return res.status(400).json({ error: 'Missing subject or text' });

    const messages = await readMessages();
    messages.latest = { subject, text, date: new Date().toISOString() };
    await writeMessages(messages);

    return res.status(200).json({ message: 'Message updated' });

  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
