(function () {
	'use strict';

	angular
    .module('app.portfolio')
    .controller('PortfolioController', PortfolioController);

    PortfolioController.$inject = ['$scope', 'Project', '$routeParams', 'Comment', 'Notifier', 'socketio'];

    function PortfolioController ($scope, Project, $routeParams, Comment, Notifier, socketio) {
			var vm = this;
			vm.projects = [];
			vm.comments = [];
			vm.edit = edit;
			vm.remove = remove;

			getProjects();
			getComments();

			function getProjects(){
				Project.getUserProjects($routeParams.id).then(function(response){
					if(response.success){
						vm.projects =  response.projects;
					}else{
						vm.projects = [];
					}
				});
			}

			function getComments(){
				/*Comment.getUserComments($routeParams.id).then(function(response){
					if(response.success){
						vm.comments =  response.comments;
					}else{
						vm.comments = [];
					}

				});*/
				vm.comments = Comment.allComments().query({creator: $routeParams.id});
			}

			function edit(comment){
				console.log(comment);
	      Comment.update(comment).then(function(response){
	  			if(response.success){
	  				Notifier.notify('success', "Comentario editado");

	  			}else{
	  				Notifier.error("Algo ha ido mal. Intentalo de nuevo.");
	  			}
	  		});
	    }

	    function remove(comment){
	      Comment.remove(comment).then(function(response){
	  			if(response.success){
	  				Notifier.notify('success', "Comentario eliminado");
	  			}else{
	  				Notifier.error("Algo ha ido mal. Intentalo de nuevo.");
	  			}
	  		});
	    }

			socketio.on('delete', function(index){
				for (var i = vm.comments.length - 1; i >= 0; i--) {
						if (vm.comments[i]._id == index) {
							vm.comments.splice(i, 1);
						}
				};
			});

    }



})();
