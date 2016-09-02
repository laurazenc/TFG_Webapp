(function () {
	'use strict';

	angular
		.module('app.project')
		.controller('DetailProjectController', DetailProjectController);

	DetailProjectController.$inject = ['$location', '$routeParams', '$scope', '$rootScope', 'Project', 'Auth', 'Comment'];

  function DetailProjectController($location, $routeParams, $scope, $rootScope, Project, Auth, Comment){
    var vm = this;

    vm.currentUser = $rootScope.currentUser;
    vm.isLoggedIn = Auth.isLoggedIn();

    vm.project = {};

    var style;
    var script;
    var jQ;

    var view;
    var viewDocument;
    var body;
    var head;
    var widgets = [];
    vm.creator = null;
    vm.isCreator = isCreator;
    vm.editProject = edit;

    function edit(){
      var isC = isCreator();
      if(isC){
        $location.path('/projects/' + $routeParams.id + '/edit');
      }
    }

    getProject();

    isCreator();


    function getProject(){
      Project.getProject($routeParams.id)
				.then(function(response){
	        if(response.success){
	          vm.project = response.project;
	          vm.creator = response.project.creator._id;

	          isCreator();
						init();
	        }else{
	          Notifier.error('No existe el proyecto seleccionado');
	          $location.path('/');
	        }
      	})
				.catch(function(error){
					$location.path('/');
				});
    }



    function isCreator(){
      return (vm.currentUser.id === vm.creator);
    }
		var delay;
    function init(){
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
        keyMap: 'sublime',
        readOnly: 'nocursor'
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
        keyMap: 'sublime',
        readOnly: 'nocursor'
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
        keyMap: 'sublime',
        readOnly: 'nocursor'
      };

      var mode = {
          css: 'text/css',
          html: 'text/html',
          js: 'javascript'
      };

			var codeHTML = '';
			var codeCSS = '';
			var codeJS = '';
			var libsArray = vm.project.libs;

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
					viewDocument.write('<script type="text/javascript" src="' +libsArray[i] + '"></script>');
				}
				viewDocument.write(codeHTML);
				viewDocument.write('<script type="text/javascript">' + codeJS + '</script>');
				viewDocument.close();
			}


      $scope.$watch("detail.project.code[0].html", function(newValue, oldValue) {

				var code = newValue;
				codeHTML = mode.html === 'jade' ? jade.compile(code) : code;

				clearTimeout(delay);
				delay = setTimeout(updatePreview(codeHTML, codeCSS, codeJS, libsArray), 300);

      });


      $scope.$watch("detail.project.code[0].js", function(newValue, oldValue) {
				codeJS = newValue;
				clearTimeout(delay);
				delay = setTimeout(updatePreview(codeHTML, codeCSS, codeJS, libsArray), 300);
      });

      $scope.$watch("detail.project.code[0].css", function(newValue, oldValue) {
        // $(style).remove();
         var css = newValue;
				//
        // var AutoprefixerSettings = "";
            css = mode.css === 'text/css' ? newValue : Sass.compile(css);
            if (mode.css === 'text/x-less') {
                less.render(newValue, function(e, result) {
                    if (!e) {
                        css = result.css;
                         var prefixed = autoprefixer().process(css);
                        var prefixed = autoprefixer(AutoprefixerSettings || null).process(css).css;


                    }
                });
            } else {
                 var prefixed = autoprefixer().process(css);

                //var prefixed = autoprefixer(AutoprefixerSettings || null).process(css);

            }
        // $("#editorCSS").val(newValue);

				codeCSS = mode.css === 'text/x-sass' ? less.compile(prefixed) : prefixed;
				clearTimeout(delay);
				delay = setTimeout(updatePreview(codeHTML, codeCSS, codeJS, libsArray), 300);

      });
    }

  }
})();
