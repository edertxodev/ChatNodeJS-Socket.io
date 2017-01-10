var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');
var bodyParser = require('body-parser');

/**
 * Connect to DataBase
 */
require('./app/db.js');

/**
 * Get the model of Messages
 */
var Chat = require('./app/models/Message');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'files')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Socket.io chat
 */
io.sockets.on('connection', function(socket){
   Chat.find({}, function(err, docs){
     if(err) throw err;
     socket.emit('load old msgs', docs);
   });
   socket.on('new user', function(data, callback){
     if(data in users){
       callback(false);
     } else {
       callback(true);
       socket.nickname = data;
       users[socket.nickname] = socket;
       updateNickNames();
     }
   });
   socket.on('send message', function(data, callback){
     var msg = data.trim();
     if(msg.substr(0,3) === '/w '){
       msg = msg.substr(3);
       var index = msg.indexOf(' ');
       if(index != -1){
         var name = msg.substr(0, index);
         var msg = msg.substring(index + 1);
         if(name in users){
           users[name].emit('whisper', {msg: msg, nick: socket.nickname})
         } else {
           callback('Error! Enter a valid user');
         }
       } else {
         callback('Error! Please enter a message for your user');
       }
     } else {
       var newMsg = new Chat({msg: msg, nick: socket.nickname});
       newMsg.save(function(err){
         if(err) throw err;
         io.sockets.emit('new message', {msg: msg, nick: socket.nickname});
       });
     }
   });
   socket.on('disconnect', function(data){
     if(!socket.nickname) return;
     delete users[socket.nickname];
     updateNickNames();
   });
   function updateNickNames(){
     io.sockets.emit('usernames', Object.keys(users));
   }
 });

/**
 * API REST
 */

 /**
  * Get required files
  */
app.get('/js/chat.js', function(req, res){
  res.sendFile(__dirname + '/files/chat.js');
})

  /**
   * Get all messages (INSECURE - Deleted)
   */

  /**
   * Get all messages from user
   */
  app.get('/api/get-messages/:userid', function(req, res){
    Chat.find({userid: req.params.userid}, function(err, messages){
      if(err){
        res.send(err.errors);
      }
      res.json(messages);
    });
  });

  /**
   * Create new message
   */
  app.post('/api/new-message', function(req, res){
      var newMsg = new Chat();
      newMsg.msg = req.body.msg;
      newMsg.userid = req.body.userid;

      if((newMsg.msg != null) || (newMsg.userid != null)){
        newMsg.save(function(err){
          if(err){
            res.send(err);
          }
          res.json({message: 'Message created!'});
        });
      } else {
        res.json({message: 'The message cannot be created. You must specify the message content and the userid'});
      }
  });

  /**
    * Load test page
    */
  app.get('/test', function(req, res){
    res.sendFile(__dirname + '/public/test.html');
  });

server.listen(process.env.PORT || 3000);
