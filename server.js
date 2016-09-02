'use strict';
// Dependencies
var express = require('express'),
    mongoose = require('mongoose');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Create express instance
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Middlewares
var config = require('./server/config/config')[env];
require('./server/config/express')(app, config);
require('./server/config/mongoose')(config);

// Create api
var api = require('./server/routes/api')(app, express, io);
// Middleware to the api
app.use('/api', api);

app.all('/api/*', function (req, res) {
  res.send(404);
});

// Any request is going to look for index
app.get('*', function (req, res) {
	res.sendFile(__dirname + '/public/app/index.html');
});

// Run server
http.listen(config.port, function (err) {
	if (err) {
		console.log(err);
	} else {
		console.log('Listening on port ' + config.port);
	}
});
