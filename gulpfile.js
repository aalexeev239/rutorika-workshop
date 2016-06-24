'use strict';

const gulp = require('gulp');

gulp.task('test', function () {
  console.log('hey there');
});


/*=============================================*/


const stylus = require('gulp-stylus');

gulp.task('styl', function() {
  return gulp.src('src/_styl/**.*')
    .pipe(stylus())
    .pipe(gulp.dest('build/styles'));
});


/*=============================================*/


gulp.task('copy', function() {
  return gulp.src('src/assets/**.*')
    .pipe(gulp.dest('build/assets'));
});


/*=============================================*/


const del = require('del');

gulp.task('clean', function() {
  return del('build');
});


/*=============================================*/


const sourcemaps = require('gulp-sourcemaps');

gulp.task('sourcemaps', function() {
  return gulp.src('src/_styl/**.*')
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/styles-sourcemaps'));
});


/*=============================================*/


const argv = require('minimist')(process.argv.slice(2));
const isProduction = !!argv.production;

gulp.task('argv', function () {
  console.log(argv);
});

const environment = process.env.NODE_ENV || 'development';
const isDevelopment = environment === 'development';

gulp.task('env', function () {
  console.log(environment);
  console.log(isDevelopment);
});


/*=============================================*/


const gulpIf = require('gulp-if');

gulp.task('if', function() {
  return gulp.src('src/_styl/**.*')
    .pipe(gulpIf(!isProduction, sourcemaps.init()))
    .pipe(stylus())
    .pipe(gulpIf(!isProduction, sourcemaps.write('.')))
    .pipe(gulp.dest('build/styles-if'));
});


/*=============================================*/


gulp.task('build', ['clean', 'styl']); // не сработает

const runSequence = require("run-sequence");

gulp.task('build2', ['clean'], function (callback) {

  let tasks = [
    ['copy', 'sourcemaps']
  ];

  if (!isProduction) {
    tasks.push('argv');
  }

  tasks.push(callback);

  runSequence(...tasks);
});


/*=============================================*/


gulp.task('default', ['build2'], function() {
  gulp.watch('**/*', {cwd: 'src/_styl/'}, ['styl']);
});

