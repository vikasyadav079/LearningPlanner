var mongoose = require('mongoose');
var loggerObj = require('../logger');
var templateContents = require('../models/TemplateContents');
var templateUserRel = require('../models/TemplateUserRel');
var TemplateMetadata = require('../models/TemplateMetadata');

module.exports.saveModifiedDataO = function( req, res) {
	loggerObj.info('Function Name <enter> %s ', 'saveModifiedDataO');
	var topicDetails = {
		TemplateName: req.body.UpdatedTopicDetails.TemplateName,
		CategoryName: req.body.UpdatedTopicDetails.CategoryName,
		AreaName: req.body.UpdatedTopicDetails.AreaName,
		TopicHeading: req.body.UpdatedTopicDetails.TopicName,
		Mentor: req.body.UpdatedTopicDetails.MentorList,
		DocList: req.body.UpdatedTopicDetails.DocLocationList,
		TopicDesc: req.body.UpdatedTopicDetails.TopicDesc
	}

	var oTopicDetails = {
		TemplateName: req.body.OldTopicDetails.TemplateName,
		CategoryName: req.body.OldTopicDetails.CategoryName,
		AreaName: req.body.OldTopicDetails.AreaName,
		TopicHeading: req.body.OldTopicDetails.TopicName,
	}



		var filterResult ;
		var topicDetailsO = new templateContents();
		var queryToFind = {TemplateName: oTopicDetails.TemplateName, "TemplateDetails.CategoryName": oTopicDetails.CategoryName, "TemplateDetails.CategoryDetails.AreaName": oTopicDetails.AreaName, "TemplateDetails.CategoryDetails.AreaDetails.TopicHeading": oTopicDetails.TopicHeading};
		console.log('queryToFind');
		console.log(queryToFind);
		templateContents.findOne(queryToFind, function ( error , result){
			if (error) {
				loggerObj.error('Error while getting the data from database %s', JSON.stringify(error));
				res.status(500).json(error);
			} else {
				loggerObj.info('Details fetched from database %s' ,JSON.stringify(result));
				topicDetailsO = result;
				filterResult = result.TemplateDetails.filter(function (res){
					return res.CategoryName === topicDetails.CategoryName;
				})[0].CategoryDetails.filter(function(cd){ return cd.AreaName === topicDetails.AreaName;})[0].AreaDetails.filter(function(ad){
					return ad.TopicHeading !== topicDetails.TopicName;
				}); 

				for ( var  j = 0 ; j < topicDetailsO.TemplateDetails.length ; j++ ){
					if ( topicDetailsO.TemplateDetails[j].CategoryName === oTopicDetails.CategoryName) {
						for ( var k = 0 ; k < topicDetailsO.TemplateDetails[j].CategoryDetails.length ; k++ ) {
							if ( topicDetailsO.TemplateDetails[j].CategoryDetails[k].AreaName === oTopicDetails.AreaName) {
								for ( var l = 0 ; l < topicDetailsO.TemplateDetails[j].CategoryDetails[k].AreaDetails.length ; l++) {
									if (topicDetailsO.TemplateDetails[j].CategoryDetails[k].AreaDetails[l].TopicHeading === oTopicDetails.TopicHeading) {
										
										topicDetailsO.TemplateDetails[j].CategoryDetails[k].AreaDetails[l] = { Mentor: topicDetails.Mentor, DocLocation: topicDetails.DocList, TopicHeading: topicDetails.TopicHeading, TopicDescription: topicDetails.TopicDesc, _id: topicDetailsO.TemplateDetails[j].CategoryDetails[k].AreaDetails[l]._id};
									}
								}
								
							}
						}
					}
				}console.log( { Mentor: topicDetails.Mentor, DocLocation: topicDetails.DocList, TopicHeading: topicDetails.TopicHeading, TopicDescription: topicDetails.TopicDesc});
				console.log('Vikas&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
				console.log(JSON.stringify(topicDetailsO));
				templateContents.update({TemplateName: topicDetails.TemplateName}, {"$set": {"TemplateDetails": topicDetailsO.TemplateDetails}}, function(error, result){
					if ( error) {
						loggerObj.error('Error while updating database %s' ,JSON.stringify(error));
						res.status(500).json(error);
					} else {
						console.log('Vikas Result %s', JSON.stringify(result));
					}
				})
			}
		});
		loggerObj.info('Function Name <exit> %s ', 'saveModifiedDataO');
}