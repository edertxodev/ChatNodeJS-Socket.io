var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');
var nicknames = [];

server.listen(3000);

app.use(express.static(path.join(__dirname, 'public')));

io.sockets.on('connection', function(socket){
  socket.on('new user', function(data, callback){
    if(nicknames.indexOf(data) != -1){
      callback(false);
    } else {
      callback(true);
      socket.nickname = data;
      nicknames.push(socket.nickname);
      updateNickNames();
    }
  });
  socket.on('send message', function(data){
    io.sockets.emit('new message', {msg: data, nick: socket.nickname});
  });
  socket.on('disconnect', function(data){
    if(!socket.nickname) return;
    nicknames.splice(nicknames.indexOf(socket.nickname), 1);
    updateNickNames();
  });
  function updateNickNames(){
    io.sockets.emit('usernames', nicknames);
  }
});
