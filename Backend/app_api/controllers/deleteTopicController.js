var mongoose = require('mongoose');
var loggerObj = require('../logger');
var templateContents = require('../models/TemplateContents');
var templateUserRel = require('../models/TemplateUserRel');
var TemplateMetadata = require('../models/TemplateMetadata');


module.exports.deleteTopicO = function ( req, res) {
	loggerObj.info('Function Name <enter> : %s', 'deleteTopicO');
	var topicDetails = {
		TemplateName: req.body.TemplateName,
		CategoryName: req.body.CategoryName,
		AreaName: req.body.AreaName,
		TopicName: req.body.TopicName
	}

	loggerObj.info('Received input %s', topicDetails);

	// check if Template Needs to delete 

	var templateContentDetails = null; 
	var categoryLength = 0;
	var areaLength = 0;
	var topicLength = 0;
	templateContents.findOne({"TemplateName": topicDetails.TemplateName}, function( error , result ) {
		if (error) {
			loggerObj.error('Getting error from templateContents table while fetching details from database %s', error);
			res.status(500).json('Error while getting Template Details');
		} else {
			loggerObj.info('Data fetched successfully %s ', result);
			console.log(result);
			templateContentDetails = result;
			console.log(templateContentDetails);
			console.log('*************************************** Template Details **************************************************************');
			console.log(templateContentDetails);

			categoryLength = templateContentDetails.TemplateDetails.length; 

			for (var i = 0 ; i<templateContentDetails.TemplateDetails.length; i++ ) {
				if (templateContentDetails.TemplateDetails[i].CategoryName === topicDetails.CategoryName) {		
					areaLength = templateContentDetails.TemplateDetails[i].CategoryDetails.length;			
					for ( var j = 0 ; j < templateContentDetails.TemplateDetails[i].CategoryDetails.length ; j++ ){
						if ( topicDetails.AreaName === templateContentDetails.TemplateDetails[i].CategoryDetails[j].AreaName) {					
							topicLength = templateContentDetails.TemplateDetails[i].CategoryDetails[j].AreaDetails.length;
						}				
					}
				}
			}

			console.log('*************************************** Counts **************************************************************');
			console.log(categoryLength);
			console.log(areaLength);
			console.log(topicLength);

			if (topicLength === 1) {
				if (areaLength === 1) {
					if (categoryLength === 1) {
						console.log('Vikas%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*********************************');
						console.log(topicDetails.TemplateName);
						// delete Template Name
						// Deleing from templatecontents
						templateContents.remove({"TemplateName": topicDetails.TemplateName}, function(error, result) {
							if ( error ){
								loggerObj.error('Getting error from templateContents table while removing details from database %s', error);
								res.status(500).json({"message": 'Error in Deleting Data from tables. Kindly check all the tables'});
							} else {
								// delete template from template user relation 
								templateUserRel.remove({"TemplateName": topicDetails.TemplateName}, function ( error , result ){
									if (error) {
										loggerObj.error('Getting error from templateUserRel table while removing details from database %s', error);
										res.status(500).json({"message": 'Error in Deleting Data from tables. Kindly check all the tables'});
									} else {
										// delete template from template metadata
										TemplateMetadata.remove({"TemplateName": topicDetails.TemplateName}, function( error, result ){
											if (error) {
												loggerObj.error('Getting error from templateMetaData table while removing details from database %s', error);
												res.status(500).json({"message": 'Error in Deleting Data from tables. Kindly check all the tables'});
											} else {
												loggerObj.info(' Deleting Template Name ... Data deletion successfull  ########################## %s',result);
												res.status(200).json({"message": 'Data deleted successfully ##########################', "result": JSON.stringify(result)});
											}
										})
									}
								})
							}
						})
					} else {
						// Delete this category Name
						// Deleing from templatecontents
						var updateContents =  {"$pull":{"TemplateDetails": {"CategoryName": topicDetails.CategoryName}}};
						templateContents.update({"TemplateName": topicDetails.TemplateName},updateContents, function(error, result) {
							if ( error ){
								loggerObj.error('Getting error from templateContents table while removing details from database %s', error);
								res.status(500).json({"message": 'Error in Deleting Data from tables. Kindly check all the tables'});
							} else {
								// delete template from template user relation
								var updateUserRel = {"$pull": {"Details": {"CategoryName": topicDetails.CategoryName}}}
								templateUserRel.update({"TemplateName": topicDetails.TemplateName}, updateUserRel, function ( error , result ){
									if (error) {
										loggerObj.error('Getting error from templateUserRel table while removing details from database %s', error);
										res.status(500).json({"message": 'Error in Deleting Data from tables. Kindly check all the tables'});
									} else {
										loggerObj.info('Deleting Category Name .... Data deletion successfull  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% %s', result);
										res.status(200).json({"message": 'Data deleted successfully%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%', "result": JSON.stringify(result)});								
									}
								})
							}
						})
					}
				} else {
					// delete Area Name 
					// Deleing from templatecontents
					var updateContentsAreaName = {"$pull":{"TemplateDetails.$.CategoryDetails" : {"AreaName" : topicDetails.AreaName}}};
					templateContents.update({"TemplateName": topicDetails.TemplateName , "TemplateDetails.CategoryName": topicDetails.CategoryName}, updateContentsAreaName, function(error, result) {
						if ( error ){
							loggerObj.error('Getting error from templateContents table while removing details from database %s', error);
							res.status(500).json({"message": 'Error in Deleting Data from tables. Kindly check all the tables'});
						} else {
							// delete template from template user relation 
							var updateUserRelAreaName = {"$pull": {"Details": {"AreaName": topicDetails.AreaName}}}
							templateUserRel.update({"TemplateName": topicDetails.TemplateName }, updateUserRelAreaName, function ( error , result ){
								if (error) {
									loggerObj.error('Getting error from templateUserRel table while removing details from database %s', error);
									res.status(500).json({"message": 'Error in Deleting Data from tables. Kindly check all the tables'});
								} else {
									loggerObj.info('Deleting Area Name ... Data deletion successfull ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ %s',result);
									res.status(200).json({"message": 'Data deleted successfully^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^', "result": JSON.stringify(result)});							
								}
							})
						}
					})
				}
			} else {
				// Delete Topic Name 
				// Deleing from templatecontents
				var filterResult ;
				var topicDetailsO = new templateContents();
				var num;
				templateContents.findOne({TemplateName: topicDetails.TemplateName, "TemplateDetails.CategoryName": topicDetails.CategoryName, "TemplateDetails.CategoryDetails.AreaName": topicDetails.AreaName, "TemplateDetails.CategoryDetails.AreaDetails.TopicHeading": topicDetails.TopicName}, function ( error , result){
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
							if ( topicDetailsO.TemplateDetails[j].CategoryName === topicDetails.CategoryName) {
								for ( var k = 0 ; k < topicDetailsO.TemplateDetails[j].CategoryDetails.length ; k++ ) {
									num = j;
									if ( topicDetailsO.TemplateDetails[j].CategoryDetails[k].AreaName === topicDetails.AreaName) {
										topicDetailsO.TemplateDetails[j].CategoryDetails[k].AreaDetails = filterResult;
									}
								}
							}
						}
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
			}

		}
	});

	
}
