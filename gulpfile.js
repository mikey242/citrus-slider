var gulp = require('gulp')
let sass = require('gulp-sass')
let uglify = require('gulp-uglify-es').default
let gutil = require('gulp-util')
let sourcemaps = require('gulp-sourcemaps')
let autoprefixer = require('gulp-autoprefixer')
let browserSync = require('browser-sync').create()
let purify = require('gulp-purifycss')
let cleanCSS = require('gulp-clean-css')
let rename = require("gulp-rename")

// folders
let folder = {
  src: 'src/',
  demo: 'demo/'
}

gulp.task('default', function () {
  gulp.watch(folder.src + 'sass/*', ['sass'])
  gulp.watch(folder.src + 'js/*', ['js'])
})

gulp.task('sass', function () {
  return gulp.src(folder.src + 'sass/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 2 versions', '> 5%', 'Firefox ESR']}))
    .pipe(sourcemaps.write())
    .pipe(browserSync.stream())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(folder.demo + 'css'))
})

gulp.task('js', function () {
  return gulp.src(folder.src + 'js/*.js')
    .pipe(uglify())
    .pipe(rename('skroll-slider.min.js'))
    .pipe(gulp.dest(folder.demo + 'js/')) // Start piping stream to tasks!
  browserSync.reload()
})
