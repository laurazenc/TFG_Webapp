var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');
var path = require('path');

var BROWSER_SYNC_RELOAD_DELAY = 500;
var reload = browserSync.reload();

gulp.task('sass', function(){
	gulp.src('public/app/assets/css/style.scss')
		.pipe(plumber())
		.pipe(sass())
		.pipe(gulp.dest('public/app/assets/css'));
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('watch', function(){
	gulp.watch('public/app/assets/css/**/*.scss', ['sass', 'bs-reload']);
	gulp.watch('public/app/**/**/*.html', ['bs-reload']);
	gulp.watch('public/app/**/*.js', ['bs-reload']);
	gulp.watch('server/**/*.js', ['bs-reload']);
});

gulp.task('styles', function(){
  return gulp.src('public/app/assets/css/*.scss')
  .pipe(sass({ style: 'expanded', loadPath: [ path.join( __dirname , 'public/app/assets/css') ] }))
  .pipe(gulp.dest('public/app/assets/css'))
});

gulp.task('serve', function (cb) {
	var called = false;
  return nodemon({

    // nodemon our expressjs server
    script: 'server.js',

    // watch core server file(s) that require server restart on change
    watch: ['server.js', 'server/**/*.js']
  })
    .on('start', function onStart() {
      // ensure start only got called once
      if (!called) { cb(); }
      called = true;
    })
    .on('restart', function onRestart() {
      // reload connected browsers after a slight delay
      setTimeout(function reload() {
        browserSync.reload({
          stream: false
        });
      }, BROWSER_SYNC_RELOAD_DELAY);
    });
});

gulp.task('browser-sync', ['serve'], function() {
	browserSync.init({
		notify: false,
		proxy: 'http://localhost:3000',
    port: 3001,
		browser: ['google chrome']
  });
});



gulp.task('default', ['browser-sync', 'sass', 'watch', 'styles']);
