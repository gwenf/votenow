var express = require('express');
var app = express();

var path = require('path');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/votedb');

app.set('view engine', 'jade');
app.set('views', path.resolve(__dirname,'client','views'));

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!'});
});