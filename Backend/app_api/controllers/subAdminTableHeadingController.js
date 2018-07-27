var mongoose = require('mongoose');
var subAdminTableHeading = require('../models/subadmintableheading');
var loggerObj = require('../logger');

var tableheadings = function (req, res){
	loggerObj.info('Function Name <enters> %s', 'tableheadings');
	subAdminTableHeading.findOne({}, function(err, result){
		if(err){
			loggerObj.error('Error while fetching details from database %s', err);
			res.status(500).json(err);
		}else { 
			loggerObj.info('data fetched successfully from database %s', result);
			res.status(200).json(result);
		}
	
	});
	loggerObj.info('Function Name <exit> %s', 'tableheadings');
}

module.exports.tableheadings = tableheadings;


