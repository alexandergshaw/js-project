let messages = [];
let nextId = 1;

export default function handler(req, res) {
    if (req.method === 'GET') {
        res.status(200).json(messages.slice(-100));
    } else if (req.method === 'POST') {
        const { username, message } = req.body;
        if (!username || !message) return res.status(400).json({ error: 'Username and message required' });
        const chat = {
            id: nextId++,
            username,
            message,
            timestamp: new Date()
        };
        messages.push(chat);
        res.status(201).json(chat);
    } else if (req.method === 'PUT') {
        const id = parseInt(req.query.id);
        const { message } = req.body;
        const chat = messages.find(m => m.id === id);
        if (!chat) return res.status(404).json({ error: 'Message not found' });
        if (!message) return res.status(400).json({ error: 'Message required' });
        chat.message = message;
        res.status(200).json(chat);
    } else if (req.method === 'DELETE') {
        const id = parseInt(req.query.id);
        const index = messages.findIndex(m => m.id === id);
        if (index === -1) return res.status(404).json({ error: 'Message not found' });
        const [deleted] = messages.splice(index, 1);
        res.status(200).json(deleted);
    } else {
        res.status(405).end();
    }
}