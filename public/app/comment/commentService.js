(function () {
	'use strict';

	angular
		.module('app.comment')
		.factory('Comment', Comment);

  Comment.$inject = ['$http', '$resource', '$q'];

  function Comment ($http, $resource, $q) {
    return {
			allComments: allComments,
			getComment: getComment,
			getUserComments: getUserComments,
			getProjectComments: getProjectComments,
			save: save,
			update: update,
			remove: remove
    };

		function allComments (){
				return $resource('/api/comments');
		}


		function getComment(id){
			var dfd = $q.defer();
			$http.get('/api/comments/' + id)
				.then(viewComment)
				.catch(failView);

			return dfd.promise;

			function viewComment(response) {
				return dfd.resolve({success: true, comment: response.data.project});
			}

			function failView(error) {
				return dfd.reject({success: false, reason: response.data.reason});
			}
		}

		function getUserComments(id){
			var dfd = $q.defer();
			$http.get('/api/comments/',{
				creator: id
			})
				.then(viewComments)
				.catch(failView);

			return dfd.promise;

			function viewComments(response) {
				return dfd.resolve({success: true, comments: response.data});
			}

			function failView(error) {
				console.log(error);
				return dfd.reject({success: false, reason: error.data.reason});
			}
		}

		function getProjectComments(id){
			var dfd = $q.defer();

			$http.get('/api/comments?project=' + id)
				.then(viewComments)
				.catch(failView);

			return dfd.promise;

			function viewComments(response) {
				return dfd.resolve({success: true, comments: response.data});
			}

			function failView(error) {
				return dfd.reject({success: false, reason: error.data.reason});
			}
		}

		function save(comment){
			var dfd = $q.defer();
			$http.post('/api/comments/', comment)
				.then(viewComments)
				.catch(failView);

			return dfd.promise;

			function viewComments(response) {

				return dfd.resolve({success: true, comment: response.data});
			}

			function failView(error) {
				return dfd.reject({success: false, reason: error.data.reason});
			}
		}

		function update(comment){

			var dfd = $q.defer();
			$http.put('/api/comment/' + comment._id, comment)
				.then(viewComments)
				.catch(failView);

			return dfd.promise;

			function viewComments(response) {
				return dfd.resolve({success: true, comment: response.data.comment});
			}

			function failView(error) {
				return dfd.reject({success: false, reason: error.data.reason});
			}
		}

		function remove(comment){
			var dfd = $q.defer();
			$http.delete('/api/comment/' + comment._id)
				.then(viewComments)
				.catch(failView);

			return dfd.promise;

			function viewComments(response) {

				if(response.data.success){
					return dfd.resolve({success: true});
				}else{
					return dfd.reject({success: false, reason: response.data.reason});
				}
			}

			function failView(error) {				
				return dfd.reject({success: false, reason: error.data.reason});
			}
		}
  }

})();
