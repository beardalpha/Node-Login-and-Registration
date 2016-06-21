var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

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

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done){
    User.getUserByUsername(username, function(err, user){
      if(err) throw err;
      if(!user){
        console.log("User does not exists in the database");
        return done(null, false, {message:"User does not exists in the database"});
      }
      User.comparePassword(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        } else{
          console.log('Invalid Password');
          return done(null, false, {message: "Invalid password"})
        }
      })
    });
  }
));

router.post('/login', passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: "Invalid username or password"}), function(req, res){
    console.log("Authentication Successful");
    req.flash('success', "You are now logged in");
    res.redirect('/');
});

router.get('/logout', function(req,res){
  req.logout();
  req.flash('success', "You have logged out");
  res.redirect('/users/login');
});

module.exports = router;
