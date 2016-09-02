(function () {
  'use strict';

  angular
    .module('app.admin')
    .factory('Admin', Admin);

  Admin.$inject = ['User', 'Project', 'Comment', '$q', '$http'];

  function Admin(User, Project, Comment, $q,$http){
    return {
      lastUsers: lastUsers,
      lastProjects: lastProjects,
      lastComments: lastComments,
      getUsers: getUsers,
      getProjects: getProjects,
      getComments: getComments,
      updateRole: updateRole,
      deleteUser: deleteUser,
      updateProject: updateProject,
      deleteProject: deleteProject,
      updateComment: updateComment,
      deleteComment: deleteComment
    };

    function lastUsers(){
      return User.allUsers().query({limit: 5});
    }
    function lastProjects(){
      return Project.allProjects().query({limit: 5});
    }
    function lastComments(){
      return Comment.allComments().query({limit: 5});
    }

    function getUsers(){
      return User.allUsers().query();
    }
    function getProjects(){
      return Project.allProjects().query();
    }
    function getComments(){
      return Comment.allComments().query();
    }

    function updateRole(user){
      var dfd = $q.defer();
      $http.put('/api/users/:id', user)
        .then(viewUser)
        .catch(failView);
      return dfd.promise;

      function viewUser(response) {
        if(response.data.success){
          return dfd.resolve({success: true});
        }else{
          return dfd.reject({success: false, data: response.data.reason});
        }
      }

      function failView(error) {
        return dfd.reject({success: false, reason: response.data.reason});
      }

    }

    function deleteUser(user){

      var dfd = $q.defer();
      $http.delete('/api/users/' + user)
        .then(viewUser)
        .catch(failView);
      return dfd.promise;

      function viewUser(response) {
        if(response.data.success){
          return dfd.resolve({success: true});
        }else{
          return dfd.reject({success: false, data: response.data.reason});
        }
      }

      function failView(error) {
        return dfd.reject({success: false, reason: error.data.reason});
      }
    }

    function updateProject(project){
      var dfd = $q.defer();
      $http.put('/api/projects/:id', project).then(function(response){
        if(response.data.success){
          dfd.resolve({success: true});
        }else{
          console.log(response);
          dfd.resolve({success: false, data: response.data.reason});
        }
      });
      return dfd.promise;
    }

    function deleteProject(project){
      var dfd = $q.defer();
       Project.remove(project._id).then(function(response){
        if(response.success){
          dfd.resolve({success: true});
        }else{
          dfd.resolve({success: false, data: response.reason});
        }
      });
      return dfd.promise;
    }

    function updateComment(comment){
      var dfd = $q.defer();
      Comment.update(comment).then(function(response){
        if(response){
          dfd.resolve({success: true});
        }else{
          dfd.resolve({success: false, data: response.reason});
        }
      });
      return dfd.promise;
    }

    function deleteComment(comment){
      var dfd = $q.defer();
       Comment.remove(comment).then(function(response){
        if(response){
          dfd.resolve({success: true});
        }else{
          dfd.resolve({success: false, data: response.reason});
        }
      });
      return dfd.promise;
    }
  }

})();
