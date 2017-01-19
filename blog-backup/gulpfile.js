var gulp = require('gulp');
var sass = require('gulp-ruby-sass');


gulp.task('copy', function () {
  gulp
    .src([
      'node_modules/bootstrap/dist/css/bootstrap.min.css',
    ])
    .pipe(gulp.dest('assets/themes/twitter/css'));


  gulp
    .src([
      'node_modules/bootstrap/dist/fonts/*',
    ])
    .pipe(gulp.dest('assets/themes/twitter/fonts'));


  gulp
    .src([
      'node_modules/bootstrap/dist/js/bootstrap.min.js',
      'node_modules/jquery/dist/jquery.min.js'
    ])
    .pipe(gulp.dest('assets/themes/twitter/js/vendor'));
});


gulp.task('css', function () {
  gulp.src('assets/themes/twitter/sass/style.scss')
    // .pipe(sass({ style: 'compressed' }))
    .pipe(sass())
    .on('error', function (err) { console.log(err.message); })
    .pipe(gulp.dest('assets/themes/twitter/css'));
});


gulp.task('default', ['copy','css']);
