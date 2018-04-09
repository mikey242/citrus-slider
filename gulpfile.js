var gulp = require('gulp')
var pump = require('pump')
var image = require('gulp-image');
var sass = require('gulp-sass')
var uglify = require('gulp-uglify-es').default;
var sourcemaps = require('gulp-sourcemaps')
var autoprefixer = require('gulp-autoprefixer')
var browserSync = require('browser-sync').create()
var cleanCSS = require('gulp-clean-css')
var rename = require("gulp-rename")

// folders
let folder = {
  src: 'src/',
  dist: 'dist/',
  test: 'test/',
  maps: '../map/'
  
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
    sourcemaps.init(),
    sass(),
    autoprefixer({
      browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
    }),
    cleanCSS({
      compatibility: 'ie10'
    }),
    rename('citrus-slider.min.css'),
    sourcemaps.write(folder.maps),
    gulp.dest(dest),
    browserSync.stream()
  ],
  cb
);
}

function jsTask(src, dest, cb) {
  pump([
    gulp.src(src),
    sourcemaps.init(),
    uglify(),
    rename('citrus-slider.min.js'),
    sourcemaps.write(folder.maps),
    gulp.dest(dest)
  ],
  cb
);
}

gulp.task('default', function () {
  browserSync.init({
    server: "./"
  });
  gulp.watch("./*.html").on('change', browserSync.reload);
  gulp.watch(folder.src + 'img/*', ['image-app'])
  gulp.watch('demo/*', ['image-demo'])
  gulp.watch(folder.src + 'sass/*.scss', ['sass-main'])
  gulp.watch(folder.src + 'js/*.js', ['js-main'])
})

gulp.task('image-app', function (cb) {
  imageTask(folder.src + 'img/*', folder.dist + 'img/', cb)
})

gulp.task('image-demo', function (cb) {
  imageTask(folder.test + '/' + folder.src + '/img/*', folder.test + '/' + folder.dist + '/img', cb)
})

gulp.task('sass-main', function (cb) {
  sassTask(folder.src + 'sass/*.scss', folder.dist + 'css/', cb)
})

gulp.task('js-main', function (cb) {
  jsTask(folder.src + 'js/*.js', folder.dist + 'js/', cb)
})