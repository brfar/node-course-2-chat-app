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
  console.log('New user connected 💡');

  // Everyone is gonna get this message when they connect
  socket.emit('newMessage', {
    from: 'Admin',
    text: 'Welcome to the chat app',
    createdAt: new Date().getTime()
  });

  // This is gonna be sent to everything except this one socket
  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'New user joined',
    createdAt: new Date().getTime()
  });

  // socket.emit('newEmail', {
  //   from: 'mike@example.com',
  //   text: 'hey. what is going on.',
  //   createdAt: 123
  // });

  // socket.emit('newMessage', {
  //   from: 'john',
  //   text: 'yo',
  //   createdAt: 123123
  // });

  socket.on('createMessage', message => {
    console.log('createMessage', message);

    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
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