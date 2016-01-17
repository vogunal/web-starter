// Plugins and Setup
var gulp = require('gulp');
var $ = require('gulp-load-plugins')()
var sassGlob = require('gulp-sass-glob');
var browserSync = require('browser-sync').create();
var webpack = require('webpack-stream');
var stylish = require('jshint-stylish');

// Folders and Files
var paths = {
    dev: 'dev',
    scssFiles: 'dev/scss/**/*.scss',
    scssFolder: 'dev/scss',
    cssFolder: 'build/css',
    jadeFolder: 'dev/**/*.jade',
    htmlFolder: 'build',
    imageSource: 'dev/img/*',
    imageDestination: 'build/img',
    jsFiles: 'dev/js/**/*.js',
    jsMain: 'dev/js/*.js',
    jsDevFolder: 'dev/js/',
    jsVendor: 'dev/js/vendor/**/*.js',
    jsDestination: 'build/js',
    build: 'build'
};

// Compile JADE
gulp.task('jade', function() {
  gulp.src("dev/index.jade")
    .pipe($.jade({
        pretty: true
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
        .pipe($.jshint())
        .pipe($.jshint.reporter(stylish))
        .pipe(webpack(require(__dirname + '/webpack.config.js')))
        // .pipe(webpack(require(__dirname + '/webpack.config.js'), {
        //
        // }, null, function(err, stats) {
        //
        // }))
        .pipe(gulp.dest(paths.jsDestination))
        .pipe(browserSync.stream());
});

// Webpack Stuff
gulp.task('webpack', function() {
  gulp.src('dev/js')
    .pipe(webpack({
        resolve: {
            root: path.resolve('dev/js')
        },
        entry: 'main.js',
        output: {
            filename: 'bundle.js'
        },
    }))
    .pipe(gulp.dest(paths.jsDestination));
});

// Minify Images
gulp.task('imageMin', function() {
    gulp.src(paths.imageSource)
        .pipe($.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}]
        }))
        .pipe(gulp.dest(paths.imageDestination))
});


// BrowserSync & Watch Tasks
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
gulp.task('default', ['serve']);

// Build Task
gulp.task('build', ['jade', 'sass', 'js', 'imageMin']);
