var mongoose = require('mongoose');

var subAdminTableBodySchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		require: true
	},
	created_at: {
		type: String,
		require: true
	},
	updated_at: {
		type: String,
		require: true
	}, 
	assigned_to: {
		type: Array
	},
	owner_group: {
		type: Array,
		require: true
	},
	owner: {
		type: Array,
		require: true
	},
	description: { 
		type: String,
		require: true
	},
}, {collection : 'subadmintemplatedetails'});




var subAdminTableBody = mongoose.model('subAdminTableBody', subAdminTableBodySchema);

module.exports = subAdminTableBody;