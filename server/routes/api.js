// Requires
var User					= require('../models/user');
var Project				= require('../models/project');
var Comment				= require('../models/comment');
var config				= require('../config/config');
var jsonwebtoken 	= require('jsonwebtoken');


// Vars
var secretKey 		= config.secretKey;

// Funciones
function createToken(user){
	var token = jsonwebtoken.sign({
		id: user._id,
		username: user.username,
		email: user.email,
		isAdmin: user.isAdmin,
		isTeacher: user.isTeacher
	}, secretKey, { expirtesInMinutes: 1440 });

	return token;
}

// API RESTful
module.exports = function(app, express, io){
	var api = express.Router();

	// Signup new User
	api.post('/signup', function(req, res){
		var user = new User({
			email: req.body.email,
			username: req.body.username,
			password: req.body.password
		});

		// Create token for the user
		var token = createToken(user);
		user.save(function(err){
			if(err){
				if(err.toString().indexOf('E11000') > -1){
		          err = new Error('Ya existe un usuario registrado con ese email!');
		        }
		    return res.status(400).send({reason: err.toString()});
			}
			res.status(200).send({success: true, user:user, token:token});
		});
	});

	// LogIn
	api.post('/login', function(req,res, next){
		User.findOne({
			email: req.body.email
		}).select('email password isAdmin isTeacher username').exec(function (err, user){
			if(err) return next(err);

			if(!user){
				return res.send({success: false, reason: "No existe ningún usuario asociado a esa cuenta de correo."});
			 }else if(user){
				var validPassword = user.comparePassword(req.body.password);
				// Invalid password
				if(!validPassword){
					return res.send({success: false, reason: "Contraseña incorrecta!"});
				}else{
					// Create token for the session
					var token = createToken(user);
					res.status(200).send({success: true, token: token });
				}
			}
		});
	});



	// Get users
	api.get('/users', function(req, res){

		var query = User.find();
		if(req.query.limit){
			query.limit(req.query.limit).sort('-created_at');
		}

		query.exec(function(err, users) {
			if (err) return res.send(err);
			res.status(200).send(users);
		 });
	});

	api.get('/user', function(req, res){
		User.findOne({
			email:req.query.email
		}).exec(function(err, user){
			if (err) return next(err);
			if(user){
				res.send({user: user, success: true});
			}else{
				res.send({user: null, success: false});
			}
		});
	})

	// Middleware
	api.use(function (req,res,next){

		var token = req.body.token || req.query.token || req.param('token') || req.headers['x-access-token'];


		// Check if token exists
		if(token){
			jsonwebtoken.verify(token, secretKey, function (err, decoded){
				if(err){
					res.status(403).send({
						success: false,
						message: "No es posible autenticar al usuario."
					});
				}else{
					req.decoded = decoded;

					next();
				}
			});
		}else{
			res.status(403).send({
				success: false,
				message: "No se ha proporcionado token"
			});
		}
	});

	// Everything below here needs a token

	api.route('/user/:id')
	.get(function(req, res, next) {
		if(req.query.id) req.params.id = req.query.id;
		User.findOne({
			_id : req.params.id
		}).exec(function(err, user) {
			if (err) return next(err);
			if (user){
				res.status(200).send({user: user, success: true });
			}else{
				res.status(404).send({success: false});

			}
		});
	});

	api.route('/users/:id')
	.get(function(req, res, next) {

		User.findOne({
			_id : req.params.id
		}).exec(function(err, user) {
			if (err) return next(err);
			if (user){
				res.status(200).json({
					id: user._id,
					username: user.username,
					email: user.email,
					success: true
				});
			}else{
				res.status(404).send({
					message: 'No existe el usuario',
					success: false
				});
				return;
			}
		});
	})
	.put(function(req, res, next) {
		var u;

		if(req.body._id){
			u = User.findOne({
				_id: req.body._id
			});

			u.exec(function(err,user){
				if(err) return next(err);
				if(user){

					var updateUser = new User();
					updateUser = user;
					updateUser.username = req.body.username;
					updateUser.email = req.body.email;
					updateUser.isTeacher = req.body.isTeacher;
					updateUser.isAdmin = req.body.isAdmin;

					updateUser.save(function(err){
						if(err){
							return res.send({success: false, reason: err.toString()});
						}
						res.send({success: true});
					});
				}else{
					res.send({reason: "El usuario no existe", success: false });
				}
			});

		}else{
			u = User.findOne({
				_id: req.body.id
			});

			u.exec(function(err,user){
				if(err) return next(err);
				if(user){

					if(req.body.username) user.username = req.body.username;
					if(req.body.email) user.email = req.body.email;
					if(req.body.password) user.password = req.body.password;
					if(req.body.isTeacher) user.isTeacher = req.body.isTeacher;
					if(req.body.isAdmin) user.isAdmin = req.body.isAdmin;

					// Create token for the user
					user.save(function(err){
						if(err){
							return res.send({success: false, reason: err.toString()});
						}
						var token = createToken(user);
						res.send({success: true, token: token, user: user});
					});
				}else{
					res.send({reason: "El usuario no existe", success: false });
				}
			});

		}

	})

	.delete(function(req, res, next){

		User.findOne({
			_id : req.params.id
		}).exec(function(err, user) {
			if(err) res.send({success: false, reason: "An error happened."});
			if(user){
				user.remove(function(err){
					if(err){
						res.status(404).send({success: false, reason: "An error happened."});
						return;
					}else{
						res.status(200).send({success: true });
					}
				});
			}else{
				res.status(404).send({success: false, reason: "El usuario no existe."});
			}

		});

	});

	api.route('/users/:id/projects')
	.get(function(req, res, next){

		var query = Project.find();
		if(req.query.name){
			query.where({
				creator: req.params.id,
				title: new RegExp('^' + '[' + req.query.name + ']', 'i'),
				type: req.query.type
			});
		}else{
			query.where({creator: req.params.id});
		}
		query.exec(function(err, projects) {
			if (err) return res.send(err);

			res.status(200).send({success: true, projects: projects });
		 });
	});

	api.route('/projects')
	.post(function (req, res, next) {
		if(req.body.title != ""){
			var projectName = req.body.title;
			var projectDescription = req.body.description;
			var type = req.body.type;
			var codeHTML = req.body.html;
			var codeCSS = req.body.css;
			var codeJS = req.body.js;
			var project = new Project({
				creator: req.decoded.id,
				title: projectName,
				description: projectDescription,
				type: type,
				code: [],
				comments: [],
				libs: []
			});
			project.libs = req.body.libs;
			project.code.push({
				html: codeHTML,
				css: codeCSS,
				js: codeJS
			});

			project.save(function(err) {
				if(err){
					res.status(404).send({
						success: false,
						message: "An error happen."});
						return;
					}else{
						res.status(200).send({
							success: true,
							message: 'Project created!',
							id: project.id
						});
					}
				});
		}else{
			res.status(404).send({
				success: false,
				reason: "El título no puede estar vacío."});
		}
	})

	.get(function (req, res, next) {
		var query = Project.find();
		if(req.query.type){
			query.where({
				title: new RegExp('^' + '[' + req.query.name + ']', 'i'),
				type: req.query.type
			});
		}
		if(req.query.limit){
			query.limit(req.query.limit)
		}
		query.sort('-created_at');
		query.exec(function(err, projects) {
			if (err) return res.send(err);
			User.populate(projects, {path: "creator"},function(err, projects2){
				res.status(200).send(projects2);
			});
		 });

	});

	api.route('/projects/:id')
		.get(function(req, res, next) {
			Project.findOne({
				_id : req.params.id
			}).exec(function(err, project) {
				if (err){
					return res.status(500).send({success: false, reason: 'No se puede encontrar el proyecto'});
				}
				if (project){
					User.populate(project, {path: "creator"},function(err, projects){
	            res.status(200).send({success: true, project: projects});
	        });
				}else{
					res.status(403).send({success: false, reason: 'No se puede encontrar el proyecto'});
					return;
				}
			});
		})
		.put(function(req, res, next){

			Project.findOne({
				_id : req.body._id
			}).exec(function(err, project) {
				if(err) res.send(err);

				var codeHTML = req.body.code[0].html;
				var codeCSS = req.body.code[0].css;
				var codeJS = req.body.code[0].js;

				project.title = req.body.title;
				project.description = req.body.description;
				project.type = req.body.type;
				project.libs = req.body.libs;
				project.code[0].html = codeHTML;
				project.code[0].css = codeCSS;
				project.code[0].js = codeJS;
				project.save(function(err){
					if(err){
						res.status(404).send({
							success: false,
							reason: "An error happen."});
							return;
						}else{
							res.status(200).json({
								success: true,
								reason: 'Project updated!',
							});
						}
					});

				});
			})
		.delete(function(req,res,next){
			Project.findOne({
				_id : req.params.id
			}).exec(function(err, project) {
				if(err) res.send(err);
				project.remove(function(err){
					if(err){
						res.status(404).send({
							success: false,
							reason: "An error happened."});
							return;
						}else{
							res.status(200).json({
								success: true,
								message: 'Project removed!',
							});
						}
					});
				});
			});

	api.route('/comments')
		.post(function(req,res,next){

			var commentContent = req.body.content;

			var comment = new Comment({
				creator: req.decoded.id,
				project: req.body.project,
				content: commentContent
			});

			comment.save(function(err,comment) {
				if(err){
					res.status(404).send({success: false, message: "An error happen."});
					return;
				}else{
					User.populate(comment, {path: "creator"},function(err, comment){
						io.emit('comment', comment);
						res.send({success: true, comment: comment});
	        });

				}
			});

		})
		.get(function(req,res,next){
			var query = Comment.find();
			if(req.query.project){
				query.where({
					project: req.query.project
				});

				query.exec(function(err,comments){
					if(err) return res.send(err);

					User.populate(comments, {path: "creator"},function(err, comments){
						res.status(200).send(comments);
					});
				});


			}else if (req.query.creator) {
				query.where({
					creator: req.query.creator
				});

				query.exec(function(err,comments){
					if(err) return res.send(err);

					Project.populate(comments, {path: "project"},function(err, comments){
						res.status(200).send(comments);
	        });
				});
			}else if(req.query.limit){
				query.limit(req.query.limit).sort('-created_at');
				query.exec(function(err,comments){
					if(err) return res.send(err);

					Project.populate(comments, {path: "project"},function(err, comments){
						User.populate(comments, {path: "creator"},function(err, comments){
							res.status(200).send(comments);
						});
					});
				});
			}else{
				query.exec(function(err,comments){
					if(err) return res.send(err);

					Project.populate(comments, {path: "project"},function(err, comments){
						User.populate(comments, {path: "creator"},function(err, comments){
							res.status(200).send(comments);
						});
					});
				});
			}

		});

	api.route('/comments/:id')
		.get(function(req,res,next){

			Comment.findOne({
				_id: req.params.id
			}).exec(function(err, comment) {

		    if (err) return next(err);
		    if (comment) res.json(comment);
		    else res.send({success: false, message: 'Cant get comment'});
		  });
		});


	api.route('/comment/:id')
		.put(function(req, res, next){
			Comment.findOne({
				_id: req.body._id
			}).exec(function(err, comment){
				if(err) return next(err);
				if(comment){
					comment.content = req.body.content;
					comment.save(function(err,comment) {
						if(err){
							res.status(404).send({success: false, message: "An error happen."});
							return;
						}else{
							res.send({success: true, comment: comment});
						}
					});
				}
			});
		})
		.delete(function(req,res,next){

			Comment.findOne({
				_id: req.params.id
			}).exec(function(err, comment){
				if(err) return next(err);
				if(comment){
					comment.remove(function(err){
						if(err){
							res.status(404).send({success: false, reason: "An error happened."});
							return;
						}else{
							io.emit('delete', req.params.id);
							res.status(200).send({success: true });
						}
					});
				}else{
					res.status(404).send({success: false, reason: "El mensaje no existe."});
				}
			});
		});


	api.get('/me', function (req, res){
		res.send(req.decoded);
	});

	return api;
}
