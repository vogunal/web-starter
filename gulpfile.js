// Plugins and Setup
var gulp = require('gulp');
var $ = require('gulp-load-plugins')()
var sassGlob = require('gulp-sass-glob');
var browserSync = require('browser-sync').create();

// Folders and Files
var paths = {
    dev: 'dev',
    scssFiles: 'dev/scss/**/*.scss',
    scssFolder: 'dev/scss',
    cssFolder: 'build/css',
    jadeFolder: 'dev/**/*.jade',
    htmlFolder: 'build',
    imageSource: 'dev/img',
    imageDestination: 'build/img',
    jsFiles: 'dev/js/**/*.js',
    jsMain: 'dev/js/*.js',
    jsVendor: 'dev/js/vendor/**/*.js',
    jsDestination: 'build/js',
    build: 'build'
};


// Compile JADE
gulp.task('jade', function() {
  gulp.src(paths.jadeFolder)
    .pipe($.jade({

    }))
    .pipe(gulp.dest(paths.build))
    .pipe(browserSync.stream());
});

// Handle SCSS
gulp.task('sass', function () {
  gulp.src(paths.scssFiles)
    .pipe($.changed(paths.cssFolder))
    .pipe(sassGlob())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.autoprefixer({
        browsers: ['last 4 versions'],
        cascade: false
    }))
    .pipe(gulp.dest(paths.cssFolder))
    .pipe(browserSync.stream());
});

// Handle JS
gulp.task('js', function() {
    gulp.src(paths.jsMain)
        .pipe($.babel({
            presets: ['es2015']
        }))
        .pipe($.concat('main.js'))
        .pipe(gulp.dest(paths.jsDestination));
});

// Minify Images

// BrowserSync
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "build/"
        }
    });
    gulp.watch(paths.scssFiles, ['sass']);
    gulp.watch(paths.jadeFolder, ['jade']);
    gulp.watch(paths.jsFiles, ['js']);
    gulp.watch(paths.htmlFolder).on('change', browserSync.reload);
});


// Default Task

// Watch Task

// Build Task
