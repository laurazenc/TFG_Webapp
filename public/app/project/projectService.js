(function () {
	'use strict';

	angular
		.module('app.project')
		.factory('Project', Project);

		Project.$inject = ['$http', '$q', '$resource'];

		function Project($http, $q, $resource) {
			return {
				allProjects: allProjects,
				getProject: getProject,
				getUserProjects: getUserProjects,
				save: save,
				update: update,
				remove: remove
			}

			function allProjects() {
				return $resource('/api/projects/:_id');
			}

			function getProject(id){
				var dfd = $q.defer();
				$http.get('/api/projects/' + id)
					.then(viewProject)
					.catch(failView);

				return dfd.promise;

				function viewProject(response) {
					return dfd.resolve({success: true, project: response.data.project});
				}

				function failView(error) {
					return dfd.reject({success: false, reason: error.data});
				}

			}

			function getUserProjects(id){
				var dfd = $q.defer();
				$http.get('/api/users/' + id + '/projects')
					.then(viewProjects)
					.catch(failView);

				return dfd.promise;

				function viewProjects(response) {
					return dfd.resolve({success: true, projects: response.data.projects});
				}

				function failView(error) {
					return dfd.reject({success: false, reason: response.data.reason});
				}

			}

			function save(projectData){
				var dfd = $q.defer();
				$http.post('/api/projects', projectData)
					.then(addedProject)
					.catch(failAdd);

				return dfd.promise;

				function addedProject (response) {
					if(response.data.success){
						return dfd.resolve({success: true, id: response.data.id});
					}else{
						return dfd.reject({success: false, reason: response.data.reason});
					}
				}

				function failAdd (error) {
					return dfd.reject({success: false, reason: response.data.reason});
				}

			}


			function update(project){
				var dfd = $q.defer();
					$http.put('/api/projects/' + project.id, project)
					.then(viewProject)
					.catch(failView);

				return dfd.promise;

				function viewProject(response) {

					if(response.data.success){
						return dfd.resolve({success: true});
					}else{
						return dfd.reject({success: false, reason: response.data.reason});
					}
				}

				function failView(error) {

					return dfd.reject({success: false, reason: response.data.reason});
				}

			}

			function remove(id){
				var dfd = $q.defer();
				$http.delete('/api/projects/' + id)
					.then(deleteProject)
					.catch(failView);

				return dfd.promise;

				function deleteProject(response) {
					return dfd.resolve({success: true});
				}

				function failView(error) {
					console.log(error);
					return dfd.reject({success: false, reason: error.reason});
				}
			}

		}
})();
