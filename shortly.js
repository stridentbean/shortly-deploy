var express = require('express');
var util = require('./lib/utility');
var partials = require('express-partials');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var db = require('./app/config');
// var Users = require('./app/collections/users');
var User = require('./app/models/user');
// var Links = require('./app/collections/links');
var Link = require('./app/models/link');
var Click = require('./app/models/click');
// var Clicks = require('./app/collections/clicks');
// var Token = require('./app/models/token');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
// Parse JSON (uniform resource locators)
app.use(bodyParser.json());
// Parse forms (signup/login)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(session({
  secret: 'strident bean\'s dire parakeet',
  resave: false,
  saveUninitialized: false
}));

app.use(restrict);

app.get('/login',
function(req, res) {
  res.render('login');
});

app.get('/signup',
function(req,res) {
  res.render('signup');
});

app.post('/signup',
function(req,res) {
  var currentUser = new User({
    username: req.body.username,
    password: req.body.password
  });

  User.findOne({username: req.body.username}).exec(function(err, found) {
    if (found) {
      console.log('user already exists');
      res.redirect('/signup');
    } else {
      console.log('no user by that name exists, creating new user...');
      //currentUser.password = req.body.password;
      currentUser.save(function(err, newUser) {
        req.session.user = newUser;
        req.session.save();
        res.redirect('/');
      });
    }
  });
});

app.post('/login',
function(req,res) {

  var currentUser = new User({
    username: req.body.username
  });

  User.findOne({username: req.body.username}).exec(function(err,found) {

    if (found) {
      console.log('user found');
      found.checkPassword(req.body.password, function(passwordCorrect) {
        if(passwordCorrect) {
          req.session.user = found;
          req.session.save();
          res.redirect('/');
        } else {
          console.log('incorrect password');
          res.redirect('/login');
          // res.render('login');
        }
      });
    } else {
      //console.log('user not found');
      res.redirect('/login');
      // res.render('login');
    }
  });
});

function restrict(req, res, next) {
  if (req.session.user || req.url === '/login' || req.url === '/signup') {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

app.get('/',
function(req, res) {
  res.render('index');
});

app.get('/create',
function(req, res) {
  res.render('index');
});

app.get('/links',
function(req, res) {
  Link.find().exec(function(err,links) {
    res.send(200, links);
  });
});

app.post('/links',
function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.findOne({ url: uri }).exec(function(err, found) {
    if (found) {
      res.send(200, found);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var link = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });

        link.save(function(err, newLink) {
          res.send(200, newLink);
        });
      });
    }
  });
});

/************************************************************/
// Write your authentication routes here
/************************************************************/
app.get('/favicon.ico',
function(req, res) {

});


/************************************************************/
// Handle the wildcard route last - if all other routes fail
// assume the route is a short c=ode and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/*', function(req, res) {
  Link.findOne({ code: req.params[0] }).exec(function(err, link) {
    if (err) {
      res.redirect('/');
    } else {

      var click = new Click({
        link_url: link.url
      });

      click.save(function(err, newClick) {
        Link.findOne({code: link.code}).exec(function(err, foundLink) {
          console.log(link + " :  " + foundLink);
          var targetUrl = foundLink.url;
          foundLink.visits++;
          foundLink.save(function(err,savedLink){
            console.log('Link updated', targetUrl);
            res.redirect(targetUrl);
          });
        });
        // db.knex('urls')
        //   .where('code', '=', link.get('code'))
        //   .update({
        //     visits: link.get('visits') + 1,
        //   }).then(function() {
        //     return res.redirect(link.get('url'));
        //   });
      });
    }
  });
});

//   new Link({ code: req.params[0] }).fetch().then(function(link) {
//     if (!link) {
//       res.redirect('/');
//     } else {
//       var click = new Click({
//         link_id: link.get('id')
//       });

//       click.save().then(function() {
//         db.knex('urls')
//           .where('code', '=', link.get('code'))
//           .update({
//             visits: link.get('visits') + 1,
//           }).then(function() {
//             return res.redirect(link.get('url'));
//           });
//       });
//     }
//   });
// });

module.exports = app;
