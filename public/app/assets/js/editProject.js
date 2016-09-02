(function($, CodeMirror, Haml, jade, less, Sass, CSSLint, autoprefixer, window, document) {
  'use strict';


$(function(){
  // PROJECT INFO
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

  $('.help').on('click', function(){
    $('.codeHelp').css('display', 'block');
  });

  $('.codeHelp ul .close').on('click', function(){
    $('.codeHelp').css('display', 'none');
  });


  // PROJECT LIBS
  // var libList = $('.lib-list');
  // var deleteLib = $('.delete-lib');
  //
	// function checkList(){
	// 	var libEntry = $('.external-lib');
	// 	var count = 0;
	// 	libEntry.each(function(i){
	// 		count = i;
	// 	});
	// 	var last = $(libEntry[count]);
  //   last.find('.delete-lib').attr('data-id', count);
  //   last.find('.delete-lib').attr('ng-click', "removeLib("+count+")");
	// 	return last.find(".external-resource").val();
	// }
  //
  // $('.delete-lib').on('click', function(){
  //     console.log($(this));
  //   // $(this).on('click', function(){
  //   //   var lib = $(this);
  //   //   console.log(lib.parent().attr('index'));
  //   // });s
  // });
  //
  //
  //
  //
  // $('.addBtn').on('click', function(){
  //   var last = checkList();
  //
  //   if(last != undefined && last != ""){
  //     var newLib = '<div class="external-lib"> <span class="lib-url"> <input class="external-resource" type="url" placeholder="https://pagina.com/script.js"> </span> <span ng-click="" class="delete-lib"><i class="fa fa-times"></i></span> </div>';
  //     libList.append(newLib);
  //   }
  // });

  // CODE
  var openEditors = 3;


  var editorCSS = $('#editorCSS');
  var editorJS = $('#editorJS');

  var $showCSS = $('#showCSS');
  var $showJS = $('#showJS');
  var $showHTML = $('#showHTML');
  var $closePanel = $('.closePanel');
  var $cssSelect = $('#cssSelect');
  var $htmlSelect = $('#htmlSelect');
  var $jsCompile = $('.jsCompile');
  var mode = {
      css: 'text/css',
      html: 'text/html',
      js: 'javascript'
  };


  // Change framework
  $cssSelect.on('change', function() {
      var $this = $(this);
      var val = $this.val();
      mode.css = val;
      var scEditorCSS = angular.element($('#editorCSS')).scope();
      scEditorCSS.$apply(function(){
          scEditorCSS.editorCSS.mode = mode.css;
      });

      console.log(mode.css);
  });

  $htmlSelect.on('change', function() {
      var $this = $(this);
      var val = $this.val();
      mode.html = val;
      var scEditorHTML = angular.element($('#editorHTML')).scope();
      scEditorHTML.$apply(function(){
          scEditorHTML.editorHTML.mode = mode.css;
      });
  });

  // Close editor
  $showCSS.on('change', function() {
    if ($('.codeBlock.css').hasClass('closed')) {
        openEditors++;
      } else {
        if (openEditors < 2) {
          return false;
        }
        openEditors--;
      }
      $('.codeBlock.css').toggleClass('closed');
  });
  $showJS.on('change', function() {
    if ($('.codeBlock.js').hasClass('closed')) {
        openEditors++;
      } else {
        if (openEditors < 2) {
          return false;
        }
        openEditors--;
      }
      $('.codeBlock.js')
          .toggleClass('closed');
  });
  $showHTML.on('change', function() {
    if ($('.codeBlock.html').hasClass('closed')) {
        openEditors++;
      } else {
        if (openEditors < 2) {
          return false;
        }
        openEditors--;
      }
      $('.codeBlock.html')
          .toggleClass('closed');
  });

  $closePanel.on('click', function() {

      if ($(this).closest('.codeBlock').hasClass('closed')) {
        openEditors++;
      } else {
        if (openEditors < 2) {
          return false;
        }
        openEditors--;
      }
      $(this).closest('.codeBlock').toggleClass('closed');
      var checked;
      if ($(this).closest('.codeBlock').hasClass('css')) {
          checked = $showCSS.prop('checked');
          $showCSS.prop('checked', !checked);
      } else if ($(this).closest('.codeBlock').hasClass('js')) {
          checked = $showJS.prop('checked');
          $showJS.prop('checked', !checked);
      } else if ($(this).closest('.codeBlock').hasClass('html')) {
          checked = $showHTML.prop('checked');
          $showHTML.prop('checked', !checked);
      }
  });

  $('.button').on('mousedown click moseup', function(e){
    var target = $(this).attr('for');
    var $target = $('#' + target);
    if ($target.prop('checked')) {
      if (openEditors < 2) {
        e.preventDefault;
            return false;
      }
    }
  });

  $('body').addClass('loaded');

});
})( window.jQuery, window.CodeMirror, window.Haml ,window.jade, window.less, window.Sass, window.autoprefixer, window, document);
