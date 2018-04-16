var gulp = require('gulp')
var environments = require('gulp-environments')
var pump = require('pump')
var image = require('gulp-image');
var sass = require('gulp-sass')
var uglify = require('gulp-uglify-es').default;
var sourcemaps = require('gulp-sourcemaps')
var autoprefixer = require('gulp-autoprefixer')
var browserSync = require('browser-sync').create()
var cleanCSS = require('gulp-clean-css')
var rename = require("gulp-rename")

var development = environments.development;
var production = environments.production;

// folders
let folder = {
  src: 'src/',
  dist: 'dist/',
  test: 'test/',
}

function imageTask(src, dest, cb) {
  pump([
    gulp.src(src),
    image(),
    gulp.dest(dest),
    browserSync.stream()
  ], cb)
}

function sassTask(src, dest, cb) {
  pump([
      gulp.src(src),
      development(sourcemaps.init()),
      sass(),
      autoprefixer({
        browsers: ['last 2 versions']
      }),
      cleanCSS(),
      rename('citrus-slider.min.css'),
      development(sourcemaps.write()),
      gulp.dest(dest),
      browserSync.stream()
    ],
    cb
  );
}

function jsTask(src, dest, cb) {
  pump([
      gulp.src(src),
      development(sourcemaps.init()),
      uglify(),
      rename('citrus-slider.min.js'),
      development(sourcemaps.write()),
      gulp.dest(dest),
      browserSync.stream()
    ],
    cb
  );
}

gulp.task('default', ['build'])

gulp.task('build', ['sass-main', 'js-main'])

gulp.task('watch', function () {
  browserSync.init({
    server: "./"
  });
  gulp.watch("./*.html").on('change', browserSync.reload);
  gulp.watch(folder.src + 'img/*', ['image-app'])
  gulp.watch('demo/*', ['image-demo'])
  gulp.watch(folder.src + 'scss/**/*.scss', ['sass-main'])
  gulp.watch(folder.src + 'js/*.js', ['js-main'])
})

gulp.task('image-demo', function (cb) {
  imageTask(folder.test + '/' + folder.src + '/img/*', folder.test + '/' + folder.dist + '/img', cb)
})

gulp.task('sass-main', function (cb) {
  sassTask(folder.src + 'scss/*.scss', folder.dist + 'css/', cb)
})

gulp.task('js-main', function (cb) {
  jsTask(folder.src + 'js/*.js', folder.dist + 'js/', cb)
})