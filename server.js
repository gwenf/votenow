var express = require('express');
var app = express();

var path = require('path');

app.set('view engine', 'jade');
app.set('views', path.resolve(__dirname,'client','views'));

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!'});
});