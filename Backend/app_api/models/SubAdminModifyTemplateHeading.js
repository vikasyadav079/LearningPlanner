var mongoose = require('mongoose');

var subAdminModifyTemplateHeadingSchema = new mongoose.Schema({
	SubAdminModifyTemplateHeadings: {
		type: Array,
		require: true
	}
}, {collection : 'subAdminModifyTemplateHeading'});


var subAdminModifyTemplateHeading = mongoose.model('subAdminModifyTemplateHeading', subAdminModifyTemplateHeadingSchema);

module.exports = subAdminModifyTemplateHeading;