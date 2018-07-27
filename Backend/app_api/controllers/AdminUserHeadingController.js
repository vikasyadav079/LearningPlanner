var mongoose = require('mongoose');
var adminUserHeading = require('../models/adminUserHeading');
var loggerObj = require('../logger');

var admintableheadings = function (req, res){
	loggerObj.info('Function Name <enter> : %s. ', 'admintableheadings');
	adminUserHeading.findOne({}, function(err, result){
		if(err){
			loggerObj.error('Function Name : %s. Issue while fetching table headings Admin Role %s', admintableheadings, err);
			res.status(500).json(err);
		}else { 
			loggerObj.info('Function Name : %s. Table Headings for Admin role fetched successfully .......Output : %s ', admintableheadings, result);
			res.status(200).json(result);
		}
	
	});
	loggerObj.info('Function Name <exit>: %s. ', 'admintableheadings');
}

module.exports.admintableheadings = admintableheadings;


