server.js is gonna store all of our Node.js code
***

Path
===

This is how we used to serve the "public" directory:

```javascript
console.log(__dirname + '/../public'); // -> /Users/Bruno/Desktop/node-chat-app/server/../public
```

It's unnecessary to go into "server" just to get out of it and *then* go into the public folder. We'd like to just go from the project folder right into the "public". In order to do that, we're gonna use the [Path](https://nodejs.org/api/path.html#path_path_join_paths) module that comes with Node:

```javascript
const path = require('path');

const publicPath = path.join(__dirname, '../public');
```

`.join()` takes your partial path and it joins them together. We're passing `__dirname` as first argument, and as the second argument we're specifying the relative path.

```javascript
console.log(publicPath); // -> /Users/Bruno/Desktop/node-chat-app/public
```
***
Configure our Express static middleware. This is gonna serve up the "public" folder:

```javascript
app.use(express.static(publicPath));
```


package.json
===

"start" tells Heroku how to start the application. <br>
"engine" tells Heroku which version of Node to use:
```json
  "scripts": {
    "start": "node server/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
    "engines": {
    "node": "8.9.1"
  }
```

Socket.io
===

Socket.io makes it dead simple to set up a server that supports web sockets and to create a front end that communicates with the server. Socket.io has a back end and front end library.

We need to integrate Socket.io into our existing web server. Currently we use Express to make our web server. We create a new a Express app, we configure our middleware and we call `app.listen`. Behind the scenes, Express is using a built-in Node module called "http" to create the server. We're gonna need to use "http" ourselves, configure Express to work with "http" *then* we'll be able to add a Socket.io support:

```javascript
const http = require('http'); 
const socketIO = require('socket.io'); 

const app = express();
var server = http.createServer(app);
var io = socketIO(server);

server.listen(3000);
```

First we loaded the "http" module, then on the `server` variable we created a server using the "http" library. The `createSever` was used all along behind the scenes; when we call `app.listen()` on our Express app, it literally calls this exact same method. <br>
`createServer` takes a function. This function looks really similar to one of the Express callbacks, with the `req` and `res` jazz and all. "http" is used behind the scenes for Express. They're integrated so much so that you can provide the `app` variable as the argument!

Now we're using the "http" server instead of the Express server. So instead of calling `app.listen`, we're gonna call `server.listen`.

The `io` variable is used to configure the server to also use Socket.io by passing it (the `server` var) as argument to `socketIO`.

With the `io` variable we can do anything we want in terms of emitting or listening to events. This is how we're gonna communicate between the server and the client.

***

```javascript
io.on('connection', socket => {
  console.log('new user connected');

  socket.emit('newEmail', {
    from: 'mike@example.com',
    text: 'hey. what is going on.',
    createdAt: 123
  });

  socket.on('createEmail', (newEmail) => {
    console.log('createEmail', newEmail);
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});
```

`io.on()` lets you register and event listener. We can listen for a specific event and do something when that event happens. The most popular event is `connection`. This let's you listen for a new connection, meaning that a client connected to the server, and it lets you do something when that connection comes in. In order to do something, you provide a callback function as the second argument and this callback function is gonna get called with a `socket`. This `socket` argument is similar to the socket argument we have access to over index.js. This represents the individual socket, as opposed to all of the users connected to the server. 

Web sockets are a persistent technology, meaning the client and server both keep the communication channel open for as long as both of them want to. If the server shuts down, the client doesn't really have a choice. And the same for the client-server relationship. If I close the browser tab, the server cannot force me to keep the connection open. When a connection drops, the client still gonna try to reconnect. When we restart the server using `nodemon` there's about 1/4 of a second of time where the server is down and the client notices that. It tries to reconnect and eventually it reconnects. On the client we can also do something when we successfully connect to the server. 

The `io.on()` method is a very special event. Usually you will not be attaching anything to it. You're not gonna make calls to `io.on()` or `io.emit()` than the one we already have on server.js

***

The `emit` method can be used on both the client and the server to emit events. `emit` is really similar to the listeners, although instead of listening to an event, we are *creating* the event:

