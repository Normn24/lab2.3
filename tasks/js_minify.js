const minify = require('gulp-minify');
var gulp = require('gulp');

module.exports = function js_minify() {
  return gulp.src(['lib/*.js', 'lib/*.mjs'])
    .pipe(minify())
    .pipe(gulp.dest('dist'))
}