var path = require('path');
var jwt = require('jsonwebtoken');
var config = require(path.join(__dirname, '..', '/config/config.js'));
var Account = require(path.join(__dirname, '..', '/models/Account'));

var service = {}

service.registerAccount = async (req, res) => {

    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    Account.findOne().or(
        [{username: username}, {email: email}]
    ).exec(function(err, account) {
        if (err) {
            console.log(err.message);
            return res.status(500).json({msg: "Register failed"});
        }
        if (account) {
            return res.status(400).json({msg: "Username or email already exists"})
        }

        Account.create({
            username: username,
            password: password,
            email: email
        }, function(err, account) {
            if (err) {
                console.log(err.message);
                res.status(400).json({msg: "Account cannot be created"});
            } else {
                res.json({ msg: "Account registered" });
            }
        });
    });

}

service.loginAccount = async (req, res) => {
    if(req.body.username && req.body.password){
        var username = req.body.username;
        var password = req.body.password;
    

        Account.findOne({
            username:username
        }, function(err, account) {
            if (err) {
                console.log(err.message);
                return res.status(401).json({msg: "Login failed"});
            }

            if (!account) {
                return res.status(401).json({msg: "Account not found"});
            }

            if (account.password === password) {
                var payload = {id: account.id};
                var token = jwt.sign(payload, config.tokenSecret);
                res.json({msg: "Login successfully", token: token});
            } else {
                res.status(401).json({msg:"Incorrect password"});
            }
        });
    } else {
        res.status(400).json({msg: "Must specify username and password to login"});
    }
}

module.exports = service;