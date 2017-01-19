'use strict';

/* Require packages */
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var format = require('string-format');
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
var vendorUrl = function (vendorFile) {
  var tpl = vendorFile.dev !== undefined && vendorFile.min !== undefined ? vendorFile.url.replace('{src}', options.distribute ? '{min}' : '{dev}') : vendorFile.url;
  var url = format(tpl, vendorFile);
  var key = url.split('.').pop() == 'css' ? 'styles' : 'scripts';
  this[key].push(url);
};

/* HTML templating */
gulp.task('pug', function () {
  var locals = { scripts: [], styles: [] };
  var vendorFiles = require('./vendor.json');
  vendorFiles.forEach(vendorUrl, locals);
  return gulp.src('./src/pug/*.pug')
  .pipe(pug({
    locals: locals,
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
  .pipe(concat('statusmonitor.js'))
  .pipe(gulpif(options.distribute, uglify()))
  .pipe(gulp.dest(options.paths.js));
});

/* Stylesheets */
gulp.task('css', function () {
  return gulp.src('./src/css/*.css')
  .pipe(concat('local.css'))
  .pipe(gulpif(options.distribute, cssmin()))
  .pipe(gulp.dest(options.paths.css));
});

/* Scripts */
gulp.task('js', function () {
  return gulp.src('./src/js/*.js')
  .pipe(concat('local.js'))
  .pipe(gulpif(options.distribute, uglify()))
  .pipe(gulp.dest(options.paths.js));
});

/* Default */
gulp.task('default', ['pug', 'css', 'jsx', 'js'], function () {
  if (options.watch) {
    gulp.watch('./src/pug/**/*.pug', ['pug']);
    gulp.watch('./src/css/**/*.css', ['css']);
    gulp.watch('./src/jsx/**/*.jsx', ['jsx']);
    gulp.watch('./src/js/**/*.js', ['js']);
  }
});
