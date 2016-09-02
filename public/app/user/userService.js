(function(){
  'use strict';

  angular
    .module('app.user')
    .factory('User', User);

    User.$inject = ['$http', '$q', '$resource', 'AuthToken'];

    function User($http, $q, $resource, AuthToken){
      return{
        getUser: getUser,
        allUsers: allUsers,
        checkEmail: checkEmail,
        update: update,
        remove: remove
      };

      function getUser(id){
        var dfd = $q.defer();
				$http.get('/api/users/' + id)
					.then(viewUser)
					.catch(failView);

				return dfd.promise;

				function viewUser(response) {
          return dfd.resolve({success: true, user: response.data});
				}

				function failView(error) {
          return dfd.reject({success: false, reason: error.data.message});
				}
      }

      function allUsers(){
    		return $resource('/api/users');
      }

      function checkEmail(email){

        var dfd = $q.defer();
				$http.get('/api/user?email=' + email)
					.then(viewUser)
					.catch(failView);

				return dfd.promise;

				function viewUser(response) {
          return dfd.resolve({success: true, user: response.data.user});
				}

				function failView(error) {
          return dfd.reject({success: false, reason: response.data.reason});
				}
      }


      function update(userData){

    		var dfd = $q.defer();
    		$http.put('/api/users/:id', userData)
          .then(viewUser)
          .catch(failView);
    		return dfd.promise;

        function viewUser(response) {

          if(response.data.success){
            AuthToken.setToken(response.data.token);
            return dfd.resolve({success: true, user: response.data.user});
          }else{
            return dfd.reject({success: false, data: response.data.reason});
          }
				}

        function failView(error) {
          
          return dfd.reject({success: false, reason: response.data.reason});
        }


      }

      function remove(id){

    		var dfd = $q.defer();
    		$http.delete('/api/users/' + id)
          .then(viewUser)
          .catch(failView);
    		return dfd.promise;

        function viewUser(response) {
          if(response.data.success){
            AuthToken.setToken();
            return dfd.resolve({success: true});
          }else{
            return dfd.reject({success: false, data: response.data.reason});
          }
				}

        function failView(error) {
          return dfd.reject({success: false, reason: error.data.reason});
        }


      }
    }
})();
