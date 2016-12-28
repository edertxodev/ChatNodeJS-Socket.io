$(function($){

  var socket = io.connect();
  var $nickForm = $('#setNick');
  var $nickError = $('#nickError');
  var $nickBox = $('#nickName');
  var $users = $('#users');
  var $messageForm = $('#send-message');
  var $messageBox = $('#message');
  var $chat = $('#chat');

  $nickForm.submit(function(e){
    e.preventDefault();
    socket.emit('new user', $nickBox.val(), function(data){
      if(data){
        $('#nick').hide();
        $('#content').show();
      } else {
        $nickError.html('That username is already taken. Try again');
      }
    });
    $nickBox.val('');
  });

  socket.on('usernames', function(data){
    var html = "";
    for(var i=0;i<data.length;i++){
      html += data[i] + '<br/>';
    }
    $users.html(html);
  });

  $messageForm.submit(function(e){
    e.preventDefault();
    socket.emit('send message', $messageBox.val(), function(data){
      $chat.append('<span class="error"><b>' + data + '</span></br>');
    });
    $messageBox.val('');
  });

  socket.on('new message', function(data){
    $chat.append('<span class="message"><b>' + data.nick + ': </b>' + data.msg + '</span></br>');
  });

  socket.on('whisper', function(data){
    $chat.append('<span class="whisper"><b>' + data.nick + ': </b>' + data.msg + '</span></br>');
  });

});
