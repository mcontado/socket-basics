var PORT = process.env.PORT || 3000;
var moment = require('moment');
var express = require('express');
var app = express();
var http = require('http').Server(app);  //http server
var io = require('socket.io')(http);  //format that socket-io expects

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

// Sends current users to provided socket
function sendCurrentUsers (socket) {
	var info = clientInfo[socket.id];
	var users = [];

	// prevent from searching clientInfo objects for rooms that don't exist
	if (typeof info === 'undefined') {
		return;
	}

	//search thru clientInfo object
	//keys() - it takes an object and returns an array of  all the attributes on that object
	Object.keys(clientInfo).forEach(function (socketId) {
		var userInfo = clientInfo[socketId];

		if (info.room === userInfo.room) {
			users.push(userInfo.name);
		}
	});

	socket.emit('message', {
		name: 'System',
		text: 'Current users: ' + users.join(', '), // join() - takes every element in an array, converts into string and pushes altogether
		timestamp: moment().valueOf() 
	});
}

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

		//checks the value of message if it is equal to current users
		if (message.text === '@currentUsers') {
			sendCurrentUsers(socket);
		} else {
			// io.emit --> sends to every single person including the sender
			//socket.broadcast.emit('message', message);  // sends to everyone but the sender
			message.timestamp = moment().valueOf();
			io.to(clientInfo[socket.id].room).emit('message', message); 
		}

		
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