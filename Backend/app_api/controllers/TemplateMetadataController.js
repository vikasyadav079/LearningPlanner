var mongoose = require('mongoose');
var TemplateMetadata = require('../models/TemplateMetadata');
var loggerObj = require('../logger');

module.exports.templateMetadataO  = function (req, res){
	loggerObj.info('Function Name <enters> %s', 'templateMetadataO');
	var templateName = req.query.TemplateName;
	
	loggerObj.info('Input Template Name %s', req.query.TemplateName);

	TemplateMetadata.findOne({TemplateName: templateName}, function(err, result){
		if(err){
			loggerObj.error('Error while getting data from database %s', err);
			res.status(500).json(err);
		}else {
			loggerObj.info('Data fetched successfully from database %s', result); 
			res.status(200).json(result);
		}
	
	});
	loggerObj.info('Function Name <exit> %s', 'templateMetadataO');
}

module.exports.getTemplateByNames = function(req, res) {
	loggerObj.info('Function Name <enters> %s', 'getTemplateByNames');
	TemplateMetadata.find({},'TemplateName', function(err, result) {
		if(err) {
			loggerObj.error('Error while getting data from database %s', err);
			res.status(500).json(err);
		} else {
			loggerObj.info('Data fetched successfully from database %s', result);
			res.status(200).json(result);
		}
	});
	loggerObj.info('Function Name <exit> %s', 'getTemplateByNames');
}

module.exports.tablebody = function ( req, res ) {
	loggerObj.info('Function Name <enters> %s', 'tablebody');
	var username = req.query.UserName;

	loggerObj.info('Input User Name  %s', username);
	
	var query = {$or: [{Owner: { $in: [username]}}, {Creater: username}]};

	
	TemplateMetadata.find(query, function(error, result) {
		if (error ) {
			loggerObj.error('Error while getting data from database %s', error);
			res.status(500).json(error);
		} else {
			loggerObj.info('Data fetched successfully from database %s', result);
			res.status(200).json(result);
		}
	});
	loggerObj.info('Function Name <exit> %s', 'getTemplateByNames');
}

module.exports.savetemplatemetadataO= function (req, res) {

	loggerObj.info('Function Name <enters> %s', 'savetemplatemetadataO');

	var templateName = req.body.TemplateName;
	var programName = req.body.ProgramName;
	var ownerGroup = req.body.OwnerGroup;
	var owner = req.body.Owner
	var creater = req.body.Creater;
	var templateDescription = req.body.TemplateDescription;

	loggerObj.info('Input is  %s', req.body);


	if ( templateDescription.length <= 0 ) {
		templateDescription = 'No Description ';
	}

	templateMetadataO = new TemplateMetadata();

	 templateMetadataO.TemplateName= templateName;
	 templateMetadataO.ProgramName= programName;
	 templateMetadataO.OwnerGroup= ownerGroup;
	 templateMetadataO.Owner= owner;
	 templateMetadataO.Creater= creater; 
	 templateMetadataO.TemplateDescription= templateDescription;
	 templateMetadataO.setUserDate();

	templateMetadataO.save(function (err, result) {
		if (err) {
			loggerObj.error('Error while getting data from database %s', err);
			res.status(500).json(err);
		} else {
			loggerObj.info('Data fetched successfully from database %s', result);
			res.status(200).json(result);
		}
	});

	loggerObj.info('Function Name <exit> %s', 'getTemplateByNames');

};






