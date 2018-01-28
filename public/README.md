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