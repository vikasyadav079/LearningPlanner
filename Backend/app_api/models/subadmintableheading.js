var mongoose = require('mongoose');

var subAdminTableHeadingSchema = new mongoose.Schema({
	tableheadings: {
		type: Array,
		require: true
	}
}, {collection : 'subadmintableheading'});


var subAdminTableHeading = mongoose.model('subAdminTableHeading', subAdminTableHeadingSchema);

module.exports = subAdminTableHeading;