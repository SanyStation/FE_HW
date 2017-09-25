var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var pump = require('pump');
var runSequence = require('run-sequence');
var del = require('del');

gulp.task('build', function() {
  runSequence(['cleancss', 'compress'], function () {
    console.log('BUILD DONE');
  });
});

gulp.task('cleancss', function() {
  return gulp.src('css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('build/css'));
});

gulp.task('compress', function(cb) {
  pump([
      gulp.src('js/*.js'),
      uglify(),
      gulp.dest('build/js')
    ],
    cb
  );
});

gulp.task('clean', function() {
  return del(['build']);
});