(function() {
  'use strict';

  angular.module('app.comment')
  .filter('reverse', function () {
  	return function (items) {
  		return items.slice().reverse();
  	}
  });

})();
