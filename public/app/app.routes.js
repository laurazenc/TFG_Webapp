(function () {
	'use strict';
	angular.module('app.routes', [])
		.config(function ($routeProvider, $locationProvider) {
			$routeProvider
				.when('/', {
					templateUrl 	: 'app/dashboard/views/dashboard.html',
					controller 		: 'DashboardController',
					controllerAs	: 'dashboard'
				})
				.when('/signup', {
					templateUrl 	: 'app/session/views/signup.html',
					controller 		: 'SessionController',
					controllerAs	: 'session'
				})
				.when('/login', {
					templateUrl 	: 'app/session/views/login.html',
					controller 		: 'SessionController',
					controllerAs	: 'session'
				})
				.when('/add', {
					templateUrl 	: 'app/project/views/add.html',
					controller 		: 'CreateProjectController'
				})
				.when('/projects/:id', {
					templateUrl 	: 'app/project/views/detail.html',
					controller 		: 'DetailProjectController',
					controllerAs	: 'detail'
				})
				.when('/projects/:id/edit', {
					templateUrl 	: 'app/project/views/edit.html',
					controller 		: 'EditProjectController',
					controllerAs	: 'edit',
					resolve				: {
						auth: function($rootScope, $q, $location, Project, $route){
							var dfd  = $q.defer();
							Project.getProject($route.current.params.id).then(function(response){
								if($rootScope.currentUser.id === response.project.creator._id){
									dfd.resolve();
								}else{
									console.log($route.current.params.id);
									dfd.reject();
									$location.url('/projects/' + $route.current.params.id);
								}
							});
							return dfd.promise;
						}
					}
				})
				.when('/users/:id/projects', {
					templateUrl 	: 'app/portfolio/views/portfolio.html',
					controller		: 'PortfolioController',
					controllerAs	: 'portfolio'
				})
				.when('/profile/:id', {
					templateUrl 	: 'app/profile/views/profile.html',
					controller		: 'ProfileController',
					controllerAs	: 'profile'
				})
				.when('/admin', {
					templateUrl 	: 'app/admin/views/admin.html',
					controller		: 'AdminController',
					controllerAs	: 'admin',
					resolve				: {
						auth: function(Auth, $q, $rootScope, $location){
							var dfd = $q.defer();
							
							if(Auth.isAdmin() != undefined){
								dfd.resolve();
							}else{
								dfd.reject();
								$location.url('/');
							}
							return dfd.promise;
						}
					}
				})
				.otherwise({redirectTo: '/'});

			$locationProvider.html5Mode(true);

		});
})();
