var mongoose = require('mongoose');

mongoose.connect('mongodb://edertxodw:abc123@ds145868.mlab.com:45868/chat-nodejs', function(err){
  if(err){
    console.log(err);
  } else {
    console.log('Connected to MongoDB');
  }
});

mongoose.set('debug', true);
