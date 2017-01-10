var mongoose = require('mongoose');

mongoose.connect('[mongoDB-database-host]', function(err){
  if(err){
    console.log(err);
  } else {
    console.log('Connected to MongoDB');
  }
});

mongoose.set('debug', true);
