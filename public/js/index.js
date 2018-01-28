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
  /** We're calling .emit here beucase we created a custom event listener on the server, so this is necessary. 
   * We're calling it here inside the 'connect' callback function because we don't wanna emit the event until
   * we are connected. The data we're gonna send on this emit, is the object on the second argument.
   */
});

socket.on('disconnect', function () {
  /** The "disconnect" event lets you do something on both the server and the client when the connection drops. */
  console.log('Disconnected from server');
});

socket.on('newEmail', function (email) {
  /** This is a custom event, so instead of using one of the built-in events, we're using "newEmail" which was created by us.
   * Having the listener for "newEmail" we need to "emit" this event over inside of server.js
   * On the "emit" method on server, whatever we passed as second argument, is gonna get stored in the "email" variable on the
   * callback function. 
   */
  console.log('New email', email);
  /** This is gonna print inside the web developer console every time the client hears this event coming across the pipeline.  */
});

socket.on('newMessage', function (message) {
  console.log('got new message', message);
});