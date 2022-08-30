/* Sienna M. Wood, 2016 */

require('dotenv').config();

var gulp = require('gulp');
var nunjucksRender = require('gulp-nunjucks-render');
var less = require('gulp-less');
var gpath = require('path');
var webserver = require('gulp-webserver');
var rsync = require('gulp-rsync');


/* Nunjucks
 * -----------------------------------*/
gulp.task('nunjucks', function () {
    // Gets .html, .shtml, and .nunjucks files in sources/content
    return gulp.src(['./sources/content/**/*.+(html|shtml|nunjucks)', '!./sources/content/demo.html'])
    // Renders template with nunjucks
        .pipe(nunjucksRender({
            path: ['./sources/templates']
        }))
        // output files in build folder
        .pipe(gulp.dest('./build')
    );
});

/* Compile LESS to sources
 * -----------------------------------*/
gulp.task('less', function () {
    return gulp.src('./sources/css/*.+(less|css)')
        .pipe(less({
            paths: [gpath.join(__dirname, 'less', 'includes')]
        }))
      .pipe(gulp.dest('./build/css')
    );
});

/* Copy JS to build
 * -----------------------------------*/
gulp.task('copyJS', function () {
    gulp.src(['./sources/js/scripts.js',
        './sienna-boilerplate/sienna-boilerplate.js'])
        .pipe(gulp.dest('./build/js')
    );
});

/* Copy Images to build
 * -----------------------------------*/
gulp.task('copyImages', function () {
    gulp.src('./sources/images/**/*')
        .pipe(gulp.dest('./build/images')
    );
});

/* Build
 * -----------------------------------*/
gulp.task('build', ['nunjucks', 'less', 'copyJS', 'copyImages']);
// also make this the default
gulp.task('default', ['build']);

/* Watch
 * ---------------------------------- */
gulp.task('watch:less', function() {
  gulp.watch('./sources/css/*.+(less|css)', ['less'])
});

gulp.task('watch:html', function() {
  gulp.watch(['./sources/templates/**/*', './sources/content/**/*'], ['nunjucks'])
});

/* Local Server
 * ---------------------------------- */
gulp.task('serve', ['build', 'watch:less', 'watch:html'], function () {
    gulp.src('build')
        .pipe(webserver({
            port: '9090',
            livereload: true,
            open: true
        })
    );
});

/* Deploy
 * -----------------------------------*/
gulp.task('deploy', ['build'], function () {
    return gulp.src('build/**/*')
        .pipe(rsync({
            root: 'build/',
            hostname: process.env.HOSTNAME,
            destination: process.env.DESTINATION
        })
    );
});
