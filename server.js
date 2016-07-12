var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);  //http server
var io = require('socket.io')(http);  //format that socket-io expects

app.use(express.static(__dirname + '/public'));

//method - on(name_of_event, function to run when the event happens) - listen for events
io.on('connection', function (socket) {
	console.log('User connected via socket.io!');

	socket.on('message', function (message) {
		console.log('Message received: ' + message.text);

		// io.emit --> sends to every single person including the sender
		socket.broadcast.emit('message', message);  // sends to everyone but the sender
	});

	//emit function takes 2 args (event-name, data-to-send)
	//when the user successfully connects to the chat application
	socket.emit('message', {
		text: 'Welcome to the chat application!'
	});
});

http.listen(PORT, function () {
	console.log('Server started!');
});