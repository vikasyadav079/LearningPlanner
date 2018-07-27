var mongoose = require('mongoose');

var tableUserHeadingsSchema = new mongoose.Schema({
	TableHeading: {
		type: Array,
		require: true
	}
}, {collection : 'tableuserheading'});


var tableUserHeading = mongoose.model('tableIUserHeading', tableUserHeadingsSchema);

module.exports = tableUserHeading;