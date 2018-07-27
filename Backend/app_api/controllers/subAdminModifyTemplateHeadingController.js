var mongoose = require('mongoose');
var subAdminModifyTemplateHeading = require('../models/SubAdminModifyTemplateHeading');
var loggerObj = require('../logger');

var subAdminModifyTemplateHeadingO = function (req, res){
	loggerObj.info('Function Name <enters> %s', 'subAdminModifyTemplateHeadingO');
	subAdminModifyTemplateHeading.findOne({}, function(err, result){
		if(err){
			loggerObj.error('Error while fetching details from database %s', err);
			res.status(500).json(err);
		}else { 
			loggerObj.info('data fetched successfully from database %s', result);
			res.status(200).json(result);
		}
	
	});
	loggerObj.info('Function Name <exit> %s', 'subAdminModifyTemplateHeadingO');
}

module.exports.subAdminModifyTemplateHeadingO = subAdminModifyTemplateHeadingO;


