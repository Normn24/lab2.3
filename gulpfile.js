const gulp = require('gulp');
const requireDir = require('require-dir');
const tasks = requireDir('./tasks');
const ghPages = require('gulp-gh-pages');


exports.style = tasks.style;
exports.build_js = tasks.build_js;
exports.dev_js = tasks.dev_js;
exports.html = tasks.html;
exports.js_minify = tasks.js_minify;
exports.rastr = tasks.rastr;
exports.bs_html = tasks.bs_html;
exports.watch = tasks.watch;

exports.default = gulp.parallel(
  exports.style,
  exports.dev_js,
  exports.rastr,
  exports.js_minify,
  exports.html,
  exports.bs_html,
  exports.watch
)

gulp.task('deploy', function () {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});
