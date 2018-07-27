var mongoose = require('mongoose');
var crypto = require ('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique: true
  },
  email: {
    type: String,
    require: true
  },
  role: {
    type: String,
    default: "User"
  },
  isActive: {
    type: String,
    default: "True"
  },
  created_at:{
    type: Date
  },
  updated_at:{
    type: Date
  },
  hash: String,
  salt: String
}, {collection : 'userdetails'});

userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password,this.salt,1000,64,'sha512').toString('hex');
}

userSchema.methods.validPassword = function(password){
    var hash = crypto.pbkdf2Sync(password,this.salt,1000,64,'sha512').toString('hex');
    return this.hash===hash;
}

userSchema.methods.generateJwt = function(){
    var expiry = new Date();
    expiry.setTime(expiry.getTime()+(2*60*60*1000));

    return jwt.sign({
        _id: this.id,
        email : this.email,
        username: this.username,
        role: this.role,
        isActive: this.isActive,
        exp : parseInt(expiry.getTime()/1000)
    },"MY_SECRET");
}


userSchema.methods.setUserDate = function(){
  this.updated_at = new Date();
  if (this.created_at == null) {
    this.created_at = Date.now();
  }
}


var user = mongoose.model('user', userSchema);

module.exports = user;