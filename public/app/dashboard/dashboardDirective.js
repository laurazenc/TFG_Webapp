(function () {
	'use strict';
	
	angular
		.module('app.dashboard')
		.directive('theframe', theframe);
		
		theframe.$inject = ['$compile', '$timeout'];
		
		function theframe($compile, $timeout) {
			  return {
					restrict: 'AE',
					scope: {
						 theframe: '='
					},
					template: '<iframe id="frame" scrolling="no"></iframe>',
					link: function($scope, element, attrs) {

						var cpy = '<style>*, *::before, *::after { animation-play-state: paused !important; }</style>';
						cpy += '<script> window.console = window.console || function(t) {}; window.open = function(){ console.log("window.open is disabled."); }; window.print= function(){ console.log("window.print is disabled."); }; window.alert   = function(){ console.log("window.alert is disabled."); }; window.confirm = function(){ console.log("window.confirm is disabled."); }; window.prompt  = function(){ console.log("window.prompt is disabled."); }; window.Notification = function() { console.log("HTML5 notifications are disabled."); }; </script>';
						cpy += '<script> (function() { window.onerror = function() { return true; }; if (typeof (AudioContext) != "undefined") { AudioContext = function() { return false; }; } if (typeof (webkitAudioContext) != "undefined") { webkitAudioContext = function() { return false; }; } if (typeof (mozAudioContext) != "undefined") { mozAudioContext = function() { return false; }; } if ("speechSynthesis" in window) { window.speechSynthesis = {}; } if ("speak" in speechSynthesis) { speechSynthesis.speak = function() { return false; }; } navigator.webkitGetUserMedia = function() { }; var __animationDuration = 4000; var __animationsTimedOut = false; var __animationRequests = []; var __requestAnimationFrame = false; var __cancelAnimationFrame = false; var x, i; var vendorsReqestAnimationFrame = [ "requestAnimationFrame", "mozRequestAnimationFrame", "webkitRequestAnimationFrame" ]; for (x = 0; x < vendorsReqestAnimationFrame.length; x++) { if (!__requestAnimationFrame) { __requestAnimationFrame = window[vendorsReqestAnimationFrame[x] ]; } } __cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame; function __reqFrame(callback, element) { var timerID; if (__animationsTimedOut) { return 0; } else { timerID = __requestAnimationFrame(callback, element); __animationRequests.push(timerID); return timerID; } } for (x = 0; x < vendorsReqestAnimationFrame.length; x++) { window[vendorsReqestAnimationFrame[x]] = __reqFrame; } setTimeout(function() { for (i = 0; i < __animationRequests.length; i++) { __cancelAnimationFrame(__animationRequests[i]); } var ss = window.document.createElement("style"); ss.textContent = "*, *::before, *::after { animation-play-state: paused !important; }"; var ref = window.document.getElementsByTagName("script")[0]; ref.parentNode.insertBefore(ss, ref); __animationsTimedOut = true; }, __animationDuration, "push"); window.setInterval = (function(oldSetInterval) { var registered = []; function f(a,b) { if (this.timedOut) { return 0; } else { return registered[ registered.length ] = oldSetInterval(a,b); } } f.clearAll = function() { var r; while (r = registered.pop()) { clearInterval( r ); } this.timedOut = true; }; f.timedOut = false; return f; }(window.setInterval)); window.setTimeout = (function(oldSetTimeout) { var registered = []; function f(a,b, push) { if (this.timedOut && typeof(push) == "undefined") { return 0; } else { if (push) { return oldSetTimeout(a,b); } else { return registered[ registered.length ] = oldSetTimeout(a,b); } } } f.clearAll = function() { var r; while (r = registered.pop()) { clearTimeout( r ); } this.timedOut = true; }; f.timedOut = false; return f; }(window.setTimeout)); setTimeout(function() { setTimeout.clearAll(); setInterval.clearAll(); }, __animationDuration, "push"); }()); </script>';

						var bdy = '<script> (function() { setTimeout(function() { if(typeof(_l) == "undefined") { if(window.stop !== undefined) window.stop(); else if(document.execCommand !== undefined) document.execCommand("Stop", false); } }, 2000, "push"); function pauseAnimations() { var body = document.getElementsByTagName("body")[0]; if(body.addEventListener) { body.addEventListener("webkitAnimationStart", listener, false); body.addEventListener("webkitAnimationIteration", listener, false); body.addEventListener("animationstart", listener, false); body.addEventListener("animationiteration", listener, false); } } function listener(e) { if(e.type == "webkitAnimationStart" || e.type == "webkitAnimationIteration") { var targetEl = e.target; setTimeout(function() { targetEl.style.webkitAnimationPlayState = "paused"; }, __animationDuration, "push"); } else if(e.type == "animationstart" || e.type == "animationiteration") { var targetEl = e.target; setTimeout(function() { targetEl.style.MozAnimationPlayState = "paused"; }, __animationDuration, "push"); } } pauseAnimations(); function pauseElementTypes(type) { for (var i = 0, els = document.getElementsByTagName(type); i < els.length; i++) { els[i].pause(); } } setTimeout(function() { pauseElementTypes("audio"); pauseElementTypes("video"); }, 100); }()); </script> <script> if (document.location.search.match(/type=embed/gi)) { window.parent.postMessage("resize", "*"); } </script>';

						element.find('#frame').contents().find('head')[0].innerHTML = '<style>'+$scope.theframe.code[0].css+'</style>' + cpy;
						element.find('#frame').contents().find('body')[0].innerHTML =  $scope.theframe.code[0].html + '<script> (function(){ \n' + $scope.theframe.code[0].js + '\n})();</script>' + bdy;

        var timeout = setInterval(function(){
          if ((element.find('#frame').contents().find('head')[0]) != null) {
            element.find('#frame').contents().find('body')[0].innerHTML =  $scope.theframe.code[0].html + '<script> (function(){ \n' + $scope.theframe.code[0].js + '\n})();</script>'+ bdy;
            element.find('#frame').contents().find('head')[0].innerHTML = '<style>'+$scope.theframe.code[0].css+'</style>' + cpy;
          }else{
             element.find('#frame').contents().find('body').innerHTML =  $scope.theframe.code[0].html + '<script> (function(){ \n' + $scope.theframe.code[0].js + '\n})();</script>'+ bdy;
             element.find('#frame').contents().find('head').innerHTML = '<style>'+$scope.theframe.code[0].css+'</style>' + cpy;
          }
        }, 5000);
    }

  }
		}
										
})();