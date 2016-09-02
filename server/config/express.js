var express     = require('express'),
    bodyParser  = require('body-parser'),
    morgan      = require('morgan');

module.exports = function(app, config){
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false}));
  app.use(morgan('dev'));
  app.use(express.static(config.rootPath + '/public'));
}
