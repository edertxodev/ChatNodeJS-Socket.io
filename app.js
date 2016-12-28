var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');

server.listen(3000);

app.use(express.static(path.join(__dirname, 'public')));

io.sockets.on('connection', function(socket){
  socket.on('send message', function(data){
    io.sockets.emit('new message', data);
    socket.broadcast.emit('new message', data);
  });
});
