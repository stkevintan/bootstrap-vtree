'use strict';
const gulp = require('gulp');
const babel = require('gulp-babel');
const stylus = require('gulp-stylus');
const del = require('del');
const plumber = require('gulp-plumber');
const jade = require('gulp-jade');
const merge = require('merge-stream');
const rename = require('gulp-rename');
const output = {
  js: 'dist/assets/js',
  css: 'dist/assets/css',
  font: 'dist/assets/fonts',
  html: 'dist',
  static: 'dist/assets/static'
}
gulp.task('clear:scripts', (cb) => {
  del(['dist/assets/js/*']).then(() => {
    cb();
  });
});

gulp.task('clear:static', (cb) => {
  del(['dist/assets/static/*']).then(() => {
    cb();
  });
});

gulp.task('clear:styles', (cb) => {
  del(['dist/assets/css/*']).then(() => {
    cb();
  });
});

gulp.task('scripts', ['clear:scripts'], () => {
  var user = gulp.src('src/scripts/**/!(.|_)*.js')
    .pipe(plumber())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(output.js));
  var bower = gulp.src('bower_components/*/dist/**/*.min.js')
    .pipe(plumber())
    .pipe(rename(path => path.dirname = ''))
    .pipe(gulp.dest(output.js));
  return merge(user, bower);
});

gulp.task('styles', ['clear:styles'], () => {
  var user = gulp.src('src/styles/**/!(.|_)*.styl')
    .pipe(plumber())
    .pipe(stylus({
      compress: true
    }))
    .pipe(gulp.dest(output.css));
  var bower = gulp.src('bower_components/*/dist/**/*.min.css')
    .pipe(plumber())
    .pipe(rename(path => path.dirname = ''))
    .pipe(gulp.dest(output.css));
  return merge(user, bower);
});

gulp.task('fonts', () => {
  return gulp.src('bower_components/*/dist/**/*.ttf')
    .pipe(plumber())
    .pipe(rename(path => path.dirname = ''))
    .pipe(gulp.dest(output.font));
});

gulp.task('static', ['clear:static'], () => {
  return gulp.src('src/static/**/*')
    .pipe(plumber())
    .pipe(gulp.dest(output.static));
});

gulp.task('html', () => {
  return gulp.src('src/views/!(.|_)*.jade')
    .pipe(plumber())
    .pipe(jade({
      pretty: false
    }))
    .pipe(gulp.dest(output.html));
});


gulp.task('default', ['html', 'scripts', 'styles', 'fonts', 'static']);

gulp.task('watch', () => {
  gulp.watch('src/views/**/*.jade', ['html']);
  gulp.watch('src/scripts/**/*.js', ['scripts']);
  gulp.watch('src/styles/**/*.styl', ['styles']);
  gulp.watch('src/static/**/*', ['static']);
})
