(function () {
	'use strict';

	angular
		.module('app.session')
		.controller('SessionController', SessionController);

	SessionController.$inject = ['$rootScope', '$location', 'Auth', 'Notifier', '$scope'];

	function SessionController($rootScope, $location, Auth, Notifier, $scope) {
		var vm = this;

		vm.signUp = signUp;
		vm.doLogin = doLogin;
		vm.doLogout = doLogout;

		$rootScope.currentUser = undefined;
		vm.currentUser = $rootScope.currentUser;
		vm.isLoggedIn = false;
		vm.isAdmin = false;
		vm.init = init;
		vm.error = undefined;
		init();

		function init(){

			Auth.getUser().then(function(response){
				if(response.success){
					$rootScope.currentUser = response.user;
					vm.currentUser = $rootScope.currentUser;
					vm.isAdmin = vm.currentUser.isAdmin;
				}
			});
			vm.isLoggedIn = Auth.isLoggedIn();
			vm.error = "";
		}

		$rootScope.$on('$routeChangeStart', function (){
			init();
		});

		function validateEmail(email) {
	    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
		}

		function validateUsername(username) {
			if(username != undefined){
				return ((username.length > 2) && (username.length < 51));
			}else{
				return false;
			}
		}

		function validatePassword(pass) {
			if(pass != undefined){
	    	return ((pass.length > 4) && (pass.length < 11));
			}else{
				return false;
			}
		}

		function signUp() {
			vm.error = '';

			if(!validateEmail(vm.email)){
				vm.error += 'El email no es válido. \n';
			}
			if(!validateUsername(vm.username)){
				vm.error += 'El nombre de usuario debe tener entre 3 y 50 caracteres. \n';
			}
			if(!validatePassword(vm.password)){
				vm.error += 'La contraseña debe tener entre 5 y 10 caracteres. \n';
			}

			if(vm.error === ''){

				var newUser = {
					email: vm.email,
					username: vm.username,
					password: vm.password
				}

				Auth.signup(newUser)
					.then(function(response){
						if(response.success){
							init();
							delete vm.email;
							delete vm.username;
							delete vm.password;
							delete vm.confirmPassword;
							Notifier.notify('success', 'Usuario registrado en el sistema!');
							$location.path('/');
						}else{
							Notifier.error(response.data.data.reason);
						}
					})
					.catch(function(error){
						Notifier.error(error.reason);
					});
			}else{
				Notifier.error(vm.error);

			}


		}

		function doLogin() {
			vm.error = '';

			if(!validateEmail(vm.email)){
				vm.error += 'El email no es válido. \n';
			}
			if(!validatePassword(vm.password)){
				vm.error += 'La contraseña debe tener entre 5 y 10 caracteres. \n';
			}

			if(vm.error === ''){

				Auth.login(vm.email, vm.password)
					.then(function(response){

						if(response.success){
							init();
							delete vm.email;
							delete vm.password;
							Notifier.notify('success', 'Bienvenido al sistema!');
							$location.path('/');
						} else {
							Notifier.error(response.data.reason);
						}
					})
					.catch(function(error){
						Notifier.error(error.reason);
					});
			}else{
				Notifier.error(vm.error);
			}
		}

		function doLogout(){
			Auth.logout();
			init();
			delete $rootScope.currentUser;
			delete vm.currentUser;
			Notifier.notify('info', 'You\'ve Successfully logged out!');
			$location.path('/dashboard');
		}

	}

})();
