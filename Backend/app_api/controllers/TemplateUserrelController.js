var mongoose = require('mongoose');
var templateUserRel = require('../models/TemplateUserRel');
var loggerObj = require('../logger');

var templateUserRelO = function (req, res){
	var templateName = req.body.TemplateName;
	var assignee = req.body.AssigneeName;
	var topicName = req.body.TopicName;
	var areaName = req.body.AreaName;
	var categoryName = req.body.CategoryName;

	loggerObj.info('Function Name <enter> %s', 'templateUserRelO');
	
	loggerObj.info('Input Params are %s', req.body);

	templateUserRel.findOne({"Details.CategoryName": categoryName, TemplateName : templateName, "Details.AreaName": areaName, "Details.TopicName" : topicName },  function(err, result){
		if(err){
			loggerObj.error('Error while fetching details from database %s', err);
			res.status(500).json(err);
		}else {
			loggerObj.info('Data fetched successfull from database %s', result);
			var filteredResult = result.Details.filter(o => o.CategoryName === categoryName && o.AreaName === areaName && o.TopicName === topicName); 
			loggerObj.info('Filtered Result is %s ', filteredResult);
			res.status(200).json(filteredResult);
		}
	
	});

	loggerObj.info('Function Name <exit> %s', 'templateUserRelO');
}


var templateUserRelUpdateHistory = function (req, res) {
	loggerObj.info('Function Name <enter> %s', 'templateUserRelUpdateHistory');
	var assignee = req.body.AssigneeName;
	var templateName = req.body.TemplateName;
	var categoryName = req.body.CategoryName;
	var areaName = req.body.AreaName;
	var topicName = req.body.TopicName;
	var HistoryUpdates = {
		seqno: req.body.HistoryUpdates.seqno,
		submitter: req.body.HistoryUpdates.submitter,
		SubmittedDate: req.body.HistoryUpdates.SubmittedDate,
		Notes: req.body.HistoryUpdates.Notes
	};

	loggerObj.info('Input Params are %s', req.body);

	// var test1 = {CategoryName : "Account Specific Traning1", AreaName : "Account Overview1", TopicName : "Customer SLAs1", Status : "Progress1", History : [{ seqno : 2,submitter : "Vikas Yadav1", SubmittedDate : "2018-07-02", Notes : "Vikas Accounts Structure and Org Structure"}]};

	query = {"Details.CategoryName": categoryName, TemplateName : templateName, "Details.AreaName": areaName, "Details.TopicName" : topicName, AssigneeName: assignee };
	update = {$push: {'Details.$.History': HistoryUpdates}};
	options = {new: true};

	templateUserRel.findOneAndUpdate (query, update, options, function(err, result) {
		if (err ) {
			loggerObj.error('Error while fetching details from database %s', err);
			res.status(500).json(err);
		} else {
			loggerObj.info('Data fetched successfull from database %s', result);
			res.status(200).json(result);
		}
	});

	loggerObj.info('Function Name <exit> %s', 'templateUserRelUpdateHistory');
}


var submitAssignedTemplate = function(req, res) {
	loggerObj.info('Function Name <enter> %s', 'submitAssignedTemplate');

	var templateUserRelO = new templateUserRel();
	var recordToBeSaved = req.body.templateToBeSaved;

	templateUserRel.find({TemplateName: recordToBeSaved.TemplateName}, 'AssigneeName', function(err, result) {
		if	( result.filter(r => r.AssigneeName === recordToBeSaved.AssigneeName).length > 0 ) {
			res.status(200).json(result);
		} else {
				templateUserRelO.AssigneeName = recordToBeSaved.AssigneeName;
				templateUserRelO.TemplateName = recordToBeSaved.TemplateName;
				templateUserRelO.JoiningDate = recordToBeSaved.JoiningDate;
				templateUserRelO.Details = new Array();

				loggerObj.info('Input Params are %s', req.body.templateToBeSaved);

				for (var i=0 ; i< recordToBeSaved.Details.length ; i++){
					var areaName = recordToBeSaved.Details[i].AreaName;
					var categoryName = recordToBeSaved.Details[i].CategoryName;
					var status = recordToBeSaved.Details[i].Status;
					var topicName = recordToBeSaved.Details[i].TopicName;
					var dueDate = recordToBeSaved.Details[i].DueDate;

					var AreaSchema = {
						AreaName: areaName,
						CategoryName: categoryName,
						Status: status,
						TopicName: topicName,
						History: [],
						DueDate: dueDate
					}
					templateUserRelO.Details.push(AreaSchema);
				}

				templateUserRelO.save(function(error,result) {
					if ( error ) {
						loggerObj.error('Error while fetching details from database %s', error);
						res.status(500).json(error);
					} else {
						loggerObj.info('Data fetched successfull from database %s', result);
						res.status(200).json(result);
					}
				});

		}
	});

 

	loggerObj.info('Function Name <exit> %s', 'submitAssignedTemplate');

}

