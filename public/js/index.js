var socket = io();
/** We have access to io() because we loaded the socket.io.js library right above this file! When we call it, we're actually 
 * initiating the request. We're making a request from the client to the server to open up a web socket and keep that 
 * connection open. This "socket" variable is critical to communicating. It's what we need in order to listen for data from 
 * the server and to send data to the server. 
*/

/** The communication between client/server comes in the form of an event. Events can be emitted from either the client or
 * the server and either of them can listen for events. 
   */
socket.on('connect', function () {
  /** It's important NOT to use arrow functions because of browse support! Remember that this runs in the browser!
   * More on the on() method on the README for the server folder. */
  console.log('Connected to server'); // This will be shown on the "Console" tab on the browser's dev tools

  socket.emit('createEmail', {
    to: 'jan@example.com',
    text: 'hey. this is andrew.'
  });
});

socket.on('disconnect', function () {
  /** The "disconnect" event lets you do something on both the server and the client when the connection drops. */
  console.log('Disconnected from server');
});

socket.on('newEmail', function (email) {
  console.log('New email', email);
});