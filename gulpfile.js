var $    = require('gulp-load-plugins')(),
    gulp = require('gulp'),
    del = require('del'),
    typescript = require('gulp-typescript'),
    tscConfig = require('./tsconfig.json'),
    ngAnnotate = require('gulp-ng-annotate'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create(),
    modRewrite = require('connect-modrewrite'),
    gulpNgConfig = require('gulp-ng-config'),
    util = require('gulp-util');

// File paths to various assets are defined here.
var PATHS = {
  sass: [],
  javascript: [
    'app/**/*.component.ts',
    'app/**/*.ts'
  ]
};

// Combine SASS into one file
gulp.task('sass', function() {
  return gulp.src('client/scss/app.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: PATHS.sass
    })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('client/css'))
    .pipe(browserSync.stream());
});


// First clear the js folder before building.
gulp.task('clean', function () {
  return del('js/**/*');
});

// TypeScript compile & uglify
gulp.task('typescript', ['clean'], function () {
  var uglify = $.uglify()
    .on('error', function (e) {
      console.log(e);
  });
  return gulp
    .src('app/**/*.ts')
    .pipe($.sourcemaps.init())
    .pipe(typescript(tscConfig.compilerOptions))
    //.pipe($.concat('app.js'))
    .pipe(ngAnnotate({
            // true helps add where @ngInject is not used. It infers.
            // Doesn't work with resolve, so we must be explicit there
            add: true
        }))
    .pipe(uglify)
    .pipe($.sourcemaps.write())
    //.pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('js/app'))
    .pipe(browserSync.stream());
});


// Static eoserver with browser-sync
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./",
            middleware: [
                modRewrite(['^([^.]+)$ /index.html [L]'])
            ]
        },
        online: true
    });
});

// run "gulp watch" just to build.
gulp.task('watch', ['sass', 'typescript'], (function() {
  gulp.watch(['client/scss/**/*.scss'], ['sass']);
  gulp.watch(['app/**/*.js'], ['typescript'])
}));

// running "gulp server"
gulp.task('server', ['sass', 'typescript', 'browser-sync'], (function() {
  gulp.watch(['client/scss/**/*.scss'], ['sass']);
  gulp.watch(['app/**/*.ts'], ['typescript'])
  gulp.watch("**/*.html").on('change', browserSync.reload);
}));

function swallowError (error) {
  // If you want details of the error in the console
  console.log(error.toString());
  this.emit('end');
}

