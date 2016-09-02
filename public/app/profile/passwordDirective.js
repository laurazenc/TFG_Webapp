(function(){
  'use strict';

  angular
    .module('app.profile')
    .directive('validPasswordC', validPasswordC);

    //validPasswordC.$inject = ['scope', 'elm', 'attrs', 'ctrl'];

    function validPasswordC() {
      return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
          ctrl.$setValidity('noMatch', true);
          attrs.$observe('validPasswordC', function (newVal) {
              if (newVal === 'true') {
                  ctrl.$setValidity('noMatch', true);
              } else {
                  ctrl.$setValidity('noMatch', false);
              }
          });
        }
      }
    }
})();
