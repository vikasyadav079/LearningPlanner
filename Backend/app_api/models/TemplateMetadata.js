var mongoose = require('mongoose');

var templateMetaDataSchema = new mongoose.Schema({
	TemplateName : {
		type: String,
		require: true,
		unique: true
	},
	ProgramName: {
		type: Array,
		require : true
	},
	OwnerGroup : {
		type: String,
		require : true
	},
	Owner : {
		type : Array,
		require: true
	},
	Creater: {
		type: String,
		require: true
	},
	CreatedAt : {
		type: Date,
		require : true
	},
	UpdatedAt : { 
		type : Date,
		require : true 
	},
	TemplateDescription : {
		type: String,
		default: " There is no description for this Template"
	}
}, {collection : 'templatemetadata'});

templateMetaDataSchema.methods.setUserDate = function(){
  this.UpdatedAt = new Date();
  if (this.CreatedAt == null) {
    this.CreatedAt = Date.now();
  }
}


var templateMetaData = mongoose.model('templateMetaData', templateMetaDataSchema);

module.exports = templateMetaData;