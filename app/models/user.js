var db = require('../config');
// var Link = require('./link');
// var Token = require('./token');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
// var UserLinkJoin = require('./userLinkJoin');
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: {type: String, index: {unique: true}},
  password: String,
  salt: String
});

var User = mongoose.model('User', userSchema);

User.prototype.checkPassword = function(userInputPassword, next) {
  console.log('checking password');
  var context = this;
  bcrypt.hash(userInputPassword, context.salt, null, function (err, hash) {
    console.log("!!" + hash, context.password, hash === context.password);
    next(hash === context.password);
  });

};

// UserSchema.methods.checkPassword = function(password, callback) {

//   var context = this;
// };


userSchema.pre('save', function(next){
  // var cipher = Promise.promisify(bycrypt.hash);
  console.log('salting ', this);
  var context = this;
  bcrypt.genSalt(10, function(err, salt) {
    context.salt = salt;
    console.log('hashing');
    bcrypt.hash(context.password, salt, null, function(err,hash) {
      console.log("salt: " + salt + "password: " + context.password);
      console.log("Saving hashed password as: " + hash);
      context.password = hash;
      next();
    });
  });
});


// UserSchema.methods.salt = function (password, callback) {
//   console.log('salt start');

//   bcrypt.genSalt(10, function(err, salt) {
//     this.model('User').set('salt', salt);
//     console.log('salting');
//     bcrypt.hash(this.password, salt, null, function(err,hash) {
//       console.log('hashing');
//       this.password = (hash);
//       next();
//     });
//   });
// };







// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   links: function() {
//     return this.belongToMany(Link).through(UserLinkJoin);
//   },
//   token: function() {
//     return this.hasOne(Token);
//   },
//   initialize: function() {
//     this.on('creating', function(model, attrs, options) {
//     });
//   },
//   salt: function (password, callback) {
//     console.log('salt start');
//     var context = this;
//     bcrypt.genSalt(10, function(err, salt) {
//       context.set('salt',salt);
//       console.log('salting');
//       bcrypt.hash(password, salt, null, function(err,hash) {
//         console.log('hashing');
//         context.set('password', hash);
//         callback();
//       });
//     });
//   },
//   checkPassword: function(password, callback) {
//     console.log('checking password');

//     var context = this;
//     bcrypt.hash(password, context.get('salt'), null, function (err, hash) {
//       callback(hash === context.get('password'));
//     });
//   }
// });

module.exports = User;
