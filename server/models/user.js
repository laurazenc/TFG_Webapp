var mongoose 	= require('mongoose');
var Schema 		= mongoose.Schema;
var bcrypt 		= require('bcrypt-nodejs');
var ProjectSchema = require('./project');
var CommentSchema = require('./comment');

var UserSchema = new Schema({
	username: { type: String, required: true},
	email: { type: String, required: true, index: {unique : true}},
	password: {type: String, required: true, select: false},
	isAdmin: { type: Boolean, default: false },
	isTeacher: { type: Boolean, default: false},
	created_at: { type: Date, defauly: Date.now},
	updated_at: { type: Date, defauly: Date.now}
});

UserSchema.pre('save', function (next) {
	var user = this;
	now = new Date();
	now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
	if(!user.isModified('password')) return next();

	// hash(data, salt, progress, cb)
	bcrypt.hash(user.password, null, null, function (err, hash){
		// set password
		if(err) return next(err);
		user.password = hash;
		next();
	})
});

UserSchema.pre('remove', function (next) {
	ProjectSchema.remove({creator: this._id}).exec();
	CommentSchema.remove({creator: this._id}).exec();
  next();
})

UserSchema.methods.comparePassword = function(password){
	var user = this;
	return bcrypt.compareSync(password, user.password);
}

module.exports = mongoose.model('User', UserSchema);
