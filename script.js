const socket = io('http://localhost:3000');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

// Prompt user for their name
const name = prompt('What is your name?') || 'Anonymous';
appendMessage('You joined', 'system');
socket.emit('new-user', name);

// Listen for chat messages
socket.on('chat-message', (data) => {
  appendMessage(`${data.name}: ${data.message}`, 'other');
});

// Listen for user connections
socket.on('user-connected', (name) => {
  appendMessage(`${name} connected`, 'system');
});

// Listen for user disconnections
socket.on('user-disconnected', (name) => {
  appendMessage(`${name} disconnected`, 'system');
});

// Handle sending messages
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message) {
    appendMessage(`You: ${message}`, 'self');
    socket.emit('send-chat-message', message);
    messageInput.value = '';
  }
});

// Append messages to the chat container
function appendMessage(message, type = 'other') {
  const messageWrapper = document.createElement('div');
  messageWrapper.classList.add('message-container');

  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageElement.classList.add('message', type);
  messageWrapper.appendChild(messageElement);

  messageContainer.append(messageWrapper);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}
