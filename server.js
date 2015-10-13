var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require("body-parser");

var path = require('path');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/votedb');

app.set('view engine', 'jade');
app.set('views', path.resolve(__dirname,'client','views'));

app.use(express.static(path.resolve(__dirname, 'client')));

//app.use(bodyParser.urlencoded({extended: true}));
//app.use(bodyParser.json());
//app.get("/api/v1",require("./routes/api"));

router.get('/', function (req, res) {
  res.render('index');
});

app.listen(3000, function(){
	console.log('listening on port 3000');
});