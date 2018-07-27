var templateContents = require('../models/TemplateContents');
var mongoose = require('mongoose');
var loggerObj = require('../logger');


module.exports.saveNewTopicDetailsO = function( req, res ) {
	loggerObj.info('Function name <enter> %s', 'saveNewTopicDetailsO');
	var topicDetails = req.body;
	loggerObj.info ('Input from request %s', JSON.stringify(topicDetails));

	var query = {TemplateName: topicDetails.TemplateName};

	var templateDetails = new templateContents(); 
	templateContents.findOne({TemplateName: topicDetails.TemplateName}, function(error, result) {
		if (error) {
			loggerObj.error('Error while fetching details for Template Name %s with error %s', topicDetails.TemplateName, JSON.stringify(error));
			res.status(500).json(error);
		} else {
			loggerObj.info('Details fetched successfully for Template Name %s and result is  %s', topicDetails.TemplateName, JSON.stringify(result));
			templateDetails = result;
			var isAreaNameExist = false;
			var isCategoryNameExist = false;
			var isTopicHeadingFound = false;
			for ( var  i = 0 ; i < templateDetails.TemplateDetails.length ; i++) {
				if (templateDetails.TemplateDetails[i].CategoryName === topicDetails.CategoryName) {
					isCategoryNameExist = true;
					for ( var j = 0 ; j < templateDetails.TemplateDetails[i].CategoryDetails.length ; j++) {
						if ( templateDetails.TemplateDetails[i].CategoryDetails[j].AreaName === topicDetails.AreaName){
							isAreaNameExist = true;
							for ( var k = 0 ; k < templateDetails.TemplateDetails[i].CategoryDetails[j].AreaDetails.length ; k++) {
								if (templateDetails.TemplateDetails[i].CategoryDetails[j].AreaDetails[k].TopicHeading === topicDetails.TopicHeading) {
									// No need to add anything...
									isTopicHeadingFound = true;
								}
							}
							if ( !isTopicHeadingFound ) {
								var tempTopicDetails = {
									TopicHeading: topicDetails.TopicHeading,
									TopicDescription: topicDetails.TopicDescription,
									Mentor: topicDetails.MentorList,
									DocLocation: topicDetails.DocLocationList,
									_id: mongoose.Types.ObjectId()
								}
								templateDetails.TemplateDetails[i].CategoryDetails[j].AreaDetails.push(tempTopicDetails);
							}
						}
					}
					if (!isAreaNameExist){
						var tempTopicDetails = {
							TopicHeading: topicDetails.TopicHeading,
							TopicDescription: topicDetails.TopicDescription,
							Mentor: topicDetails.MentorList,
							DocLocation: topicDetails.DocLocationList,
							_id: mongoose.Types.ObjectId()
						}
						var newTempAreaDetails = new Array();
						newTempAreaDetails.push(tempTopicDetails);
						var tempAreaDetails = {
							AreaName: topicDetails.AreaName,
							AreaDetails: newTempAreaDetails
						}
						templateDetails.TemplateDetails[i].CategoryDetails.push(tempAreaDetails);
					}
				}
			}
			if (!isCategoryNameExist) {
				var tempTopicDetails = {
					TopicHeading: topicDetails.TopicHeading,
					TopicDescription: topicDetails.TopicDescription,
					Mentor: topicDetails.MentorList,
					DocLocation: topicDetails.DocLocationList,
					_id: mongoose.Types.ObjectId()
				}
				var newTempAreaDetails = new Array();
				newTempAreaDetails.push(tempTopicDetails);
				var tempAreaDetails = {
					AreaName: topicDetails.AreaName,
					AreaDetails: newTempAreaDetails,
					_id: mongoose.Types.ObjectId()
				}
				var tempCategoryName = topicDetails.CategoryName;
				var tempCategoryDetails = new Array();
				tempCategoryDetails.push(tempAreaDetails);
				var newCategoryO = {
					CategoryName: tempCategoryName,
					CategoryDetails: tempCategoryDetails,
					_id: mongoose.Types.ObjectId()
				}
				templateDetails.TemplateDetails.push(newCategoryO);
			}
			var updateQuery = {"$set": {"TemplateDetails": templateDetails.TemplateDetails}};
			templateContents.update({TemplateName: topicDetails.TemplateName}, updateQuery, function(error, result){
			if(error){	
				loggerObj.error('Error while updating details at backend');
				res.status(500).json(error);
			} else {
				loggerObj.info('Topic details updated successfully');
				res.status(200).json(result);
			}
		});
		}
	})
	loggerObj.info('Function name <exit> %s', 'saveNewTopicDetailsO');
}