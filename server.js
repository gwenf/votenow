var express = require('express');
var app = express();
var router = express.Router();
var bcrypt = require('bcryptjs');
var csrf = require('csurf');
var bodyParser = require('body-parser');
var sessions = require('client-sessions');//mozilla library for cookies, etc...

var fs = require('fs');

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

app.get('/polls', function(req,res){
	mongoose.model('poll').find(function(err, polls){
			res.send(polls);
		}
	)
});

//load all files in the models directory
fs.readdirSync(__dirname + '/models').forEach(function(filename){
	if(~filename.indexOf('.js')) require(__dirname + '/models/' + filename)
})

//app.use(express.static(path.resolve(__dirname, 'client')));

//middleware - allows access to the body of the http request
app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

app.use(sessions({
	cookieName: 'session',
	secret: 'sjfiej8u382hjfj89jfwieds21jksd',
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
	httpOnly: true //doesn't let the brower's javascript access cookies ever!
}));

//routing for static files//
app.use(express.static(__dirname + '/client'));


//GLOBAL MIDDLEWARE
//all middleware functions take in these threee arguments
app.use(function(req, res, next){
	if(req.session && req.session.user){ //if session info exists
		User.findOne({ email: req.session.user.email }, function(err, user){  //query mongoDB
			if(user){
				req.user = user;
				delete req.user.password;
				req.session.user = req.user;
				res.locals.user = req.user;
			}
			next(); //tells express to finish processing middleware and run our function (load userPage)
		});
	} else {
		next();
	}
});

app.use(csrf());

function requireLogin(req, res, next){
	if(!req.user){
		res.redirect('/login'); //cannot go dirctly to userPage without being logged in
	} else {
		next(); //let the request come through
	}
}

app.get('/', function (req, res) {
  res.render('index', {});
});

app.get('/register', function(req, res){
	res.render('register', { csrfToken: req.csrfToken()}); //creates csrf token and passes it to template
});

//app.post('/register', function(req, res){
//	res.json(req.body);
//});
//function to register new users and called in routing to the userPage
var createUserSession = function(req, res, user) {
	var cleanUser = {
		firstName:  user.firstName,
		lastName:   user.lastName,
		email:      user.email,
		data:       user.data || {},
	};

	req.session.user = cleanUser;
	req.user = cleanUser;
	res.locals.user = cleanUser;
};

//post handler for register.jade -- registers new users
app.post('/register', function(req, res){
	var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

	var user = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: hash
		});
	user.save(function(err){
		if(err){
			var error = 'something bad happened :(';
			if(err===11000){
				error='That email is already taken. Please try another one.';
			}
			res.render('register', {error: error});
			console.error(error);
		} else {
			//if user registration (.save function) works they should be directed to their user page
			console.log('Saved... Redirecting to Dashboard!!');
			createUserSession(req, res, user);
			res.redirect('userPage');
		}
		
	});
});

app.get('/login', function(req, res){
	res.render('login', { csrfToken: req.csrfToken()});
});

app.post('/login', function(req, res){
	User.findOne({ email: req.body.email }, function(err,user){
		if (!user){
			res.render('login', {error: 'Invalid email or password.'});
			console.error(err);
		} else {
			if (bcrypt.compareSync(req.body.password, user.password)){ //req.body.password === user.password using bcrypt
				req.session.user = user; //set-cookie: session=...
				res.redirect('userPage');
			} else {
				res.render('login', {error: 'Invalid email or password.'});
			}
		}
	});
});

app.post('/createPoll', function(req, res){
	var poll = new Poll({
		question: req.body.question,
		choices: req.body.choices
	});
});

//userPage is only accessible to users who are logged in
app.get('/userPage', requireLogin, function(req, res){
	res.render('userPage');
});

app.get('/polls', function(req, res){
	res.render('polls');
});

app.get('/createPoll', function(req, res){
	res.render('createPoll');
});

app.get('/settings', function(req, res){
	res.render('settings');
});

app.get('/logout', function(req, res){
	req.session.reset();
	res.redirect('/');
});

app.listen(3000, function(){
	console.log('listening on port 3000');
});