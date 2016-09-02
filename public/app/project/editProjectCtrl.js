(function () {
	'use strict';

	angular
		.module('app.project')
		.controller('EditProjectController', EditProjectController);

	EditProjectController.$inject = ['$location', '$routeParams', '$scope', '$rootScope', 'Project', 'Auth', 'Notifier', 'ngDialog'];

  function EditProjectController($location, $routeParams, $scope, $rootScope, Project, Auth, Notifier, ngDialog){
    var vm = this;
		vm.project = {};
		$scope.libs = [];

    vm.currentUser = $rootScope.currentUser;
    vm.isLoggedIn = Auth.isLoggedIn();

    $scope.typeOptions  = [
      { value: "personal", text: "Personal"},
      { value: "educational", text: "Educativo"}
    ];

		$scope.type  = $scope.typeOptions[0].value;

    vm.jsCompile = compile;
    vm.deleteProject = deleteProject;
    vm.saveProject = saveProject;


    var style;
    var script;
    var jQ;

    var view;
    var viewDocument;
    var body;
    var head;
    var widgets = [];

		var delay;

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
				console.log($scope.libs);

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
			console.log($scope.libs);

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


    getProject();

    function getProject(){
      Project.getProject($routeParams.id).then(function(response){
        if(response.success){
          vm.project = response.project;
          vm.creator = response.project.creator._id;
					$scope.libs = vm.project.libs;
					$scope.type  = vm.project.type;

					libsArray = $scope.libs;
					init();
					clearTimeout(delay);
					delay = setTimeout(updatePreview(codeHTML, codeCSS, codeJS, libsArray), 300);

        }else{
          Notifier.error('No existe el proyecto seleccionado');
          $location.path('/');
        }
      });
    }


		function init(){

			var libEntry = $('.external-lib');
			$(libEntry[0]).remove();

			for(var i=0; i < libsArray.length; ++i){
				//	Add node
						var newL = document.createElement('div');
						newL.setAttribute('class', 'external-lib');

						var libUrl = document.createElement('span');
						libUrl.setAttribute('class', 'lib-url');

						var input = document.createElement('input');
						setAttributes(input, {'name': 'lib', 'class': 'external-resource disable','type': "url", 'placeholder': "https://pagina.com/script.js" });
						input.value = libsArray[i];
						setAttributes(input, {'readonly': 'true'});

						var deleteBtn = document.createElement('span');
						setAttributes(deleteBtn, {'class': 'delete-lib', 'id': i });

						var xIcon = document.createElement('i');
						xIcon.setAttribute('class', 'fa fa-times');

						deleteBtn.appendChild(xIcon);
						libUrl.appendChild(input);

						newL.appendChild(libUrl);
						newL.appendChild(deleteBtn);

						libList.appendChild(newL);
			}

			// Append blank new one
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
      scrollbarStyle: 'native',
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

    style = document.getElementById('style');
    script = document.getElementById('script');
    jQ = document.getElementById('jQ');

    view = document.getElementById('view');
    viewDocument = view.contentDocument || view.contentWindow.document;
    body = viewDocument.getElementsByTagName('body')[0];
    head = viewDocument.getElementsByTagName('head')[0];

    var mode = {
        css: 'text/css',
        html: 'text/html',
        js: 'javascript'
    };

    $scope.$watch("edit.project.code[0].html", function(newValue, oldValue) {
			var code = newValue;
			codeHTML = mode.html === 'jade' ? jade.compile(code) : code;

			clearTimeout(delay);
			delay = setTimeout(updatePreview(codeHTML, codeCSS, codeJS, libsArray), 300);

    });


    $scope.$watch("edit.project.code[0].js", function(newValue, oldValue) {
			codeJS = newValue;
    });

    $scope.$watch("edit.project.code[0].css", function(newValue, oldValue) {

			codeCSS = mode.css === 'text/x-sass' ? less.compile(newValue) : newValue;
			clearTimeout(delay);
			delay = setTimeout(updatePreview(codeHTML, codeCSS, codeJS, libsArray), 300);

    });


    function compile(){
			codeJS = vm.project.code[0].js;
			clearTimeout(delay);
			delay = setTimeout(updatePreview(codeHTML, codeCSS, codeJS, libsArray), 300);
    }

		function saveProject() {
			vm.project.html = $("#editorHTML").val();
			vm.project.css = $("#editorCSS").val();
			vm.project.js = $("#editorJS").val();
			vm.project.type = $scope.type;
			vm.project.libs = $scope.libs;


			Project.update(vm.project).then(function(response){
				console.log(response);
			 if(response.success){
				 Notifier.notify('success','Proyecto actualizado');
			 }else{
				 Notifier.error(response.reason);
			 }
			});
		}

		function deleteProject() {
			ngDialog.openConfirm({
          template:
            '<div>' +
            '<h4>El proyecto se eliminará, ¿Desea continuar?</h4>' +
            '<div class="ngdialog-buttons">' +
              '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>Eliminar</button>' +
              '<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click=closeThisDialog("Cancel")>Cancel</button>' +
            '</div>' +
            '</div>',
          plain: true,
          className: 'ngdialog-theme-default'
      }).then(
  			function(value) {
  				Project.remove($routeParams.id).then(function(response){
						if(response.success){
              Notifier.notify('success','Proyecto eliminado');
              $location.path('/users/' + vm.currentUser.id + '/projects'); // Redirect to new project
            }else{
              Notifier.error(response.message);
            }
          });
  			}
  		);
		}

  };
})();
