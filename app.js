var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
app.locals.title = '聊天室';
var PORT = 8000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


//socket.io
var server = http.Server(app);
var io = require('socket.io').listen(server);
var roomUser = {};
var roomId = 1;
io.on('connection', function (socket) {

  //获取url, 从而获取房间号
  var url = socket.request.headers.referer;
  var split_arr = url.split('/');
  var roomId = split_arr[split_arr.length - 1] || 'index';
  var user = '';

  socket.on('join', function(username) {
    user = username;
    if (!roomUser[roomId]) {
      roomUser[roomId] = [];
    }
    roomUser[roomId].push(user);
    socket.join(roomId);
    socket.to(roomId).emit('sys', user + '加入房间');
    socket.emit('sys', user + '加入了房间');

  });

  //监听来自客户端的信息
  socket.on('message', function(msg) {

    //验证用户是否在房间内
    if (roomUser[roomId].indexOf(user) < 0) {
      return false;
    }
    socket.to(roomId).emit('new message', msg, user);
    socket.emit('new message', msg, user);

  });

  //关闭
  socket.on('disconnect', function() {
    //从房间名单移除
    socket.leave(roomId, function(err) {
      if (err) {
        console.log(err);
      } else {
        var index = roomUser[roomId].indexOf(user);
        if (index != -1) {
          roomUser[roomId].splice(index, 1);
          socket.to(roomId).emit('sys' + user + '退出了房间');
        }
      }
    });

  });

});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});

if (!module.parent) {
  server.listen(PORT);
  console.log("chatRoom listening on " + PORT);
}

module.exports = app;
