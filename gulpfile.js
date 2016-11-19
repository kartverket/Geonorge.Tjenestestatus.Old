'use strict';

/* Require packages */
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var cssnano = require('gulp-cssnano');
var download = require('gulp-download-stream');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var pug = require('gulp-pug');
var uglify = require('gulp-uglify');

/* Initiate options */
var options = {};
options.watch = process.argv.indexOf('--watch') !== -1 ? true : false;
options.distribute = process.argv.indexOf('--dist') !== -1 ? true : false;
options.paths = {};
options.paths.base = options.distribute ? './dist/' : './build/';
options.paths.css = options.paths.base + 'css/';
options.paths.js = options.paths.base + 'js/';
options.vendor = require('./vendor.json');

/* Functions */
var vendorFilter = function (pkg) {
  var key = options.distribute ? 'min' : 'dev';
  return pkg[key].split('.').pop() == this ? true : false;
};
var vendorMap = function (pkg) {
  var key = options.distribute ? 'min' : 'dev';
  return './vendor/' + pkg[key].split('/').pop();
};
var vendorDownload = function (pkg) {
  var key = options.distribute ? 'min' : 'dev';
  return {
    file: pkg[key].split('/').pop(),
    url: 'https://unpkg.com/' + pkg.name + '@' + pkg.version + '/' + pkg[key]
  };
};

/* HTML templating */
gulp.task('pug', function () {
  return gulp.src('./src/pug/*.pug')
  .pipe(pug({
    pretty: options.distribute ? false : true
  }))
  .pipe(gulp.dest(options.paths.base));
});

/* React components */
gulp.task('jsx', function () {
  return gulp.src('./src/jsx/*.jsx')
  .pipe(babel({
    presets: ['react']
  }))
  .pipe(concat(options.distribute ? 'statusmonitor.min.js' : 'statusmonitor.js'))
  .pipe(gulpif(options.distribute, uglify()))
  .pipe(gulp.dest(options.paths.js));
});

/* Stylesheets */
gulp.task('css', function () {
  return gulp.src('./src/css/*.css')
  .pipe(concat(options.distribute ? 'statusmonitor.min.css' : 'statusmonitor.css'))
  .pipe(gulpif(options.distribute, cssnano()))
  .pipe(gulp.dest(options.paths.css + 'css/'));
});

/* Scripts */
gulp.task('js', function () {
  return gulp.src('./src/js/*.js')
  .pipe(concat(options.distribute ? 'local.min.js' : 'local.js'))
  .pipe(gulpif(options.distribute, uglify()))
  .pipe(gulp.dest(options.paths.js));
});

/* Download vendor files */
gulp.task('vendor:download', function () {
  var src = options.vendor.map(vendorDownload);
  return download(src)
  .pipe(gulp.dest('./vendor/'));
});

/* Make vendor CSS */
gulp.task('vendor:css', ['vendor:download'], function () {
  var src = options.vendor.filter(vendorFilter, 'css').map(vendorMap);
  return gulp.src(src)
  .pipe(concat(options.distribute ? 'vendor.min.css' : 'vendor.css'))
  .pipe(gulp.dest(options.paths.css));
});

/* Make vendor JS */
gulp.task('vendor:js', ['vendor:download'], function () {
  var src = options.vendor.filter(vendorFilter, 'js').map(vendorMap);
  return gulp.src(src)
  .pipe(concat(options.distribute ? 'vendor.min.js' : 'vendor.js'))
  .pipe(gulp.dest(options.paths.js));
});

/* Get all vendor resources */
gulp.task('vendor', ['vendor:css', 'vendor:js']);

/* Default */
gulp.task('default', ['pug', 'css', 'jsx', 'js'], function () {
  if (options.watch) {
    gulp.watch('./src/pug/**/*.pug', ['pug']);
    gulp.watch('./src/css/**/*.css', ['css']);
    gulp.watch('./src/jsx/**/*.jsx', ['jsx']);
    gulp.watch('./src/js/**/*.js', ['js']);
  }
});
