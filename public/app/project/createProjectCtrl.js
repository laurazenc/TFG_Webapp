(function () {
	'use strict';

	angular
		.module('app.project')
		.controller('CreateProjectController', CreateProjectController);

	CreateProjectController.$inject = ['$compile', '$location', '$routeParams', '$scope', '$rootScope', 'Project', 'Notifier'];

	function CreateProjectController($compile, $location, $routeParams, $scope, $rootScope, Project, Notifier) {
		$scope.project = {};
		$scope.libs = [];
	  $scope.typeOptions  = [
	    { value: "personal", text: "Personal"},
	    { value: "educational", text: "Educativo"}
	  ];

	  $scope.type  = $scope.typeOptions[0].value;
		$scope.currentUser = $rootScope.currentUser;




	  var style = document.getElementById('style');
	//  var script = document.getElementById('script');
	  var jQ = document.getElementById('jQ');

	  var view = document.getElementById('view');
	  var viewDocument = view.contentDocument || view.contentWindow.document;
		var script = viewDocument.createElement("script");
		script.type = "text/javascript";

		var body = viewDocument.getElementsByTagName('body')[0];
	  var head = viewDocument.getElementsByTagName('head')[0];
	  var widgets = [];
	  var mode = {
	      css: 'text/css',
	      html: 'text/html',
	      js: 'javascript'
	  };
		var delay;
		var loadScript = document.createElement('script');
		loadScript.innerHTML = "var $ = parent.$; console.log('loaded');";
		// var libScript = document.createElement('script');
		// libScript.setAttribute('src', '//cdnjs.cloudflare.com/ajax/libs/gsap/1.18.0/TweenMax.min.js');
		var libScript2 = document.createElement('script');
		libScript2.setAttribute('src', 'http://assets.codepen.io/assets/editor/live/console_runner-ba402f0a8d1d2ce5a72889b81a71a979.js');
		// var libScript3 = document.createElement('script');
		// libScript3.setAttribute('src', 'http://assets.codepen.io/assets/editor/live/events_runner-d004902542b6f6191b16aa6145ed1d9c.js');
		// var libScript4 = document.createElement('script');
		// libScript4.setAttribute('src', 'http://assets.codepen.io/assets/common/everypage-ae09556f85329bd489d22a2bed9267d9.js');



		var codeHTML = '';
		var codeCSS = '';
		var codeJS = '';
		var libsArray = $scope.libs;

		setTimeout(updatePreview(codeHTML, codeCSS, codeJS, libsArray), 300);

		function updatePreview(codeHTML, codeCSS, codeJS, libsArray) {
			var view = document.getElementById('view');
		  var viewDocument = view.contentDocument || view.contentWindow.document;

			var codeHTML = (codeHTML === undefined) ? '' : codeHTML;
			var codeCSS = (codeCSS === undefined) ? '' : codeCSS;
			var codeJS = (codeJS === undefined) ? '' : codeJS;

			viewDocument.open();
			viewDocument.write('<style type="text/css">' + codeCSS + '</style>');
			viewDocument.write('<script type="text/javascript" src="http://code.jquery.com/jquery-1.10.0.min.js"></script>');
			for(var i=0; i<libsArray.length; ++i){
					viewDocument.write('<script type="text/javascript" src="'+ libsArray[i] +'"></script>');
			}
			viewDocument.write(codeHTML);
			viewDocument.write('<script type="text/javascript">' + codeJS + '</script>');
			viewDocument.close();
		}


		var libList = document.getElementById('lib-list');
		var URLpattern = /(ftp|http|https)?:?\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

		function checkList(){
			var libEntry = $('.external-lib');
			var count = 0;
			libEntry.each(function(i){
				count = i;
			});

			var last = $(libEntry[count]);
			last.find('.external-resource').attr('readonly', true).addClass('disable');
			last.find('.delete-lib').attr('id', (count));

			return last.find(".external-resource").val();
		}


		function validate(url){
			if (URLpattern.test(url)) {
			 return true;
			}else{
			 return false;
			}
		}

		$scope.addLib = function(){
			var last = checkList();
			if(last != "" && validate(last)){
				//Add to array
				$scope.libs.push(last);

				// Add to DOM
				var newL = document.createElement('div');
				newL.setAttribute('class', 'external-lib');

				var libUrl = document.createElement('span');
				libUrl.setAttribute('class', 'lib-url');

				var input = document.createElement('input');
				setAttributes(input, {'name': 'lib', 'class': 'external-resource','type': "url", 'placeholder': "https://pagina.com/script.js" })
				var deleteBtn = document.createElement('span');
				setAttributes(deleteBtn, {'class': 'delete-lib', 'id': '' });

				var xIcon = document.createElement('i');
				xIcon.setAttribute('class', 'fa fa-times');

				deleteBtn.appendChild(xIcon);
				libUrl.appendChild(input);

				newL.appendChild(libUrl);
				newL.appendChild(deleteBtn);

				libList.appendChild(newL);

				// Add to project
				libsArray = $scope.libs;
				clearTimeout(delay);
				delay = setTimeout(updatePreview(codeHTML, codeCSS, codeJS, libsArray), 300);

			}else{
				console.log("Wrong");
			}
		}

		function setAttributes(el, attrs) {
		  for(var key in attrs) {
		    el.setAttribute(key, attrs[key]);
		  }
		}

		$(libList).on('click', 'span.delete-lib',function(){
			var $this = $(this);
			var listIndex = $(this).attr('id');
			var libToDel = $this.parent().find('.external-resource').val();

			if((libToDel).trim() === ($scope.libs[listIndex]).trim()){
				// Delete from list
				$scope.libs.splice(listIndex,1);

				// Delete node
				deleteItem(listIndex);
				updateItems();
			}
		});

		function deleteItem(listIndex){
			var libEntry = $('.external-lib');
			$(libEntry[listIndex]).remove();

		}

		function updateItems(){
			var libEntry = $('.external-lib');

			var count = 0;
			libEntry.each(function(i){
				count = i;
				var last = $(libEntry[count]);
				last.find('.delete-lib').attr('id', (count));
			});

			libsArray = $scope.libs;
			clearTimeout(delay);
			delay = setTimeout(updatePreview(codeHTML, codeCSS, codeJS, libsArray), 300);

		}



	  $scope.editorHTML = {
	    lineNumbers: true,
	    theme: 'zenburn',
	    indentUnit: 2,
	    smartIndent: true,
	    tabSize: 2,
	    mode: 'text/html',
	    lint: true,
	    gutters: ["CodeMirror-lint-markers"],
	    matchBrackets : true,
	    autoCloseTags: true,
	    autoCloseBrackets: true,
	    indentWithTabs: false,
	    keyMap: 'sublime'
	  };

	  $scope.editorCSS = {
	    lineNumbers: true,
	    theme: 'zenburn',
	    indentUnit: 2,
	    smartIndent: true,
	    tabSize: 2,
	    mode: 'text/css',
	    lint: true,
	    gutters: ["CodeMirror-lint-markers"],
	    matchBrackets : true,
	    autoCloseTags: true,
	    autoCloseBrackets: true,
	    indentWithTabs: false,
	    keyMap: 'sublime'
	  };

	  $scope.editorJS = {
	    lineNumbers: true,
	    theme: 'zenburn',
	    indentUnit: 2,
	    smartIndent: true,
	    tabSize: 2,
	    mode: 'javascript',
	    lint: true,
	    gutters: ["CodeMirror-lint-markers"],
	    matchBrackets : true,
	    autoCloseTags: true,
	    autoCloseBrackets: true,
	    indentWithTabs: false,
	    keyMap: 'sublime'
	  };


	  $scope.$watch("project.html", function(newValue, oldValue) {

	    var code = newValue;
			codeHTML = mode.html === 'jade' ? jade.compile(code) : code;

			clearTimeout(delay);
			delay = setTimeout(updatePreview(codeHTML, codeCSS, codeJS, libsArray), 300);

	  });

	  $scope.$watch("project.css", function(newValue, oldValue) {
			codeCSS = mode.css === 'text/x-sass' ? less.compile(newValue) : newValue;
			clearTimeout(delay);
			delay = setTimeout(updatePreview(codeHTML, codeCSS, codeJS, libsArray), 300);

	  });


		$scope.jsCompile = function(){
			codeJS = $scope.project.js;
			clearTimeout(delay);
			delay = setTimeout(updatePreview(codeHTML, codeCSS, codeJS, libsArray), 300);
		}



	   $scope.$watch("project.js", function(newValue, oldValue) {
			 codeJS = newValue;
		 });


	  $scope.addProject = function() {
	    $scope.project.html = $("#editorHTML").val();
	    $scope.project.css = $("#editorCSS").val();
	    $scope.project.js = $("#editorJS").val();
	    $scope.project.type = $scope.type;
			$scope.project.libs = $scope.libs;



	    Project.save($scope.project)
	      .then(function(response){

	        if(response.success){
	          Notifier.notify('success','Proyecto añadido');
	          $routeParams.id =  response.id;
	          $location.path('/projects/' + response.id); // Redirect to new project
	        }else{
	          Notifier.error(response.reason);
	        }
	    });



	  }

	}
})(window.less, window.Sass, window.autoprefixer);
