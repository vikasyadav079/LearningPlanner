var passport = require('../../api/config/passport');
var mongoose = require('mongoose');
var User = require('../models/users');
var loggerObj = require('../logger');
var templateUserRel = require('../models/TemplateUserRel');


module.exports.register= function(req,res){
    loggerObj.info('Function Name <entered>: %s. Inputs ---><---- Username : %s.. Email: %s .. Password: %s .. Role: %s .. isActive %s ', 'register',
       req.body.username, req.body.email, req.body.password, req.body.role, req.body.isActive );
    var user = new User();
    user.username = req.body.username;
    user.email= req.body.email;
    user.setPassword(req.body.password);
    user.setUserDate();
    if (req.body.role){
        user.role= req.body.role;
    }
    if (req.body.isActive) {
        user.isActive= req.body.isActive;
    }
    user.save(function(err, result){
        if(result){
            loggerObj.info('Output after Table update is %s ',result);
            var token;
            token = user.generateJwt();
            loggerObj.info('Token is %s' , token);
            res.status(200);
            res.json({
                "token":token
            });            
        }else{
            if (err.code === 11000 || err.code === 11001) {
                res.status(401).json(err);
            } else {
                res.status(500).json(err);
            }
            loggerObj.error('Registration Failed %s ', 'register', err);
            
        }
        loggerObj.info('Function name <exit> %s', 'register');
    })
}

module.exports.login= function(req,res){
    loggerObj.info('Functio Name <enter> %s ', 'login');
    passport.authenticate('local', function(err, user, info){
        loggerObj.info('Passport authenticate begins...' );
        var token;
        if(err){
            loggerObj.warn('Passport authentication failed with error %s and response status 400 ',err);
            res.status(404).json(err)
            return;
        }
        if(user){
            loggerObj.info('Login Successfull with User : %s ',user);
            token = user.generateJwt();
            res.json({
                "token":token
            });
        }else {
            loggerObj.warn('Authentication failure %s ', info);
            res.status(401).json(info);
        }
    })(req,res)
    loggerObj.info('Function Name <end> %s ', 'login');
}

module.exports.allUserDetails = function(req, res){
    loggerObj.info('Function Name <enters> allUserDetails');
    User.find({}, 'username email role isActive created_at updated_at', function(err, data){
        if (err){
            loggerObj.error('Error while fetching details from Data base %s', err);
            res.status(500).json(err);
        }else {
            loggerObj.info('Data fetcjed successfully %s', data);
            res.status(200).json(data);
        }
    })
    loggerObj.info('Function name <ends> allUserDetails' );
}

module.exports.getUsers = function( req, res ) {
    loggerObj.info('Function name <enters> getUsers');
    query = {isActive: 'True'}
    User.find(query, 'username ', function(err, result){
        if (err) {
            loggerObj.error('Error while fetching details from database %s' , err);
            res.status(500).json(err);
        } else {
            loggerObj.info('Data fetched successfully from database %s', result);
            res.status(200).json(result);
        }
    })
    loggerObj.info('Function name <exits> getUsers');
}

module.exports.updateUserDetails = function(req, res){
    loggerObj.info('Function name <enters> %s', 'updateUserDetails');
    var id = req.body._id;
    var updatedDetails = {
        'role' : req.body.role,
        'isActive' :req.body.isActive,
        'username' :req.body.username,
        'email' :req.body.email,
        'updated_at' : new Date()
    };
    loggerObj.info('Details to be updated  %s', updatedDetails);

    User.findOneAndUpdate({'_id' : mongoose.Types.ObjectId(id)}, updatedDetails, function(err, data){
        if (err){
            loggerObj.error('Error while updating details at backend %s', err);
            res.status(500).json(err);
        }else {
            loggerObj.info('Data saved successfully at backend %s', data);
            res.status(200).json({'_id' : id});
        }
    })
    loggerObj.info('Function name <exit> %s', 'updateUserDetails');
};