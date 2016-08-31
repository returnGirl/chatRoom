var socket = io();
$(function () {

	var username = prompt('请输入昵称') || '匿名';
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
		$('#chatArea').append('<div class = "messages"><div class="middle">' + msg + '</div></div>');
		scrollToBottom();
	});

	socket.on('new message', function(msg, user) {
		if (user == username)
			$('#chatArea').append('<div class = "messages"><p class="right">' + '我说: ' + msg + '</p></div>');
		else
			$('#chatArea').append('<div class = "messages"><p class="left">' + user + '说: ' + msg + '</p></div>');
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
	socket.send(message);
	$('.inputMessage').val('');
};
