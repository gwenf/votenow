var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var sessions = require('client-sessions');//mozilla library for cookies, etc...

var path = require('path');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var User = mongoose.model('user', new Schema({
	id: ObjectId,
	firstName: String,
	lastName: String,
	email: {type: String, unique: true},
	password: String
}));

//database
mongoose.connect('mongodb://localhost/votenow');

app.set('view engine', 'jade');
app.set('views', path.resolve(__dirname,'client','views'));
app.locals.pretty = true;

//app.use(express.static(path.resolve(__dirname, 'client')));

//middleware - allows access to the body of the http request
app.use(bodyParser.urlencoded({extended: true}));

app.use(sessions({
	cookieName: 'session',
	secret: 'sjfiej8u382hjfj89jfwieds21jksd',
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000
}));

app.get('/', function (req, res) {
  res.render('index', {});
});

app.get('/register', function(req, res){
	res.render('register');
});

//app.post('/register', function(req, res){
//	res.json(req.body);
//});

//post handler for register.jade
app.post('/register', function(req, res){
	var user = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: req.body.password
		});
	user.save(function(err){
		if(err){
			var error = 'something bad happened :(';
			if(err===11000){
				error='That email is already taken. Please try another one.';
			}
			res.render('register', {error: error});
		} else {
			//if user registration (.save function) works they should be directed to their user page
			res.redirect('userPage');
		}
		
	});
});

app.get('/login', function(req, res){
	res.render('login');
});

app.post('/login', function(req, res){
	User.findOne({ email: req.body.email }, function(err,user){
		if (!user){
			res.render('login', {error: 'Invalid email or password.'});
		} else {
			if (req.body.password === user.password){
				req.session.user = user; //set-cookie: session=...
				res.redirect('userPage');
			} else {
				res.render('login', {error: 'Invalid email or password.'});
			}
		}
	});
});

app.get('/userPage', function(req, res){
	if (req.session && req.session.user){
		User.findOne({ email: req.session.user.email }, function(err, user){
			if (!user){
		console.log('problem found');
				req.session.reset();
				res.redirect('/login');
			} else {
				res.locals.user = user; //to access in templates
				res.render('userPage');
			}
		});
	} else {
			res.redirect('login');
	}
});

app.get('/logout', function(req, res){
	req.session.reset();
	res.redirect('/');
});

app.listen(3000, function(){
	console.log('listening on port 3000');
});