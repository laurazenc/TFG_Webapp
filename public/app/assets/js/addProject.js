//
// (function($, CodeMirror, Haml, jade, less, Sass, CSSLint, autoprefixer, window, document) {
//
//   $(function() {
//       var theme = 'zenburn';
//       var openEditors = 3;
//       var areaCSS = document.getElementById('areaCSS');
//       var areaHTML = document.getElementById('areaHTML');
//       var areaJS = document.getElementById('areaJS');
//       var style = document.getElementById('style');
//       var script = document.getElementById('script');
//       var view = document.getElementById('view');
//       var viewDocument = view.contentDocument || view.contentWindow.document;
//       var body = viewDocument.getElementsByTagName('body')[0];
//       var head = viewDocument.getElementsByTagName('head')[0];
//
//       var $showCSS = $('#showCSS');
//       var $showJS = $('#showJS');
//       var $showHTML = $('#showHTML');
//       var $closePanel = $('.closePanel');
//       var $cssSelect = $('#cssSelect');
//       var $htmlSelect = $('#htmlSelect');
//       var $jsCompile = $('.jsCompile');
//       var mode = {
//           css: 'text/css',
//           html: 'text/html',
//           js: 'text/javascript'
//       };
//
//
//       // Change framework
//       $cssSelect.on('change', function() {
//           var $this = $(this);
//           var val = $this.val();
//           mode.css = val;
//           editorCSS.setOption("mode", mode.css);
//       });
//
//       $htmlSelect.on('change', function() {
//           var $this = $(this);
//           var val = $this.val();
//           mode.html = val;
//           editorHTML.setOption("mode", mode.html);
//       });
//
//
//       // Set up editors
//       var editorCSS = CodeMirror.fromTextArea(areaCSS, {
//           lineNumbers: true,
//           theme: theme,
//           indentUnit: 2,
//           smartIndent: true,
//           tabSize: 2,
//           mode: mode.css,
//           lint: true,
//           gutters: ["CodeMirror-lint-markers"],
//           matchBrackets : true,
//           autoCloseBrackets: true,
//           indentWithTabs: false,
//           keyMap: 'sublime',
//           paletteHints: true
//       });
//       Inlet(editorCSS);
//
//       var editorHTML = CodeMirror.fromTextArea(document.getElementById('areaHTML'), {
//           lineNumbers: true,
//           theme: theme,
//           indentUnit: 2,
//           smartIndent: true,
//           tabSize: 2,
//           mode: mode.html,
//           lint: true,
//           gutters: ["CodeMirror-lint-markers"],
//           matchBrackets : true,
//           autoCloseTags: true,
//           autoCloseBrackets: true,
//           indentWithTabs: false,
//           keyMap: 'sublime'
//       });
//
//
//       var editorJS = CodeMirror.fromTextArea(areaJS, {
//           lineNumbers: true,
//           theme: theme,
//           indentUnit: 2,
//           smartIndent: true,
//           tabSize: 2,
//           mode: mode.js,
//           lint: true,
//           gutters: ["CodeMirror-lint-markers"],
//           matchBrackets : true,
//           autoCloseBrackets: true,
//           indentWithTabs: false,
//           keyMap: 'sublime'
//       });
//
//       body.appendChild(script);
//       head.appendChild(style);
//
//       var widgets = [];
//       editorCSS.on('update', function(obj) {
//           style.remove();
//           var css = obj.doc.getValue();
//           css = mode.css === 'text/css' ? obj.doc.getValue() : Sass.compile(css);
//           if (mode.css === 'text/x-less') {
//               less.render(obj.doc.getValue(), function(e, result) {
//                   if (!e) {
//                       css = result.css;
//                       var prefixed = autoprefixer().process(css);
//                       style.innerHTML = prefixed;
//                       head.appendChild(style);
//                   }
//               });
//           } else {
//               var cssCode = css;
//               editorCSS.operation(function(){
//                 for (var i = 0; i < widgets.length; ++i){
//                   editorCSS.removeLineWidget(widgets[i]);
//                 }
//                 widgets.length = 0;
//                 var result = CSSLint.verify(editorCSS.getValue())
//
//                 for (var i = 0; i < result.length; ++i) {
//                   var err = result.messages[i]
//                   if (!err) continue
//                   var msg = document.createElement("div")
//                   var icon = msg.appendChild(document.createElement("span"))
//                   icon.innerHTML = "!!"
//                   icon.className = "lint-error-icon"
//                   //***** HERE *****
//                   msg.appendChild(document.createTextNode(err.message))
//                   msg.className = "lint-error"
//                   widgets.push(editorCSS.addLineWidget(err.line - 1, msg, {coverGutter: false, noHScroll: true}))
//                 }
//               })// end of cssEditor.operation
//
//               style.innerHTML = cssCode;
//               head.appendChild(style);
//
//               //Update value
//               $("#areaCSS").val(obj.doc.getValue()).change();
//               var scope = angular.element($("#areaCSS")).scope();
//               scope.$apply(function(){
//                   scope.areaCSS = (obj.doc.getValue());
//               });
//           }
//
//           areaCSS.value = css;
//       });
//
//       $jsCompile.on('click', function () {
//         script.remove();
//         checkFormat(editorJS);
//         script = document.createElement('script');
//         var code = '$(document).ready(function(){\n' + editorJS.getValue() + '\n});';
//         script.innerHTML = code
//         body.appendChild(script);
//         //Update value
//         $("#areaJS").val(code).change();
//         var scope = angular.element($("#areaJS")).scope();
//         scope.$apply(function(){
//             scope.areaJS = (code);
//         });
//
//         areaJS.value = code;
//       });
//
//       editorJS.on('change', function(obj) {
//         //Update value
//         $("#areaJS").val(obj.doc.getValue()).change();
//         var scope = angular.element($("#areaJS")).scope();
//         scope.$apply(function(){
//             scope.areaJS = (editorJS.getValue());
//         });
//       });
//
//
//       function checkFormat(editor) {
//         editor.operation(function(){
//           for (var i = 0; i < widgets.length; ++i){
//             editor.removeLineWidget(widgets[i]);
//           }
//           widgets.length = 0;
//           var result = JSHINT(editor.getValue());
//           for (var i = 0; i < result.length; ++i) {
//             widgets.push(editor.addLineWidget(err.line - 1, result.messages[i], {coverGutter: false, noHScroll: true}))
//           }
//         })// end of cssEditor.operation
//
//       };
//
//       $(document).ready(function(){
//         console.log($("#areaHTML").val());
//
//
//       });
//
//
//
//       editorHTML.on('update', function(obj) {
//           script.remove();
//           var code = obj.doc.getValue();
//           var html = mode.html === 'jade' ? jade.compile(code) : code;
//           html = mode.html === 'haml' ? Haml(html) : html;
//           $(body).html(html);
//           body.appendChild(script);
//           $("#areaHTML").val(obj.doc.getValue()).change();
//           var scope = angular.element($("#areaHTML")).scope();
//           console.log(scope.areaHTML);
//           scope.$apply(function(){
//               scope.areaHTML = (obj.doc.getValue());
//           });
//
//       });
//
//
//       // CHANGE FRAMEWORK
//       $showCSS.on('change', function() {
//         if ($('.codeBlock.css').hasClass('closed')) {
//             openEditors++;
//           } else {
//             if (openEditors < 2) {
//               return false;
//             }
//             openEditors--;
//           }
//           $('.codeBlock.css').toggleClass('closed');
//       });
//       $showJS.on('change', function() {
//         if ($('.codeBlock.js').hasClass('closed')) {
//             openEditors++;
//           } else {
//             if (openEditors < 2) {
//               return false;
//             }
//             openEditors--;
//           }
//           $('.codeBlock.js')
//               .toggleClass('closed');
//       });
//       $showHTML.on('change', function() {
//         if ($('.codeBlock.html').hasClass('closed')) {
//             openEditors++;
//           } else {
//             if (openEditors < 2) {
//               return false;
//             }
//             openEditors--;
//           }
//           $('.codeBlock.html')
//               .toggleClass('closed');
//       });
//
//       // CLOSE EDITOR
//       $closePanel.on('click', function() {
//
//           if ($(this).closest('.codeBlock').hasClass('closed')) {
//             openEditors++;
//           } else {
//             if (openEditors < 2) {
//               return false;
//             }
//             openEditors--;
//           }
//           $(this).closest('.codeBlock').toggleClass('closed');
//           var checked;
//           if ($(this).closest('.codeBlock').hasClass('css')) {
//               checked = $showCSS.prop('checked');
//               $showCSS.prop('checked', !checked);
//           } else if ($(this).closest('.codeBlock').hasClass('js')) {
//               checked = $showJS.prop('checked');
//               $showJS.prop('checked', !checked);
//           } else if ($(this).closest('.codeBlock').hasClass('html')) {
//               checked = $showHTML.prop('checked');
//               $showHTML.prop('checked', !checked);
//           }
//       });
//
//       $('.button').on('mousedown click moseup', function(e){
//         var target = $(this).attr('for');
//         var $target = $('#' + target);
//         if ($target.prop('checked')) {
//           if (openEditors < 2) {
//             e.preventDefault;
//                 return false;
//           }
//         }
//       });
//       $('body').addClass('loaded');
//
//
//   });
//
// })( window.jQuery, window.CodeMirror, window.Haml ,window.jade, window.less, window.Sass, window.CSSLint, window.autoprefixer, window, document);
