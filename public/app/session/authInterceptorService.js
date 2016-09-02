(function () {
	'use strict';

	angular
		.module('app.session')
		.factory('AuthInterceptor', AuthInterceptor);

	AuthInterceptor.$inject = ['$location', '$q', 'AuthToken'];

	function AuthInterceptor($location, $q, AuthToken) {
		var authInterceptorFactory = {
			request : request,
			responseError : responseError
		};

		return authInterceptorFactory;

		function request(config) {
			var token = AuthToken.getToken();
			if(token){
				config.headers['x-access-token'] = token;
			}
			return config;
		}

		function responseError(response) {
			if(response.status == 403) $location.path('/');
			return $q.reject(response);
		}
	}

})();
