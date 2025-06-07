const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory message store
let messages = [];
let nextId = 1;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Define a simple route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API to get messages (Read)
app.get('/api/messages', (req, res) => {
    res.json(messages.slice(-100));
});

// API to create a message (Create)
app.post('/api/messages', (req, res) => {
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
});

// API to update a message (Update)
app.put('/api/messages/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { message } = req.body;
    const chat = messages.find(m => m.id === id);
    if (!chat) return res.status(404).json({ error: 'Message not found' });
    if (!message) return res.status(400).json({ error: 'Message required' });
    chat.message = message;
    res.json(chat);
});

// API to delete a message (Delete)
app.delete('/api/messages/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = messages.findIndex(m => m.id === id);
    if (index === -1) return res.status(404).json({ error: 'Message not found' });
    const [deleted] = messages.splice(index, 1);
    res.json(deleted);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});