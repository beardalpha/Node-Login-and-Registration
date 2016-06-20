var express = require('express');
var router = express.Router();

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
  var password = req.body.passwword;
  var confirmPassword = req.body.confirmPassword;

  // Validation
  req.checkBody('name', 'Field cannot be empty').notEmpty();
  req.checkBody('email', 'Field cannot be empty').notEmpty();
  req.checkBody('email', 'Not a valid email').isEmail();
  req.checkBody('username', 'Field cannot be empty').notEmpty();
  req.checkBody('password', 'Field cannot be empty').notEmpty();
  req.checkBody('confirmPassword', 'Field cannot be empty').notEmpty();
  req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);

  // Check for errors
  var errors = req.validationErrors();

  if(errors){
    res.render('register'), {
      errors: errors,
      name: name,
      email: email,
      username: username,
      password: password
    }
  }
  
});
module.exports = router;
