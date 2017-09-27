var path = require('path');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var accountService = require(path.join(__dirname, '..', '/login/accountService'));

router.post('/register', accountService.registerAccount);

router.post("/login", accountService.loginAccount);

router.get("/apitest", passport.authenticate('jwt', { session: false }), function(req, res){
  res.json("Success! You can not see this without a token");
});

module.exports = router;