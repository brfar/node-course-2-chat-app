const path = require('path'); // path
const http = require('http'); // socket.io
const express = require('express');
const socketIO = require('socket.io'); // socket.io

const publicPath = path.join(__dirname, '../public'); // path
const port = process.env.PORT || 3000;
const app = express(); // socket.io
var server = http.createServer(app); // socket.io
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log('new user connected');

  socket.emit('newEmail', {
    from: 'mike@example.com',
    text: 'hey. what is going on.',
    createdAt: 123
  });

  socket.emit('newMessage', {
    from: 'john',
    text: 'yo',
    createdAt: 123123
  });

  socket.on('createEmail', newEmail => {
    console.log('createEmail', newEmail);
  });

  socket.on('disconnect', () => {
    // index.js explains that
    console.log('User was disconnected');
  });
});

server.listen(port, () => {
  console.log(`🏄  App is running on port ${port} 🏄`);
});