//file used for testing purposes

// if our user.js file is at app/models/user.js
var User = require('./models/users');
  
// create a new user called chris
var chris = new User({
  username: 'sevilayha',
  password: 'password',
	polls: 2
});

// call the custom method. this will just add -dude to his name
// user will now be Chris-dude
chris.dudify(function(err, name) {
  if (err) throw err;

  console.log('Your new name is ' + name);
});

// call the built-in save method to save to the database
chris.save(function(err) {
  if (err) throw err;

  console.log('User saved successfully!');
});