The "public" folder is gonna store our style, our HTML files and our client-side JavaScript.

When we load our web page we're not doing anything. We're not connecting to the server and we are going to need to manually run some JavaScript code to initiate that connection process. 
When we integrated Socket.io with our server, we got access to some things, such as this JavaScript library that makes it really easy to work with Socket.io on the client:
```
localhost:3000/socket.io/socket.io.js
```

It's just a long JavaScript library that contains all the code we're gonna need on the client to make the connection and to transfer data. In order to make the connection from our HTML file is to load this library in:

```html
<script src="/socket.io/socket.io.js"></script>
```

***

We have access to `io()` because we loaded the `socket.io.js` library on the HTML file. When we call it, we're actually initiating the request. We're making a request from the client to the server to open up a web socket and keep that connection open. This "socket" variable is critical to communicating. It's what we need in order to listen for data from the server and to send data to the server:

```javascript
var socket = io();
```

***

The communication between client/server comes in the form of an event. Events can be emitted from either the client or the server and either of them can listen for events. 

It's important **not** to use arrow functions because of browse support! Remember that this runs in the browser! More on the `on()` method on the README for the server folder. 

```javascript
socket.on('connect', function () {
  console.log('Connected to server'); // This will be shown on the "Console" tab on the browser's dev tools

  socket.emit('createEmail', {
    to: 'jan@example.com',
    text: 'hey. this is andrew.'
  });
});
```

We're calling `socket.emit` here because we created a custom event listener on the server, so this is necessary. We're calling it here inside the 'connect' callback function because we don't wanna emit the event until we are connected. The data we're gonna send on this emit, is the object on the second argument.

***

The "disconnect" event lets you do something on both the server and the client when the connection drops:

```javascript
socket.on('disconnect', function () {
  console.log('Disconnected from server');
});
```

***

This is a custom event, so instead of using one of the built-in events, we're using `'newEmail'` which was created by us.
Having the listener for `'newEmail'` we need to "emit" this event over inside of `server.js` <br>
On the "emit" method on server, whatever we passed as second argument, is gonna get stored in the `email` variable on this
callback function:

```javascript
socket.on('newEmail', function (email) {
  console.log('New email', email);
});
```

This is gonna print inside the web developer console every time the client hears this event coming across the pipeline. 

*** 


