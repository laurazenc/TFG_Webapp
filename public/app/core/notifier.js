(function () {
	'use strict';
	
	angular
		.module('app.core')
		.factory('Notifier', Notifier);
	
	Notifier.$inject = ['toasty'];
	
	function Notifier(toasty) {
		return {
			notify: notify,
			error: error
		};
		
		function notify(type, message) {
			if (type === 'success') {
				toasty.success({
					title: 'Success!',
					msg: message,
					showClose: true,
					clickToClose: true,
					position: 'top-right',
					timeout: 3000,
					sound: false,
					html: true,
					shake: false,
					theme: 'bootstrap'
				});
			} else if (type === 'info') {
				toasty.info({
					title: 'Info',
					msg: message,
					showClose: true,
					clickToClose: true,
					position: 'top-right',
					timeout: 3000,
					sound: false,
					html: true,
					shake: false,
					theme: 'bootstrap'
				});
			}
		}

		function error(message) {
			toasty.error({
				title: 'Error!',
				msg: message,
				showClose: true,
				clickToClose: true,
				position: 'top-right',
				timeout: 5000,
				sound: false,
				html: true,
				shake: false,
				theme: 'bootstrap'
			});
		}
		
	}
	
})();