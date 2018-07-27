var mongoose = require('mongoose');
var loggerObj = require('../logger');
var templateUserRel = require('../models/TemplateUserRel');
var templateContents = require('../models/TemplateContents');
var TemplateMetadata = require('../models/TemplateMetadata');


module.exports.deleteTemplateData = function ( req, res) {
	var templateName = req.query.TemplateName;
	loggerObj.info('Function Name <enter> %s', 'templateUserRelO');
	
	loggerObj.info('Input Params are %s', req.query);

	templateUserRel.remove({TemplateName: templateName},  function(err, result){
		if(err){
			loggerObj.error('Error while deleting details from table: %s with error %s', err);
			res.status(500).json(err);
		}else {
			loggerObj.info('Data fetched successfull from table %s with result %s', result);
			TemplateMetadata.remove({TemplateName: templateName},  function(err, result){
				if(err){
					loggerObj.error('Error while deleting details from table: %s with error %s', 'templatemetadata', err);
					res.status(500).json(err);
				}else {
					loggerObj.info('Data fetched successfull from table %s with result %s', 'templateContents', result);
					templateContents.remove({TemplateName: templateName},  function(err, result){
						if(err){
							loggerObj.error('Error while deleting details from table: %s with error %s', err);
							res.status(500).json(err);
						}else {
							loggerObj.info('Data fetched successfull from table %s with result %s', 'templateuserrel', result);
							res.status(200).json({Success : 'successfully deleted template'});							
						}
					
					});
				}
			
			});
		}
	
	});

	loggerObj.info('Function Name <exit> %s', 'templateUserRelO');
}