var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');
module.exports = {
	development:{
		rootPath: rootPath,
		db: "mongodb://localhost:27017/db_app",
		port: process.env.PORT || 3000
	},
	production:{
		rootPath: rootPath,
		db: "mongodb://usuario:contraseña@ds053894.mlab.com:puerto/db_app",
		port: process.env.PORT || 80
	},
	secretKey	: "YourSecretKey"
}
