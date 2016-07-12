var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);  //http server
var io = require('socket.io')(http);  //format that socket-io expects

app.use(express.static(__dirname + '/public'));

//method - on(name_of_event, function to run when the event happens) - listen for events
io.on('connection', function () {
	console.log('User connected via socket.io!');
});

http.listen(PORT, function () {
	console.log('Server started!');
});