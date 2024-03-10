const {
	src,
	dest
} = require('gulp');
const imagemin = require('gulp-imagemin');
const bs = require('browser-sync');

module.exports = function rastr() {
	return src('src/img/**/*.+(png|jpg|jpeg|gif|svg|ico)')
		.pipe(imagemin({
			interlaced: true,
			progressive: true,
			optimizationLevel: 5,
		}),)
		.pipe(dest('dist/img'))
		.pipe(bs.stream())
}