document.addEventListener('DOMContentLoaded', () => {
    const messagesList = document.getElementById('messages');
    const form = document.getElementById('chat-form');
    const usernameInput = document.getElementById('username');
    const messageInput = document.getElementById('message');

    // Load previous messages
    function fetchMessages() {
        fetch('/api/messages')
            .then(res => res.json())
            .then(messages => {
                messagesList.innerHTML = '';
                messages.forEach(msg => addMessage(msg));
            });
    }

    // Add message to UI
    function addMessage(msg) {
        const li = document.createElement('li');
        li.className = "mb-2";
        const time = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : '';
        li.innerHTML = `
            <div class="d-flex align-items-center justify-content-between bg-light rounded p-2 shadow-sm">
                <div>
                    <span class="badge bg-secondary me-2">${time}</span>
                    <b class="text-primary">${msg.username}</b>:
                    <span class="msg-text">${msg.message}</span>
                </div>
                <div>
                    <button class="btn btn-sm btn-outline-warning me-1 edit-btn">Edit</button>
                    <button class="btn btn-sm btn-outline-danger delete-btn">Delete</button>
                </div>
            </div>
        `;

        // Edit button
        li.querySelector('.edit-btn').onclick = () => {
            const newMsg = prompt('Edit your message:', msg.message);
            if (newMsg && newMsg !== msg.message) {
                fetch(`/api/messages?id=${msg.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: newMsg })
                }).then(fetchMessages);
            }
        };

        // Delete button
        li.querySelector('.delete-btn').onclick = () => {
            if (confirm('Delete this message?')) {
                fetch(`/api/messages?id=${msg.id}`, { method: 'DELETE' })
                    .then(fetchMessages);
            }
        };

        messagesList.appendChild(li);
        messagesList.scrollTop = messagesList.scrollHeight;
    }

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value.trim();
        const message = messageInput.value.trim();
        if (!username || !message) return;
        fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, message })
        }).then(fetchMessages);
        messageInput.value = '';
    });

    // Initial fetch
    fetchMessages();

    // Optionally, poll for new messages every few seconds
    setInterval(fetchMessages, 3000);
});