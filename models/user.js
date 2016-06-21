var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/auth');
var db = mongoose.connection;

// User Schema
var UserSchema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  username: {
    type: String,
    index: true
  },
  password: {
    type: String,
    required: true,
    bcrypt: true
  }
});

var User = module.exports = mongoose.model('User', UserSchema);


module.exports.comparePassword = function(candPassword, hash, callback){
  bcrypt.compare(candPassword, hash, function(err, isMatch){
    if(err) return callback(err);
    callback(null, isMatch);
  })
};

module.exports.getUserByUsername = function(username, callback){
  var query = {username: username};
  User.findOne(query, callback);
};

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
};

module.exports.createUser = function(newUser, callback){
  bcrypt.hash(newUser.password, 10, function(err, hash){
    if(err) throw err;
    // Set hashed password
    newUser.password = hash;
    newUser.save(callback);
  });
};

