var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CommentSchema = require('./comment');

var ProjectSchema = new Schema({
  creator: { type: Schema.Types.ObjectId, ref: 'User'},
  title: { type: String, trim: true, required: true},
  description: { type: String, trim: true},
  type: { type: String, required: true, enum: ['personal', 'educational'], default: ['personal'] },
	code: [{
		html: String,
		css: String,
		js: String
	}],
  libs: {type: [String], trim: true},
  created_at: { type: Date, defauly: Date.now},
  updated_at: { type: Date, defauly: Date.now}
});

ProjectSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});

ProjectSchema.pre('remove', function (next) {
	CommentSchema.remove({project: this._id}).exec();
  next();
})

module.exports = mongoose.model('Project', ProjectSchema);
