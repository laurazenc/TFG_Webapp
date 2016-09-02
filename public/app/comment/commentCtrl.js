(function () {
  'use strict';

  angular
    .module('app.comment')
    .controller('CommentController', CommentController);

  CommentController.$inject = ['Comment', 'socketio',  '$scope', 'Project', '$routeParams', '$rootScope', 'Notifier'];

  function CommentController(Comment, socketio,  $scope, Project, $routeParams, $rootScope, Notifier){
    var vm = this;

    vm.addComment = addComment;
    vm.enterComment = enterComment;
    vm.editComment = editComment;
    vm.deleteComment = deleteComment;

    vm.currentUser = $rootScope.currentUser;

    vm.project = {};

    vm.error = '';

    vm.ProjectComments = [];
    vm.AllComments = [];
    vm.UserComments = [];

    Comment.getProjectComments($routeParams.id).then(function(response){
      if(response.success){
        vm.ProjectComments = response.comments;
      }else{
        vm.ProjectComments = [];
      }
    });




    vm.isAuthor = function (comment){
      return (comment.creator._id === comment.project.creator)
    }

    vm.isWriter = function(comment){
      return (vm.currentUser.id === comment.creator._id);
    };

    function addComment(){
      vm.error = '';
      var newComment = {
        content: (vm.newComment).trim(),
        project: $routeParams.id
      };

      if(newComment.content != ''){
        Comment.save(newComment).then(function(response){
          if(response.success){
            Notifier.notify('success', "Comentario añadido");
            delete $scope.newComment;
          }else{
            Notifier.error("Algo ha ido mal. Intentalo de nuevo.");
          }
        });
      }else{
        vm.error = 'No puedes publicar un mensaje vacío.';
      }

    }

    function enterComment(event){
      vm.error = '';
      if(event && (event.which === 13) && vm.newComment){
        var newComment = {
    			content: (vm.newComment).trim(),
    			project: $routeParams.id
    		};

    		Comment.save(newComment).then(function(response){
    			if(response.success){
    				Notifier.notify('success', "Comentario añadido");
    				delete $scope.newComment;
    			}else{
    				Notifier.error("Algo ha ido mal. Intentalo de nuevo.");
    			}
    		});
      }else if(event && (event.which === 13) && vm.newComment == ''){
        vm.error = 'No puedes publicar un mensaje vacío.';
        Notifier.error(vm.error);
      }
    }

    function editComment(comment){

      vm.error = '';
      if(comment.content != ''){
        Comment.update(comment).then(function(response){
          if(response.success){
            Notifier.notify('success', "Comentario editado");

          }else{
            Notifier.error("Algo ha ido mal. Intentalo de nuevo.");
          }
        });
      }else{
        vm.error = 'No puedes publicar un mensaje vacío.';
        Notifier.error(vm.error);
      }
    }

    function deleteComment(comment){
      Comment.remove(comment).then(function(response){
        
  			if(response.success){
  				Notifier.notify('success', "Comentario eliminado");
  			}else{
  				Notifier.error("Algo ha ido mal. Intentalo de nuevo.");
  			}
  		});
    }

    socketio.on('comment', function(msg){
  		vm.ProjectComments.push(msg);
  	});

  	socketio.on('delete', function(index){
  		for (var i = vm.ProjectComments.length - 1; i >= 0; i--) {
  				if (vm.ProjectComments[i]._id == index) {
  			    vm.ProjectComments.splice(i, 1);
          }
      };
  	});

  }
})();
