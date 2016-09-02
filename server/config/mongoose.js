var mongoose = require('mongoose');

module.exports = function(config){
var options = { server: { socketOptions: { keepAlive: 120, connectTimeoutMS: 30000 } }};    
  mongoose.connect(config.db, options);
  var MongoDB = mongoose.connection;
  MongoDB.on('error', function(err) { console.log(err.message); });
  MongoDB.once('open', function() {
    console.log("mongodb connection open");
  });
}
