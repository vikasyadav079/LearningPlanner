var express = require('express');
var router = express.Router();
var ctrlProfile = require('../controllers/home');
var authenticationUrls = require('../controllers/authentication');
var tableUserHeadings = require('../controllers/tableUserHeadingsController');
var templateContents = require('../controllers/templateContents');
var templateMetadata = require('../controllers/TemplateMetadataController');
var templateUserrel = require('../controllers/TemplateUserrelController');
var subAdminTableHeading = require('../controllers/subAdminTableHeadingController');
var subAdminTableBody = require('../controllers/subAdminTableBodyController');
var adminTableHeading = require('../controllers/AdminUserHeadingController');
var clientErrorController = require('../clientLoggerController');
var deleteTemplateDataO = require('../controllers/deleteTemplateController');
var subAdminModifyTemplateHeadings = require('../controllers/subAdminModifyTemplateHeadingController');
var deleteTopicC = require('../controllers/deleteTopicController');
var saveModifiedTopicC = require('../controllers/saveModifiedTopicController');
var saveNewTopicDetails = require('../controllers/saveNewTopicDetailsController');



var jwt = require('express-jwt');
var auth = jwt({
    secret:'MY_SECRET',
    userProperty:'payload'
})

router.get('/getStatusDueDate', templateUserrel.getStatusDueDateO);
router.get('/getAdmintableheading', adminTableHeading.admintableheadings);
router.get('/getTopicsNamebyTemplate', templateContents.submitAssignedTemplateO);
router.post('/templateSaveContents', templateContents.templateSaveContentsO);
router.put('/updateAssigneeStatus', templateUserrel.updateAssigneeStatusO);
router.post('/getAssigneebyTemplateName', templateUserrel.getAssigneebyTemplateNameO);
router.get('/getAssigneebyTemplateName', templateUserrel.getAssigneebyTemplateNameSingleO);
router.get('/templateUserRelByName', templateUserrel.templateUserRelByNameO);
router.post('/submitAssignedTemplate', templateUserrel.submitAssignedTemplate);
router.get('/getTemplateDetailsbyName', templateContents.getTemplateDetailsbyName);
router.get('/getTemplatebyName', templateMetadata.getTemplateByNames);
router.post('/updateUserDetail', authenticationUrls.updateUserDetails);
router.post('/register', authenticationUrls.register);
router.post('/login', authenticationUrls.login);
router.get('/tableUserHeadings', tableUserHeadings.userHeadings);
router.put('/fetchTemplateData', templateContents.templateContentsbasedOnTopic);
router.get('/templateMetadata', templateMetadata.templateMetadataO);
router.post('/savetemplatemetadata', templateMetadata.savetemplatemetadataO);
router.post('/templateUserrel', templateUserrel.templateUserRelO);
router.put('/updateHistory', templateUserrel.templateUserRelUpdateHistory);
router.get('/home', auth, ctrlProfile.profileRead);
router.get('/allUserDetail', authenticationUrls.allUserDetails);
router.get('/getSubadmintableheading', subAdminTableHeading.tableheadings);
router.get('/getSubadmintablebody', templateMetadata.tablebody);
router.get('/newtemplate', subAdminTableBody.tablebodybyname);
router.get('/getUsers', authenticationUrls.getUsers);
router.post('/logError', clientErrorController.clientErrorLogger);
router.delete('/deleteTemplateByName', deleteTemplateDataO.deleteTemplateData);
router.get('/subAdminModifyTemplateHeader', subAdminModifyTemplateHeadings.subAdminModifyTemplateHeadingO);
router.post('/deleteTopic', deleteTopicC.deleteTopicO);
router.put('/saveModifiedData', saveModifiedTopicC.saveModifiedDataO);
router.post('/saveNewTopicDetails', saveNewTopicDetails.saveNewTopicDetailsO);


module.exports = router;
