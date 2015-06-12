var db = require('../config');
// var Click = require('./click');
var crypto = require('crypto');
// var User = require('./user');
// var UserLinkJoin = require('./userLinkJoin');

var mongoose = require('mongoose');

var linkSchema = mongoose.Schema({
  url: {type: String, index: {unique: true}},
  base_url: String,
  code: String,
  title: String,
  visits: Number
});

var Link = mongoose.model('Link', linkSchema);

linkSchema.pre('save', function(next){
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  if (this.visits === undefined) {
    this.visits = 0;
  }
  next();
});


// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   clicks: function() {
//     return this.hasMany(Click);
//   },
//   users: function() {
//     return this.belongsToMany(User).through(UserLinkJoin);
//   },
//   initialize: function(){
//     this.on('creating', function(model, attrs, options){
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });

module.exports = Link;
