var mongoose = require('mongoose');

var templateUserRelSchema = new mongoose.Schema({
	TemplateName: {
		type: String,
		require: true
	},
	AssigneeName : {
		type: String,
		require: true
	},
	JoiningDate : { 
		type: Date,
		require: true
	},
	Details: [
	{
		CategoryName : {
			type: String,
			require: true
		},
		AreaName: {
			type : String,
			require: true
		},
		TopicName : {
			type: String,
			require: true
		},
		StartDate : {
			tyep: Date,
			require: false

		},
		CompletionDate : {
			type: Date,
			require: false
		},
		Status: {
			type : String,
			require: true
		},
		DueDate : {
			type: Date,
			require: true
		},
		History : [
		{
			seqno: {
				type : Number,
				require: true
			},
			submitter : {
				type: String, 
				require : true
			},
			SubmittedDate: {
				type : String,
				require: true
			},
			Notes : {
				type : String,
				require :true
			}
		}
		]
	}
	]
}, {collection : 'templateuserrel'});


var templateUserRel = mongoose.model('templateUserRel', templateUserRelSchema);

module.exports = templateUserRel;