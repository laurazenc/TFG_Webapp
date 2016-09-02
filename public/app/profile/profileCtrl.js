(function(){
  'use strict';

  angular
    .module('app.profile')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$scope', '$routeParams', '$route', '$rootScope', '$location', 'Notifier', 'User', 'Project', 'Auth', 'ngDialog'];

  function ProfileController($scope, $routeParams, $route, $rootScope, $location, Notifier, User, Project, Auth, ngDialog){
    var vm = this;
    var cvm = $scope.$new();
		vm.currentUser = $rootScope.currentUser;

    vm.user = {};
    vm.userInfo = {};
    vm.project = [];
    vm.isCreator = isCreator;
    vm.update = update;
    vm.remove = remove;

    getUser();
    getProjects();

    function getUser() {
      User.getUser($routeParams.id)
        .then(function(response){
          if(response.success){
            vm.user = response.user;
            vm.userInfo = response.user;
          }
        })
        .catch(function(error){
          Notifier.error(error.reason);
          $location.path('/');
        });
    }

    function getProjects(){
      Project.getUserProjects($routeParams.id).then(function(response){
        if(response.success){
          vm.projects =  response.projects;
        }else{
          vm.projects = [];
        }
      });
    };

    function isCreator(){
      return ($routeParams.id === vm.currentUser.id);
    }

    function update(){
      var userData = {
        id: vm.user.id,
        username: vm.user.username,
        email: vm.user.email
      }
      if(vm.password != undefined && vm.password.length > 0){
        userData.password = vm.password;
      }

      User.checkEmail(vm.user.email).then(function(response){

        if(response.user != null && response.user._id != vm.user.id){
          User.getUser($routeParams.id).then(function(response){
            vm.user = response.user;
          });
          Notifier.error('Ese email ya está registrado por otro usuario');
        }else{
          User.update(userData).then(function(response){
            User.getUser($routeParams.id).then(function(response){
              vm.user = response.user;
            });
            if(response.success){
              $rootScope.currentUser = response.user;

              Notifier.notify('success','Perfil actualizado');

            }else{
              Notifier.error(response.data.reason);
            }

          });
        }
      });

    }

    function remove(){
      ngDialog.openConfirm({
          template:
            '<div>' +
            '<h4>Al eliminar la cuenta de usuario todos sus proyectos y comentarios se borrarán, ¿Desea continuar?</h4>' +
            '<div class="ngdialog-buttons">' +
              '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>Eliminar</button>' +
              '<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click=closeThisDialog("Cancel")>Cancel</button>' +
            '</div>' +
            '</div>',
          plain: true,
          className: 'ngdialog-theme-default'
      }).then(
  			function(value) {
          User.remove($routeParams.id).then(function(response){
            if(response.success){
              Auth.logout();
              Notifier.notify('info', 'Usuario eliminado');
              $location.path('/login');

            }else{
              Notifier.error(response.reason);
            }
          });
        }
      );
    }
  }
})();
