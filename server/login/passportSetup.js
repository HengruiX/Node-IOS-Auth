// Model
var Account = require(__dirname + '/../models/Account');

// Passport JWT Strategy
var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;

var setup = function(opts) {
    passport.use(new JwtStrategy(opts, function(jwt_payload, data, done) {
        Account.findOne({_id: data.id}, function(err, account) {
            if (err) {
                return done(err, false);
            }
            if (account) {
                done(null, account);
            } else {
                done(null, false);
            }
        });
    }));
}

module.exports = setup;