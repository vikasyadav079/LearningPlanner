var mongoose = require('mongoose');

var templateContentsSchema = new mongoose.Schema({
TemplateName: {
	type: String,
	require: true
},
TemplateDetails: [
	{
		CategoryName: {
			type: String,
			require: true
		},
		CategoryDetails: 
		[ 
			{
				AreaName: 
				{ 
					type: String,
					require: true
				}, 
				AreaDetails: 
				[
					{
						TopicHeading: 
						{
							type: String,
							require: true

						},
						DueDate:
						{
							type: Date,
							require: true,
							
						},
						Status: 
						{
							type: String,
							require: true,
							
						},
						CompletionDate:
						{
							type: Date,
							require: true,
							
						},
						Mentor: 
						{
							type: Array,
							require: true
							
						},
						DocLocation: 
						{
							type: Array,
							require: true
							
						},
						TopicDescription:
						{
							type: String,
							require: true,
							
						},
					}
				]
			}			
		]
	}
]

}, {collection : 'templatecontents'});

 templateContentsSchema.index({TemplateName: 1, 'TemplateDetails.CategoryName': 1, 'TemplateDetails.CategoryDetails.AreaName': 1, 'TemplateDetails.CategoryDetails.AreaDetails.TopicHeading' : 1, 'TemplateDetails.CategoryDetails.AreaDetails.TopicHeading.Mentor' : 1, 'TemplateDetails.CategoryDetails.AreaDetails.TopicHeading.DocLocation' : 1}, {name: 'myIndex1'}, {unique: true});




var templateContents = mongoose.model('templateContents', templateContentsSchema);

module.exports = templateContents;