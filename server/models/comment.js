var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
	creator: { type: Schema.Types.ObjectId, ref: 'User'},
	project: { type: Schema.Types.ObjectId, ref: 'Project'},
	content: { type: String, trim: true},
	created_at: { type: Date, defauly: Date.now},
  updated_at: { type: Date, defauly: Date.now}
});

CommentSchema.pre('save', function(next){
	now = new Date();
	this.updated_at = now;
	if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});

module.exports = mongoose.model('Comment', CommentSchema);
