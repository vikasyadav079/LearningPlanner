var mongoose = require('mongoose');
var tableUserHeading = require('../models/tableUserHeadings');
var loggerObj = require('../logger');

var userHeadings = function (req, res){
	loggerObj.info('Function Name <enters> %s', 'userHeadings');
	tableUserHeading.findOne({}, function(err, result){
		if(err){
			loggerObj.error('Error while fetching data from database %s', err);
			res.status(500).json(err);
		}else { 
			loggerObj.info('Data fetched succesfully from database %s', result);
			res.status(200).json(result);
		}
	
	});
	loggerObj.info('Function Name <exit> %s', 'userHeadings');
}


module.exports.userHeadings = userHeadings;



