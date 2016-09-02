(function(){
  'use strict';

  angular
    .module('app.admin')
    .controller('AdminController', AdminController);

  AdminController.$inject = ['$scope','Admin','Notifier','ngDialog'];

  function AdminController($scope,Admin, Notifier, ngDialog) {
    var vm = this;

    vm.actual = "General";

    vm.goTo = function (actual) {
      vm.actual = actual;

      vm.generalSelector = false;
      vm.usersSelector = false;
      vm.projectsSelector = false;
      vm.commentsSelector = false;
      if(actual == "General"){
        vm.generalSelector = true;
      }else if(actual == "Usuarios"){
        vm.usersSelector = true;
      }else if(actual == "Proyectos"){
        vm.projectsSelector = true;
      }else if(actual == "Comentarios"){
        vm.commentsSelector = true;
      }
    }

    vm.generalSelector = true;
    vm.usersSelector = false;
    vm.proyectsSelector = false;
    vm.commentsSelector = false;

    vm.generalUser = [];
    vm.generalProjects = [];
    vm.generalComments = [];
    vm.generalUsers = Admin.lastUsers();
		vm.generalProjects = Admin.lastProjects();
		vm.generalComments = Admin.lastComments();

    vm.usersUsers = Admin.getUsers();
    vm.projectsProjects = Admin.getProjects();
    vm.commentsComments = Admin.getComments();


    $scope.sort = function(keyname){
      $scope.sortKey = keyname;   //set the sortKey to the param passed
      $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    function updateData(data){
       if(data == 'users'){
         vm.generalUsers = Admin.lastUsers();
         vm.usersUsers = Admin.getUsers();

       }else if(data == 'projects'){
         vm.generalProjects = Admin.lastProjects();
         vm.projectsProjects = Admin.getProjects();
       }else if(data == 'comments'){
         vm.generalComments = Admin.lastComments();
         vm.commentsComments = Admin.getComments();
       }

     }

    vm.updateRole = function(user){
      Admin.updateRole(user).then(function(response){
        if(response.success){
          updateData();
          Notifier.notify('success', 'Provilegio actualizado');
        }else{
          Notifier.error(response.reason);
        }
      });
    }

    vm.editUser = function(user){
      var isAdmin = "";
      var isTeacher = "";
      $scope.user = user;
      console.log($scope.user);

      if(user.isAdmin) isAdmin = "checked";
      if(user.isTeacher) isTeacher = "checked";

      ngDialog.openConfirm({
          template:
            '<form class="form-horizontal">' +
              '<h4>Detalles de Usuario</h4>' +
              '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Id </label>' +
                '<div class="col-sm-8">' +
                  '<input type="text" class="form-control" ng-model="user._id" readonly>' +
                '</div>' +
              '</div>' +
              '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Username </label>' +
                '<div class="col-sm-8">' +
                  '<input type="text" class="form-control" ng-model="user.username">' +
                '</div>' +
              '</div>' +
              '<div class="form-group">' +
                '<label for="email" class="col-sm-4 control-label">Email </label>' +
                '<div class="col-sm-8">' +
                  '<input type="email" class="form-control" ng-model="user.email"  id="email">' +
                '</div>' +
              '</div>' +
              '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Administrador </label>' +
                '<div class="col-sm-8">' +
                  '<label class="toggle"><input type="checkbox" name="isAdmin" ng-model="user.isAdmin"  class="toggle-checkbox"><div class="toggle-control"></div></label>' +
                '</div>' +
              '</div>' +
              '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Profesor </label>' +
                '<div class="col-sm-8">' +
                  '<label class="toggle"><input type="checkbox" name="isTeacher"  ng-model="user.isTeacher"  class="toggle-checkbox"><div class="toggle-control"></div></label>' +
                '</div>' +
              '</div>' +
            '</form>' +
            '<div class="ngdialog-buttons">' +
              '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>Guardar</button>' +
              '<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click=closeThisDialog("Cancel")>Cancel</button>' +
            '</div>',
          plain: true,
          className: 'ngdialog-theme-default',
          scope:$scope
      }).then(
        function(value) {
          Admin.updateRole($scope.user).then(function(response){
            if(response.success){
              updateData('users');
              delete $scope.user;
              Notifier.notify('success', 'Usuario actualizado');
            }else{
              Notifier.error(response.reason);
            }
          });
        }
      );
    }

    vm.deleteUser = function(user){

      ngDialog.openConfirm({
          template:
            '<div>' +
              '<h4>Eliminar Usuario</h4>' +
              '<h5>Al eliminar al usuario se perderán sus proyectos y comentarios. ¿ Desea continuar ?</h5>' +
              '</div>' +
            '<div class="ngdialog-buttons">' +
              '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>Eliminar</button>' +
              '<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click=closeThisDialog("Cancel")>Cancel</button>' +
            '</div>',
          plain: true,
          className: 'ngdialog-theme-default',
          scope:$scope
      }).then(
        function(value) {
          Admin.deleteUser(user._id).then(function(response){
            if(response.success){
              updateData('users');
              Notifier.notify('success', 'Usuario eliminado');
            }else{
              Notifier.error(response.reason);
            }
          });
        }
      );
    }

    vm.editProject = function(project){

      $scope.project = project;

      $scope.typeOptions  = [
        { value: "personal", text: "Personal"},
        { value: "educational", text: "Educativo"}
      ];

      ngDialog.openConfirm({
          template:
            '<form class="form-horizontal">' +
              '<h4>Detalles del Proyecto</h4>' +
              '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Id </label>' +
                '<div class="col-sm-8">' +
                  '<input type="text" class="form-control" ng-model="project._id" readonly>' +
                '</div>' +
              '</div>' +
              '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Creador </label>' +
                '<div class="col-sm-8">' +
                  '<input type="text" class="form-control" ng-model="project.creator.username" readonly>' +
                '</div>' +
              '</div>' +
              '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Titulo </label>' +
                '<div class="col-sm-8">' +
                  '<input type="text" class="form-control" ng-model="project.title">' +
                '</div>' +
              '</div>' +
              '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Tipo </label>' +
                '<div class="col-sm-8">' +
                  '<select class="btn btn-default dropdown-toggle" type="text" ng-model="project.type" name="type" ng-options="item.value as item.text for item in typeOptions"></select>' +
                '</div>' +
              '</div>' +
              '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Fecha </label>' +
                '<div class="col-sm-8">' +
                  '<input type="text" class="form-control" ng-model="project.created_at" readonly>' +
                '</div>' +
              '</div>' +
              '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Librerias </label>' +
                '<div class="col-sm-8">' +
                  '<div ng-repeat="lib in project.libs">' +
                    '<input type="text" class="form-control" ng-model="lib" readonly>' +
                  '</div>' +
                '</div>' +
              '</div>' +
              '<div class="form-group">' +
                '<label class="col-sm-4 control-label">HTML </label>' +
                '<div class="col-sm-8">' +
                  '<textarea type="text" class="form-control" ng-model="project.code[0].html"></textarea>' +
                '</div>' +
              '</div>' +
              '<div class="form-group">' +
                '<label class="col-sm-4 control-label">CSS </label>' +
                '<div class="col-sm-8">' +
                  '<textarea type="text" class="form-control" ng-model="project.code[0].css"></textarea>' +
                '</div>' +
              '</div>' +
              '<div class="form-group">' +
                '<label class="col-sm-4 control-label">JS </label>' +
                '<div class="col-sm-8">' +
                  '<textarea type="text" class="form-control" ng-model="project.code[0].js"></textarea>' +
                '</div>' +
              '</div>' +
            '</form>' +
            '<div class="ngdialog-buttons">' +
              '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>Guardar</button>' +
              '<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click=closeThisDialog("Cancel")>Cancel</button>' +
            '</div>',
          plain: true,
          className: 'ngdialog-theme-default',
          scope:$scope
      }).then(
        function(value) {
          Admin.updateProject($scope.project).then(function(response){
            if(response.success){
              updateData('projects');
              delete $scope.project;
              Notifier.notify('success', 'Proyecto actualizado');
            }else{
              Notifier.error(response.reason);
            }
          });
        }
      );
    }

    vm.deleteProject = function(project){

      ngDialog.openConfirm({
          template:
            '<div>' +
              '<h4>Eliminar Proyecto</h4>' +
              '<h5>¿ Seguro que desea eliminar el proyecto ?</h5>' +
              '</div>' +
            '<div class="ngdialog-buttons">' +
              '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>Eliminar</button>' +
              '<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click=closeThisDialog("Cancel")>Cancel</button>' +
            '</div>',
          plain: true,
          className: 'ngdialog-theme-default',
          scope:$scope
      }).then(
        function(value) {
          Admin.deleteProject(project).then(function(response){
            if(response.success){
              updateData('projects');
              Notifier.notify('success', 'Proyecto eliminado');
            }else{
              Notifier.error(response.reason);
            }
          });
        }
      );
    }


    vm.editComment = function(comment){

      $scope.comment = comment;

      ngDialog.openConfirm({
          template:
            '<form class="form-horizontal">' +
              '<h4>Detalles del Proyecto</h4>' +
              '<div class="form-group">' +
                '<label class="col-sm-2 control-label">Id </label>' +
                '<div class="col-sm-10">' +
                  '<input type="text" class="form-control" ng-model="comment._id" readonly>' +
                '</div>' +
              '</div>' +
              '<div class="form-group">' +
                '<label class="col-sm-2 control-label">Creador </label>' +
                '<div class="col-sm-10">' +
                  '<input type="text" class="form-control" ng-model="comment.creator.username" readonly>' +
                '</div>' +
              '</div>' +
              '<div class="form-group">' +
                '<label class="col-sm-2 control-label">Proyecto </label>' +
                '<div class="col-sm-10">' +
                  '<input type="text" class="form-control" ng-model="comment.project.title" readonly>' +
                '</div>' +
              '</div>' +
              '<div class="form-group">' +
                '<label class="col-sm-2 control-label">Comentario </label>' +
                '<div class="col-sm-10">' +
                  '<input type="text" class="form-control" ng-model="comment.content">' +
                '</div>' +
              '</div>' +
              '<div class="form-group">' +
                '<label class="col-sm-2 control-label">Fecha </label>' +
                '<div class="col-sm-10">' +
                  '<input type="text" class="form-control" ng-model="comment.created_at" readonly>' +
                '</div>' +
              '</div>' +
            '</form>' +
            '<div class="ngdialog-buttons">' +
              '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>Guardar</button>' +
              '<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click=closeThisDialog("Cancel")>Cancel</button>' +
            '</div>',
          plain: true,
          className: 'ngdialog-theme-default',
          scope:$scope
      }).then(
        function(value) {
          Admin.updateComment($scope.comment).then(function(response){
            if(response.success){
              updateData('comments');
              delete $scope.comment;
              Notifier.notify('success', 'Comentario actualizado');
            }else{
              Notifier.error(response.reason);
            }
          });
        }
      );
    }

    vm.deleteComment = function(comment){

      ngDialog.openConfirm({
          template:
            '<div>' +
              '<h4>Eliminar Comentario</h4>' +
              '<h5>¿ Seguro que desea eliminar el comentario ?</h5>' +
              '</div>' +
            '<div class="ngdialog-buttons">' +
              '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>Eliminar</button>' +
              '<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click=closeThisDialog("Cancel")>Cancel</button>' +
            '</div>',
          plain: true,
          className: 'ngdialog-theme-default',
          scope:$scope
      }).then(
        function(value) {
          Admin.deleteComment(comment).then(function(response){
            if(response.success){
              updateData('comments');
              Notifier.notify('success', 'Comentario eliminado');
            }else{
              Notifier.error(response.reason);
            }
          });
        }
      );
    }
  }
})();
