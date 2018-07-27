var mongoose = require('mongoose');
var subAdminTableBody = require('../models/subadmintablebody');
var loggerObj = require ('../logger');

module.exports.tablebody = function (req, res){
	loggerObj.info('Function Name <enters> %s', 'tablebody');

	subAdminTableBody.find({}, function(err, result){
		if(err){
			loggerObj.error('Error while fetching data from database %s', err);
			res.status(500).json(err);
		}else { 
			loggerObj.info('Data fetched successfully from backend %s', result);
			res.status(200).json(result);
		}
	
	});
	loggerObj.info('Function Name <exit> %s', 'tablebody');
}

module.exports.tablebodybyname = function (req, res){
	loggerObj.info('Function Name <enters> %s', 'tablebodybyname');
	var templatename = req.query.templatename;
	loggerObj.info('Template Name is %s', templatename);
	subAdminTableBody.find({name : templatename}, function(err, result){
		if(err){
			loggerObj.error('Error from database %s', err);
			res.status(500).json(err);
		}else { 
			loggerObj.info('Data fetched successfully from database %s', result);
			res.status(200).json(result);
		}
	
	});
	loggerObj.info('Function Name <exit> %s', 'tablebodybyname');
}



