'use strict';

var babel = require('gulp-babel');
var concat = require('gulp-concat');
var cssnano = require('gulp-cssnano');
var download = require('gulp-download-stream');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var pug = require('gulp-pug');
var uglify = require('gulp-uglify');

var options = {};
options.watch = process.argv.indexOf('--watch') !== -1 ? true : false;
options.distribute = process.argv.indexOf('--dist') !== -1 ? true : false;
options.paths = {};
options.paths.base = options.distribute ? './dist/' : './build/';
options.paths.css = options.paths.base + 'css/';
options.paths.js = options.paths.base + 'js/';

gulp.task('pug', function () {
  return gulp.src('./src/pug/*.pug')
  .pipe(pug({
    pretty: options.distribute ? false : true
  }))
  .pipe(gulp.dest(options.paths.base));
});

gulp.task('jsx', function () {
  return gulp.src('./src/jsx/*.jsx')
  .pipe(babel({
    presets: ['react']
  }))
  .pipe(concat(options.distribute ? 'statusmonitor.min.js' : 'statusmonitor.js'))
  .pipe(gulpif(options.distribute, uglify()))
  .pipe(gulp.dest(options.paths.js));
});

gulp.task('vendorJs:build', function () {
  return gulp.src([
    './bower_components/axios/dist/axios.js',
    './bower_components/react/react.js',
    './bower_components/react/react-dom.js'
  ])
  .pipe(concat('vendor.js'))
  .pipe(gulp.dest('./build/js/'));
});

gulp.task('css', function () {
  return gulp.src('./src/css/*.css')
  .pipe(concat(options.distribute ? 'statusmonitor.min.css' : 'statusmonitor.css'))
  .pipe(gulpif(options.distribute, cssnano()))
  .pipe(gulp.dest(options.paths.css + 'css/'));
});

gulp.task('vendorCss:build', function () {
  return gulp.src([
    './bower_components/bootstrap/dist/css/bootstrap.css'
  ])
  .pipe(concat('vendor.css'))
  .pipe(gulp.dest('./build/css/'));
});

gulp.task('default', ['pug', 'vendorCss:build', 'css', 'vendorJs:build', 'jsx'], function () {
  if (options.watch) {
    gulp.watch('./src/pug/**/*.pug', ['pug']);
    gulp.watch('./src/css/**/*.css', ['css']);
    gulp.watch('./src/jsx/**/*.jsx', ['jsx']);
  }
});
