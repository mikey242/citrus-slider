var gulp = require('gulp')
var pump = require('pump')
var sass = require('gulp-sass')
let uglify = require('gulp-uglify-es').default;
var sourcemaps = require('gulp-sourcemaps')
var autoprefixer = require('gulp-autoprefixer')
var browserSync = require('browser-sync').create()
var cleanCSS = require('gulp-clean-css')
var rename = require("gulp-rename")

// folders
let folder = {
  src: 'src/',
  dist: 'dist/'
}

gulp.task('default', function () {
  gulp.watch(folder.src + 'sass/*', ['sass'])
  gulp.watch(folder.src + 'js/*', ['js'])
})

gulp.task('sass', function () {
  return gulp.src(folder.src + 'sass/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
    }))
    .pipe(sourcemaps.write())
    .pipe(browserSync.stream())
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest(folder.dist + 'css'))
})

gulp.task('js', function (cb) {
  pump([
      gulp.src(folder.src + 'js/*.js'),
      sourcemaps.init(),
      uglify(),
      sourcemaps.write(),
      rename('skroll-slider.min.js'),
      gulp.dest(folder.dist + 'js/')
    ],
    cb
  );
})