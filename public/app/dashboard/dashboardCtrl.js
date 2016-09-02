(function () {
	'use strict';

	angular
		.module('app.dashboard')
		.controller('DashboardController', DashboardController);

	DashboardController.$inject = ['$filter', '$rootScope', '$scope', 'Auth', 'Project'];

	function DashboardController($filter, $rootScope, $scope, Auth, Project){
		var vm = this;
		vm.currentUser = $rootScope.currentUser;
		vm.isLoggedIn = Auth.isLoggedIn();

		vm.projects = [];
		getProjects();

		vm.sortOptions  = [
			{ value: "-created_at", text: "Ordenar por fecha"},
			{ value: "title", text: "Ordenar por título"}
		];
		vm.sortOrder  = vm.sortOptions[0].value;




		vm.typeOptions = [
			{ value: "personal", text: "General", description: "Proyectos añadidos por los usuarios."},
			{ value: "educational", text: "Educativo", description: "Ejercicios, tareas y ejemplos propuestos."}
		];
		vm.typeOrder = vm.typeOptions[0].value;
		vm.type = vm.typeOptions[0];

		$scope.$watch('dashboard.typeOrder', function(nv){

			if(nv === 'personal'){
				vm.type = vm.typeOptions[0];
			}else{
				vm.type = vm.typeOptions[1];
			}

		});



		function getProjects() {
			vm.projects = Project.allProjects().query({type: vm.typeOrder});
		}
	}

})();
