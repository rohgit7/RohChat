const io = require('socket.io')(3000, {
    cors: {
      origin: "*", // Allow requests from any origin
      methods: ["GET", "POST"],
    },
  });
  
  const users = {};
  
  io.on('connection', (socket) => {
    console.log('A user connected');
  
    // Handle new user joining
    socket.on('new-user', (name) => {
      users[socket.id] = name;
      socket.broadcast.emit('user-connected', name);
    });
  
    // Handle chat message
    socket.on('send-chat-message', (message) => {
      socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] });
    });
  
    // Handle user disconnecting
    socket.on('disconnect', () => {
      if (users[socket.id]) {
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
      }
    });
  });
  