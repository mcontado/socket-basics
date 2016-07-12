var PORT = process.env.PORT || 3000;
var moment = require('moment');
var express = require('express');
var app = express();
var http = require('http').Server(app);  //http server
var io = require('socket.io')(http);  //format that socket-io expects

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

//method - on(name_of_event, function to run when the event happens) - listen for events
io.on('connection', function (socket) {
	console.log('User connected via socket.io!');

	socket.on('disconnect', function () {
		var userData = clientInfo[socket.id];

		if (typeof userData !== 'undefined') {
			socket.leave(userData.room);

			//emit the message to the room that the user has left
			io.to(userData.room).emit('message', {
				name: 'System',
				text: userData.name + ' has left!',
				timestamp: moment().valueOf()
			});

			//deletes an attribute to an object
			delete clientInfo[socket.id];
		}
	});

	socket.on('joinRoom', function (req) {
		clientInfo[socket.id] = req;

		//join - built in method that tells the socket io library to add this socket to a specific room
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: req.name + ' has joined!',
			timestamp: moment().valueOf()
		})
	});

	socket.on('message', function (message) {
		console.log('Message received: ' + message.text);

		// io.emit --> sends to every single person including the sender
		//socket.broadcast.emit('message', message);  // sends to everyone but the sender
		message.timestamp = moment().valueOf();
		io.to(clientInfo[socket.id].room).emit('message', message); 
	});

	//emit function takes 2 args (event-name, data-to-send)
	//when the user successfully connects to the chat application
	socket.emit('message', {
		name: 'System',
		text: 'Welcome to the chat application!',
		timestamp: moment().valueOf()
	});
});

http.listen(PORT, function () {
	console.log('Server started!');
});