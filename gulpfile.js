'use strict';

var gulp = require('gulp');
var pug = require('gulp-pug');

gulp.task('pug:build', function () {
  return gulp.src('./src/pug/*.pug')
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest('./build/'));
});

gulp.task('default', ['pug:build'], function () {
  gulp.watch('./src/pug/**/*.pug', ['pug:build']);
});
