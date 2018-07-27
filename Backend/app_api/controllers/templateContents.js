var mongoose = require('mongoose');
var loggerObj = require('../logger');
var templateContents = require('../models/TemplateContents');

var templateContentsbasedOnTopic = function (req, res) {
	loggerObj.info('Function name <enters> %s ', 'templateContentsbasedOnTopic');
	var templateName = req.body.TemplateName;
	var areaName = req.body.AreaName;
	var topicHeading = req.body.TopicHeading;
	var categoryName = req.body.CategoryName;

	loggerObj.info('Input details %s', req.body);

	var query = {TemplateName : templateName, 'TemplateDetails.CategoryName': categoryName, 'TemplateDetails.CategoryDetails.AreaName': areaName, 'TemplateDetails.CategoryDetails.AreaDetails.TopicHeading': topicHeading};

	templateContents.findOne(query, 'TemplateName TemplateDetails.CategoryName TemplateDetails.CategoryDetails.AreaName TemplateDetails.CategoryDetails.AreaDetails' , function(err, result) {
		if (err) {
			loggerObj.error('Error while fetching details from backend %s', err);
			res.status(500).json(err);
		}else {
			loggerObj.info('Details fetched successfully from database %s ', result);
			var filteredResult = result.TemplateDetails.filter(r => r.CategoryName ===  categoryName);
			loggerObj.info('filtered details %s ', filteredResult);
			res.status(200).json(filteredResult);
		}

	});
	loggerObj.info('Function name <exit> %s ', 'templateContentsbasedOnTopic');
}

var templateSaveContentsO = function( req, res ) {
	loggerObj.info('Function name <enters> %s ', 'templateSaveContentsO');
	var templateContentsO = new templateContents();
	templateContentsO.TemplateName = req.body.TemplateName;
	templateContentsO.TemplateDetails = new Array();

	loggerObj.info('Input TemplateName %s ', req.body.TemplateName);
	loggerObj.info('Input Template Details %s', req.body.TemplateDetails);


	
	for (var i = 0; i < req.body.TemplateDetails.length ; i++ ) {
		const categoryDetailsA = new Array();
		for ( var j = 0; j < req.body.TemplateDetails[i].categoryDetails.length ; j++ ) {
			const areaDetailsA = new Array();
			for ( var k = 0 ; k < req.body.TemplateDetails[i].categoryDetails[j].areaDetails.length ; k++ ) {
				const areaDetailsO = {
					TopicHeading: req.body.TemplateDetails[i].categoryDetails[j].areaDetails[k].topicHeading,
					TopicDescription: req.body.TemplateDetails[i].categoryDetails[j].areaDetails[k].topicDescription,
					Mentor: req.body.TemplateDetails[i].categoryDetails[j].areaDetails[k].mentor,
					DocLocation : req.body.TemplateDetails[i].categoryDetails[j].areaDetails[k].docLocation
				};
				areaDetailsA.push(areaDetailsO);				
			}
			categoryDetailsA.push({AreaName: req.body.TemplateDetails[i].categoryDetails[j].areaName, AreaDetails: areaDetailsA });
		}
		templateContentsO.TemplateDetails.push({CategoryName: req.body.TemplateDetails[i].categoryName, CategoryDetails: categoryDetailsA});
	}

	loggerObj.info('Template Contents Object %s', templateContentsO);

	templateContentsO.save(function(err, result) {
		if (err) {
			loggerObj.error('Error while fetching details from database %s', err);
			res.status(500).json(err);
		} else {
			loggerObj.info('Data fetched successfully from database %s', result);
			res.status(200).json(result);
		}
	}) ; 
	loggerObj.info('Function name <exit> %s ', 'templateSaveContentsO');
}

var getTemplateDetailsbyName = function (req, res) {
	loggerObj.info('Function name <enters> %s ', 'getTemplateDetailsbyName');
	var templateName = req.query.TemplateName;
	var query = {TemplateName: templateName};

	loggerObj.info('Input Template Name is %s', req.query.TemplateName);

	templateContents.findOne(query, function(err, result) {
		if(err) {
			loggerObj.error('Error while fetching details from backend %s', err);
			res.status(500).json(err);
		} else {
			loggerObj.info('Data fetched successfully from database %s', result);
			res.status(200).json(result);
		}
	});
	loggerObj.info('Function name <exit> %s ', 'getTemplateDetailsbyName');

}


var submitAssignedTemplateO = function (req, res ) {
	loggerObj.info('Function name <enters> %s ', 'submitAssignedTemplateO');
	var templateName = req.query.TemplateName;
	var query = {TemplateName: templateName};

	loggerObj.info('Input Template Name is %s', req.query.TemplateName);

	templateContents.findOne(query, 'TemplateDetails.CategoryDetails.AreaDetails.TopicHeading', function(err, result) {
		if (err ){
			loggerObj.error('Error while fetching data from database %s', err);
			res.status(500).json(err);
		} else {
			loggerObj.info('Data fetched successfully from database %s', result);
			res.status(200).json(result);
		}
	});
	loggerObj.info('Function name <exit> %s ', 'submitAssignedTemplateO');

}

module.exports.submitAssignedTemplateO = submitAssignedTemplateO;
module.exports.getTemplateDetailsbyName = getTemplateDetailsbyName;
module.exports.templateSaveContentsO = templateSaveContentsO;
module.exports.templateContentsbasedOnTopic = templateContentsbasedOnTopic;



