var express = require('express');
var router = express.Router();

var User = require('../models/user')

/* GET users listing. */
router.get('/register', function(req,res,next){
  res.render('register', {
	'title': 'Register'
  });
});

router.get('/login', function(req,res,next){
res.render('login', {
	'title': 'Login'
  });
});

router.post('/register', function(req,res,next){
  // Get form values
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var confirmPassword = req.body.confirmPassword;

  // Validation
  req.checkBody('name', 'Name field cannot be empty').notEmpty();
  req.checkBody('email', 'Email field cannot be empty').notEmpty();
  req.checkBody('email', 'Not a valid email').isEmail();
  req.checkBody('username', 'Username field cannot be empty').notEmpty();
  req.checkBody('password', 'Password field cannot be empty').notEmpty();
  req.checkBody('confirmPassword', 'Confirm password field cannot be empty').notEmpty();
  req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);

  // Check for errors
  var errors = req.validationErrors();

  if(errors){
    res.render('register', {
      errors: errors,
      name: name,
      email: email,
      username: username,
      password: password
    });
  } else {
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password
    });

    User.createUser(newUser, function(err, user){
      if(err) throw err;
      console.log(user);
    });

    // Success Message
    req.flash('success', 'You are now registered');

    // Redirect to home page
    res.location('/');
    res.redirect('/');
  }

});
module.exports = router;