```javascript
socket.emit('newEmail', {
  from: 'mike@example.com',
  text: 'hey. what is going on.',
  createdAt: 123
});
```

The first argument is the name of the event you wanna emit. In this case we have to match it exactly as we specified over index.js and since this is not a listener, we're not gonna provide a callback. By default we don't have to specify anything as a second argument. Maybe we just wanna emit new e-mail without anything letting the browser know that something happened. <br>
If you wanna send data, all you have to do is provide a second argument to emit. Usually an object is send, so you can specify anything you like. In this case we're specifying who the emails from, a text and a createdAt property. This data is gonna get sent along with the newEmail event from the server to the client.

***

"createEmail" is a custom event listener, so we need a listener. We probably gonna expect some data, the email to create, so we can name the variable `newEmail` in the callback function. Here we're just gonna log the email to make sure the event is properly going from client to server. Remember that we need to emit the event on the client.

```javascript 
socket.on('createEmail', newEmail => {
  console.log('createEmail', newEmail);
});
```

***

Currently, all we do is log the data to the screen. Instead of just logging it, we want to emit a new event to everybody. So every single connected user gets the message that was sent from a specific user. In order to do that, we're gonna use the method below:

```javascript
io.emit('newMessage', {
  from: message.from,
  text: message.text,
  createdAt: new Date().getTime()
});
```

`socket.emit` emits an event to a single connection, `io.emit` emits an event to every single connection. Here we're emitting the event `newMessage` in the first argument and in the second argument is the data you wanna send. We're getting a `from` and `text` properties from the client on index.js so we just need to pass them along 

If we go to the dev tools and run for eg `socket.emit('createMessage, {from: 'Andrew', text: 'This should work!'});` this event is gonna be emit from the browser, it's gonna go to the server, which is going to send the message to every connected user, including the user who sent the message. 

***

Some events you wanna send to everybody, but other events should only go to other people. So if user1 emits an event, it shouldn't go back to user1. It should only go to user2, user3 etc. In order to get that done we're gonna look at a different way to emit events in the server. 

```javascript
socket.broadcast.emit('newMessage', {
  from: 'Admin',
  text: 'New user joined',
  createdAt: new Date().getTime()
});
```
To broadcast a message we have to specify the individual socket. This lets the Socket.io library know which user shouldn't get the event. The code above is gonna send the event to everybody but this socket. 

***

### Event Acknowledgements

We're gonna add a acknowledgment for `createMessage`. If the client emits a valid request, we're gonna acknowledge that sending back no error message. If the data sent form client to server is invalid, we're gonna acknowledge it, sending back the errors so the client knows exactly what to do to send a valid request.

Setting up acknowledgments isn't bad if you already have a listener in place. All you gotta do is make a quick change to the listener and the emitter and everything will work:

```javascript
// on the client
socket.emit('createMessage', {
  from: 'Frank ',
  text: 'Hi'
}, function (data) {
  console.log('got it', data); // -> got it This is from the server
});
```

The third argument, the callback function, is gonna fire when the acknowledgment arrives at the client and we can do anything we like. Here we're just printing "got it".

On the server, we're gonna add a second argument to the callback called `callback` and we can call it anywhere to acknowledge that we got the request:

```javascript
// on the server
socket.on('createMessage', (message, callback) => {
  console.log('createMessage', message);
  io.emit('newMessage', generateMessage(message.from, message.text));
  callback('This is from the server');
});
```

When we call `callback()` it's gonna send an event back to the front end and it's gonna call the function on the first example. 

***

### Geolocation

The geolocation API is available in the client-side JavaSciprt and it's very well supported. 

```javascript
socket.on('createLocationMessage', (coords) => {
  io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
});
////// message.js
var generateLocationMessage = (from, latitude, longitude) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt: new Date().getTime()
  };
};
```

Here we listen to the event created on index.js for `createLocationMessage` we can have access to properties like latitute and longitude because they're available on the emitted event com *index.js*. 