//file used for testing purposes

// if our user.js file is at app/models/user.js
var User = require('./models/users');
  

var chris = new User({
  username: 'sevilayha',
  password: 'password',
	polls: 2
});


chris.dudify(function(err, name) {
  if (err) throw err;

  console.log('Your new name is ' + name);
});

chris.save(function(err) {
  if (err) throw err;

  console.log('User saved successfully!');
});