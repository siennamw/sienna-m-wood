const {src, dest, parallel, watch} = require('gulp');
const less = require('gulp-less');
const nunjucksRender = require('gulp-nunjucks-render');
const webserver = require('gulp-webserver');

/* Nunjucks
 * -----------------------------------*/
const nunjucks = async () => {
  // Gets .html, .shtml, and .nunjucks files in sources/content
  return src([
    './sources/content/**/*.+(html|shtml|nunjucks)'
  ]).pipe(nunjucksRender({
    // Renders template with nunjucks
    path: ['./sources/templates']
  })).pipe(dest('./build')); // output files in build folder
};

/* Compile LESS to sources
 * -----------------------------------*/
const compileLess = () => {
  return src('./sources/css/*.+(less|css)').pipe(less({
    paths: ['./sienna-boilerplate/']
  })).pipe(dest('./build/css'));
};

/* Copy JS to build
 * -----------------------------------*/
const copyJS = () => {
  return src([
    './sienna-boilerplate/sienna-boilerplate.js'
  ]).pipe(dest('./build/js'));
};

/* Copy Images to build
 * -----------------------------------*/
const copyImages = () => {
  return src('./sources/images/**/*', {encoding: false}).pipe(dest('./build/images'));
};

/* Watch source files (for development)
 * -----------------------------------*/
const watchSource = () => {
  watch([
    './sources/templates/**/*',
    './sources/content/**/*'
  ], {ignoreInitial: false}, nunjucks);
  watch('./sources/css/**/*', {ignoreInitial: false}, compileLess);
};

/* Local Server
 * ---------------------------------- */
const serve = () => {
  return src('build').pipe(webserver({
    port: '9090', livereload: true, open: true
  }));
};

exports.build = parallel(copyJS, copyImages, compileLess, nunjucks);
exports.start = parallel(copyJS, copyImages, watchSource, serve);
