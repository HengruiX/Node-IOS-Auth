var express = require('express');
var path = require('path');
var config = require(path.join(__dirname, '/config/config.js'));
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var ExtractJwt = require('passport-jwt').ExtractJwt;

var indexRoute = require(__dirname + '/routes/index');
var accountRoute = require(__dirname + '/routes/account');

var passportSetup = require(__dirname + '/login/passportSetup');

var app = express();

// Database connection ----------------------------------------------------
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURL)
  .then(() => console.log('connection succesful'))
  .catch((err) => console.error(err));
// ------------------------------------------------------------------------


// Passport setup ---------------------------------------------------------
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromHeader("token");
opts.secretOrKey = config.tokenSecret;
opts.ignoreExpiration = false;
opts.passReqToCallback = true;
passportSetup(opts);
// ------------------------------------------------------------------------

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

// log client ip address
app.use(function (req, res, next) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('Client IP:', ip);
  next();
});

app.use('/', indexRoute);
app.use('/account', accountRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ msg: err.message });
});

module.exports = app;