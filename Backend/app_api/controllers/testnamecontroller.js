var mongoose = require('mongoose');
var testnamemodelM = require('../models/testnamemodel');
var loggerObj = require('../logger');


var testname = function(req, res) {
	loggerObj.log('Function Name enter testname');
	var testnamemodelO = new testnamemodelM();
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	testnamemodelO.name.push({firstname: firstname, lastname: lastname});
	testnamemodelO.save( function(err, result) {
		if (err) {
			loggerObj.error('Error while fetching details from database %s', err);
			res.status(500).json(err);
		} else {
			loggerObj.log('Data fetched successfully from database. %s', result);
			res.status(200).json(result);
		}
	})
	loggerObj.log('Function Name testname exit');
}



module.exports.testname = testname;