var templateUserRelByNameO = function (req, res){
	loggerObj.info('Function Name <enter> %s', 'templateUserRelByNameO');
	var templateName = req.query.TemplateName;

	loggerObj.info('Input Template Name is %s ', templateName)

	templateUserRel.findOne({TemplateName : templateName}, function(err, result){
		if(err){
			loggerObj.error('Error while fetching details from database %s', err);
			res.status(500).json(err);
		}else { 
			loggerObj.info('Data fetched successfull from database %s', result);
			res.status(200).json(result);
		}
	
	});

	loggerObj.info('Function Name <exit> %s', 'templateUserRelByNameO');
}

var getAssigneebyTemplateNameO = function( req, res ) {
	loggerObj.info('Function Name <enter> %s', 'getAssigneebyTemplateNameO');
	var templateNameArray = req.body.TemplateNameArray;

	console.log(templateNameArray);

	loggerObj.info('Input Template Name is %s ', templateNameArray);

	var query = {$or: [{TemplateName: { $in: templateNameArray}}]};
	console.log('Vikas**************************************************************************************');
	console.log(JSON.stringify(query));

	templateUserRel.find(query, 'TemplateName AssigneeName ' , function(err, result){
		if(err){
			loggerObj.error('Error while fetching details from database %s', err);
			res.status(500).json(err);
		}else { 
			loggerObj.info('Data fetched successfull from database %s', result);
			res.status(200).json(result);
		}
	
	});

	loggerObj.info('Function Name <exit> %s', 'getAssigneebyTemplateNameO');

}

var getAssigneebyTemplateNameSingleO = function( req, res ) {
	loggerObj.info('Function Name <enter> %s', 'getAssigneebyTemplateNameSingleO');
	var templateName = req.query.TemplateName;

	loggerObj.info('Input Template Name is %s ', templateName);

	var query = {TemplateName: templateName};

	templateUserRel.find(query, 'AssigneeName ' , function(err, result){
		if(err){
			loggerObj.error('Error while fetching details from database %s', err);
			res.status(500).json(err);
		}else { 
			loggerObj.info('Data fetched successfull from database %s', result);
			res.status(200).json(result);
		}
	
	});

	loggerObj.info('Function Name <exit> %s', 'getAssigneebyTemplateNameSingleO');

}

var updateAssigneeStatusO = function ( req, res ) {
	loggerObj.info('Function Name <enter> %s', 'updateAssigneeStatusO');
	var completionDate = 'NA';
	var startDate = 'NA' ; 
	var status = req.body.Status;
	var update;

	loggerObj.info('Input Params are %s ', req.body);

	var query = {TemplateName : req.body.TemplateName, "Details.CategoryName": req.body.CategoryName, "Details.AreaName": req.body.AreaName, "Details.TopicName": req.body.TopicName };
	
	loggerObj.info('Query Params are %s ', query);

	if ( req.body.StartDate && req.body.Status) {
		startDate = req.body.StartDate;
		update = {$set: {"Details.$.StartDate": new Date(), "Details.$.Status": status}};

	} else if (req.body.CompleteDate && req.body.Status) {
		completionDate  = req.body.CompleteDate;
		update = {$set: {"Details.$.CompletionDate": completionDate, "Details.$.Status": status}};

	} else if (req.body.Status) {		
		status  = req.body.Status;
		update = {$set: {"Details.$.Status": status}};

	}

	options = {new: true};

	loggerObj.info('Update Params are %s ', update);

	templateUserRel.findOneAndUpdate(query, update, options,  function(err, result) {
		if (err) {
			loggerObj.error('Error while fectching details from Database %s', err);
			res.status(500).json(err);
		} else {
			loggerObj.log('Data fetched successfully from backend %s', result);
			var filteredResult = result.Details.filter(r => r.CategoryName === req.body.CategoryName && r.AreaName === req.body.AreaName && r.TopicName === req.body.TopicName );
			loggerObj.debug('Filtered result is %s ', filteredResult);
			res.status(200).json(filteredResult);
		}
	})

	loggerObj.info ('Function name <exit> %s', 'updateAssigneeStatusO');

}

var getStatusDueDateO = function ( req , res ) {
	loggerObj.info('Function name <enter> %s', 'getStatusDueDateO');
	var assigneeName = req.query.AssigneeName;

	loggerObj.info('Input Params are %s', assigneeName);

	var query = {AssigneeName: assigneeName};

	templateUserRel.find(query, 'TemplateName Details.CategoryName Details.AreaName Details.TopicName Details.Status Details.DueDate', function(error, result) {
		if(error ) {
			loggerObj.error ('Error while fteching details from backend %s', error);
			res.status(500).json(error);
		} else {
			loggerObj.info('Data Fetched from successfull from Backend %s', result);
			res.status(200).json(result);
		}
	}); 
	loggerObj.info('Function Name <exit> %s', 'getStatusDueDateO');
}

module.exports.getStatusDueDateO = getStatusDueDateO;
module.exports.updateAssigneeStatusO = updateAssigneeStatusO;
module.exports.getAssigneebyTemplateNameO = getAssigneebyTemplateNameO;
module.exports.submitAssignedTemplate = submitAssignedTemplate;
module.exports.templateUserRelUpdateHistory = templateUserRelUpdateHistory;
module.exports.templateUserRelO = templateUserRelO;
module.exports.templateUserRelByNameO = templateUserRelByNameO;
module.exports.getAssigneebyTemplateNameSingleO = getAssigneebyTemplateNameSingleO;



