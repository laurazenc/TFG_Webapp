(function () {
	'use strict';
	angular.module('app', [
		// Angular Modules
		'app.core',
		'app.routes',

		/* Sessions
		*		app.session
		*			Auth
		*			AuthToken
		*			AuthTokenProvider
		*/
		'app.session',

		/* Dashboard
		*		app.dashboard
		*			Dashboard
		*/
		'app.dashboard',

		/* Profile
		*  app.profile
		*/
		'app.profile',

		/*  Users
		*		app.users
		*/
		'app.user',

		/*  Projects
		*		app.projects
		*/
		'app.project',

		/*  Comments
		*		app.comments
		*/
		'app.comment',

		/*  Porfolio
		*		app.portfolio
		*/
		'app.portfolio',

		/*  Admin
		*		app.admin
		*/
		'app.admin'

	])
})();
