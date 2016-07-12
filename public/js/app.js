var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');
var socket = io();

console.log(name + ' wants to join ' + room);

socket.on('connect', function () {
	console.log('Connected to socket.io server!');
});

//fired everytime new message comes in
socket.on('message', function (message) {
	var momentTimeStamp = moment.utc(message.timestamp);
	var $message = jQuery('.messages');


	console.log('New messsage: ');
	console.log(message.text);


	$message.append('<p> <strong>' + message.name + ' ' + momentTimeStamp.local().format('h:mm a') + '</strong> </p>');
	$message.append('<p>' + message.text + '</p>');
	//jQuery('.messages').append('<p><strong>' + momentTimeStamp.local().format('h:mm a') + ': ' + ' </strong>' + message.text + '</p>');
});

// Handles submitting of new message 
var $form = jQuery('#message-form');

//submit event for submitting the form
$form.on('submit', function (event) {
	//preventDefault -  is used on form when you dont want to submit the old fashion way by refreshing entire page
	event.preventDefault();

	var $message = $form.find('input[name=message]');

	socket.emit('message', {
		name: name,
		text: $message.val()
	});

	$message.val('');
	
});