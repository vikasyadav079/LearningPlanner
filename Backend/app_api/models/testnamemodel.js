var mongoose = require('mongoose');

var testnameSchema = new mongoose.Schema({
	name: [
	{
		firstname: {
			type: String,
			require: true
		},
		lastname: {
			type: String,
			require: true
		}
	}
	],
},{collection: 'testnamesecond'});

testnameSchema.index({'name.firstname': 1, 'name.lastname':1}, {unique: true});

var testnamemodelM =  mongoose.model('testnamemodelM', testnameSchema);

module.exports = testnamemodelM;