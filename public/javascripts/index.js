var socket = io();
$(function () {

	var username = prompt('请输入昵称');
	$('.myname').html(username);
	var input = $('.inputMessage');

	function scrollToBottom () {
		$('#chatArea').scrollTop($('#chatArea')[0].scrollHeight);
	};

	socket.on('connect', function() {
		var name = $('.myname').text() || '匿名';
		socket.emit('join', name);
	});

	socket.on('sys', function(msg) {
		$('.messages').append('<p>' + msg + '</p>');
		scrollToBottom();
	});

	socket.on('new message', function(msg, user) {
		$('.messages').append('<p>' + user + '说: ' + msg + '</p>');
		scrollToBottom();
	});
	input.on('keydown', function(e) {
		if (e.which === 13) {
			buttonClick();
		}
	});

});

function buttonClick() {
	var message = $('.inputMessage').val();
	if (!message) {
		return;
	}
	console.log(message);
	socket.send(message);
	$('.inputMessage').val('');
};
