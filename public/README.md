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

### jQuery

`jQuery` takes as argument whatever it is you wanna select, here is `#message-form` and then we add a event listener by calling `.on()` passing the event name `submit` and a function:

```javascript
jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function () {

  });
});
```

The function is gonna fire when a user tries to submit the form. Unlike the Socket.io event listeners, this function gets one argument `e` and we are gonna need to access this in order to override the default behavior that when you click the submit button, html by default refreshes the page. `e.preventDefault()` does exactly that. 

After that, we're emitting the 'createMessage' event, where the `text` property is jQuery selecting the "name=message" input (check HTML) and using `.val` to get its value. The empty callblack function is responsible for the acknowledgment. 

***

Here we're using jQuery differently: instead of using it to select something, we're creating something (the `<li>` tags) storing it to a variable so we modify (add li's) later. We're using the `.text()` method to set the text property. Then we select that element `#messages` we just created, then we call `.append` to render it to the DOM:

```javascript
socket.on('newMessage', function (message) {
  console.log('newMessage', message);
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  jQuery('#messages').append(li);
});
```

***

### Geolocation

```javascript
var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  navigator.geolocation.getCurrentPosition(function (position) {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    alert('Unable to fetch location.');
  });
});
```

First `locationButton` is gonna store the selector using jQuery. We're gonna be using it a few times, so storing it in a variable saves the need to keep making the same call again. <br>
Then we're adding a click event. We wanna do something when that button gets clicked. The `if` statement checks whether or not the browser supports geolocation. <br>
`.getCurrentPosition` is what actually fetches a user's position. It's a fuction that starts the process. It's going to actively get the coordinates for the user. This method takes 2 functions: the sucess function and the failure function. 
The `position` variable passed as argument to the callback function is object that holds properties about the user location like the coordinates and timestamp. 
The we emit a brand new event, `createLocationMessage` which takes the latitude and longitude that accessible from the `position` object. Now that we have everything we can go ahead and listen for this event over in server.js

***
Add an event listener for `newLocationMessage`:

```javascript
socket.on('newLocationMessage', function (message) {
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current location</a>');

  li.text(`${message.from}: `);
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
});
```
`newLocationMessage` is the event we wanna listen. What happens in the callback function is the DOM elements we wanna spit out to the users. 
zzz