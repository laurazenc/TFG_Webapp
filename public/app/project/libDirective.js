(function(){
  'use strict';

  angular
    .module('app.project')
    .directive('dynamic', dynamic);

    dynamic.$inject = ['$compile'];
    function dynamic($compile){
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          if (element.next().length) {
            element.next().insertBefore(element);
          }

          var contentTr = angular.element('<tr><td>test</td></tr>');
          contentTr.insertAfter(element);
          $compile(contentTr)(scope);
        }
      };
    }
})();
