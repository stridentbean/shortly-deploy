var db = require('../config');
var Link = require('./link.js');
var mongoose = require('mongoose');

var clickSchema = mongoose.Schema({
  timestamp: Date,
  link_url: String
});

var Click = mongoose.model('Click', clickSchema);

clickSchema.pre('save', function(next){

  this.timestamp = new Date();
  next();
});



// var Click = db.Model.extend({
//   tableName: 'clicks',
//   hasTimestamps: true,
//   link: function() {
//     return this.belongsTo(Link, 'link_id');
//   }
// });

module.exports = Click;
