(function () {
	'use strict';
	angular
		.module('app.session')
		.factory('Auth', Auth);

	Auth.$inject = ['$window', '$http', '$q', 'AuthToken', '$rootScope'];

	function Auth($window, $http, $q, AuthToken,$rootScope ) {
		var authFactory = {
			signup : signup,
			login : login,
			logout : logout,
			isLoggedIn : isLoggedIn,
			getUser: getUser,
			isAdmin : isAdmin
		};

		return authFactory;

		function signup(user) {
			var dfd = $q.defer();
			$http.post('/api/signup', user)
				.then(setSessionToken)
				.catch(failSignUp);

			return dfd.promise;

			function setSessionToken(response){
				if(response.data.success){
					AuthToken.setToken(response.data.token);
					$rootScope.currentUser = response.data.user;
					dfd.resolve({success: true, token: response.data.token, user: response.data.user});
				}else{

					dfd.reject({success: false, reason: response});
				}
			}

			function failSignUp(e) {
				dfd.reject({success: false, reason: e.data.reason});
			}
		}

		function login(email, password) {
			var dfd = $q.defer();
			$http.post('/api/login', {
				email: email,
				password: password
			})
			.then(setSessionToken)
			.catch(failLogin);

			return dfd.promise;

			function setSessionToken(response){

				if (response.data.success) {
					AuthToken.setToken(response.data.token);
					$rootScope.currentUser = response.data.user;
					dfd.resolve({success: true});
				} else {
					dfd.reject({success: false, reason: response.data.reason});
				}
			}

			function failLogin(e) {
				
				dfd.reject({success: false, reason: e.data.reason});
			}

		}

		function logout() {
			AuthToken.setToken();
		}

		function isLoggedIn() {
			if (AuthToken.getToken() != null) {
				return true;
			}	else {
				return false;
			}
		}

		function getUser() {

			var dfd = $q.defer();
			if(AuthToken.getToken() != null){
					$http.get('/api/me')
						.then(function (response) {
							$rootScope.currentUser = response.data;
							dfd.resolve({success: true, user: response.data});
						})
						.catch(function () {
							dfd.reject({success: false});
						});

			}else{
				dfd.reject({success: false});
			}

			return dfd.promise;

		}

		function isAdmin() {

			if($rootScope.currentUser != undefined){
				return $rootScope.currentUser.isAdmin;
			}else{
				this.getUser().then(function(){
					return $rootScope.currentUser.isAdmin;
				});
			}
		}


	}
})();
