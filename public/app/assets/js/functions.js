$(function(){

	// Toggle Responsive Menu
	//toggleHeaderMenu();

	$('.editName').on('mousedown click moseup',function(){
		setTimeout(function(){
			$('.inputName').focus();
		}, 1);
	});

	$('.editDesc').on('mousedown click moseup',function(){
		setTimeout(function(){
			$('.inputDesc').focus();
		}, 1);
	});

	$('.editEmail').on('mousedown click moseup',function(){
		setTimeout(function(){
			$('.inputEmail').focus();
		}, 1);
	});

	toggleHeaderMenu();

	function toggleHeaderMenu(){
		var $dependentTask = $(".navbar-management");
		$('.menu-icon').click(function () {
			console.log('clcik');
			$dependentTask.toggleClass('active-menu');
		});
	}



});

$(document).ready(function () {
	var offset = 250;

	var duration = 300;

	$(window).scroll(function() {

		if ($(this).scrollTop() > offset) {

			$('.back-to-top').fadeIn(duration);

		} else {

			$('.back-to-top').hide(duration);
		}
	});


});
