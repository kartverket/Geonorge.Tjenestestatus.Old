'use strict';

var babel = require('gulp-babel');
var concat = require('gulp-concat');
var gulp = require('gulp');
var pug = require('gulp-pug');

gulp.task('pug:build', function () {
  return gulp.src('./src/pug/*.pug')
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest('./build/'));
});

gulp.task('jsx:build', function () {
  return gulp.src('./src/jsx/*.jsx')
  .pipe(babel({
    presets: ['react']
  }))
  .pipe(concat('statusmonitor.js'))
  .pipe(gulp.dest('./build/js/'));
});

gulp.task('vendorJs:build', function () {
  return gulp.src([
    './bower_components/react/react.js',
    './bower_components/react/react-dom.js'
  ])
  .pipe(concat('vendor.js'))
  .pipe(gulp.dest('./build/js/'));
});

gulp.task('default', ['pug:build', 'vendorJs:build', 'jsx:build'], function () {
  gulp.watch('./src/pug/**/*.pug', ['pug:build']);
  gulp.watch('./src/jsx/**/*.jsx', ['jsx:build']);
});
