var mongoose = require('mongoose');

var adminTableHeadingSchema = new mongoose.Schema({
	AdminTableHeading: {
		type: Array,
		require: true
	}
}, {collection : 'adminUsersHeading'});


var adminTableHeading = mongoose.model('adminTableHeading', adminTableHeadingSchema);

module.exports = adminTableHeading;