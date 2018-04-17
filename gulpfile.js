var gulp = require('gulp')
var environments = require('gulp-environments')
var image = require('gulp-image');
var sass = require('gulp-sass')
var uglify = require('gulp-uglify-es').default;
var sourcemaps = require('gulp-sourcemaps')
var autoprefixer = require('gulp-autoprefixer')
var browserSync = require('browser-sync').create()
var cleanCSS = require('gulp-clean-css')
var rename = require("gulp-rename")
var babel = require('gulp-babel')

var development = environments.development
var production = environments.production

// paths
let path = {
  src: {
    js: 'src/js/**/*.js',
    scss: 'src/scss/**/*.scss',
  },
  dist: {
    js: 'dist/js',
    css: 'dist/css',
  },
  test: 'test/',
}

gulp.task('serve', function () {
  browserSync.init({
    server: "./"
  })
})

gulp.task('image-demo', function () {
  return gulp.src(path.test + '/' + path.src + '/img/*')
    .pipe(image())
    .pipe(gulp.dest(path.test + '/' + path.dist + '/img'))
    .pipe(browserSync.stream())
})

gulp.task('sass-main', function () {
  return gulp.src(path.src.scss)
    .pipe(development(sourcemaps.init()))
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(cleanCSS())
    .pipe(rename('citrus-slider.min.css'))
    .pipe(development(sourcemaps.write()))
    .pipe(gulp.dest(path.dist.css))
    .pipe(browserSync.stream())
})

gulp.task('js-main', function () {
  return gulp.src(path.src.js)
    .pipe(development(sourcemaps.init()))
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(uglify())
    .pipe(rename('citrus-slider.min.js'))
    .pipe(development(sourcemaps.write()))
    .pipe(gulp.dest(path.dist.js))
    .pipe(browserSync.stream())
})

gulp.task('default', gulp.parallel('sass-main', 'js-main'))

gulp.task('watch:js', function () {
  gulp.watch(path.src.js).on('change', gulp.series('js-main'))
})

gulp.task('watch:scss', function () {
  gulp.watch(path.src.scss).on('change', gulp.series('sass-main'))
})

gulp.task('watch:html', function () {
  gulp.watch("./*.html").on('change', browserSync.reload)
})

gulp.task('watch', gulp.parallel('watch:js', 'watch:scss', 'watch:html', 'serve'))