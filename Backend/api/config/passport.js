var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('../../app_api/models/users');
var mongoose = require('mongoose');


passport.use(new LocalStrategy(
function(username, password,done){
    User.findOne({username: username}, 
        function(err,User){
            if (err){
                return done(err);
            }
            if(!User){
                return done(null, false, {message: 'User not found'});
            }
            if(!User.validPassword(password)){
                return done(null, false, {message: 'Password is wrong '});
            }
            if (User.isActive !== 'True') {
                return done(null, false, {message: 'User is deactive'});
            }

            return done(null,User);
        }
    )
}))

module.exports = passport;