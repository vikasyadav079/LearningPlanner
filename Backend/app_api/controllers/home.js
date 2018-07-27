var mongoose = require('mongoose');
var User = require('../models/users');
var loggerObj = require('../logger');

module.exports.profileRead = function(req, res) {

  loggerObj.info('Function Name <enters> %s', 'profileRead');
  // If no user ID exists in the JWT return a 401
  if (!req.payload._id) {
      loggerObj.info('profile id not found... ');
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    loggerObj.info('Profile id found ... ');
    // Otherwise continue
    User
      .findById(req.payload._id)
      .exec(function(err, user) {
        loggerObj.info('Returning Users details %s', user);
        res.status(200).json(user);
      });
  }

    loggerObj.info('Function Name <exit> %s', 'profileRead');

};