var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var Account = new Schema({
    email: { 
        type: String, 
        required: true, 
        lowercase: true, 
        index: { 
            unique: true
        } 
    },
    username: { 
        type: String, 
        required: true, 
        index: { 
            unique: true 
        } 
    },
    password: {
        type: String,
        required: true
    },
    date_created: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Account', Account);