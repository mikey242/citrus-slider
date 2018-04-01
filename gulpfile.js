var gulp = require('gulp')
let sass = require('gulp-sass')
// let concat = require('gulp-concat')
// let deporder = require('gulp-deporder')
// let stripdebug = require('gulp-strip-debug')
// let rename = require('gulp-rename')
let uglify = require('gulp-uglify-es').default
let gutil = require('gulp-util')
let sourcemaps = require('gulp-sourcemaps')
let autoprefixer = require('gulp-autoprefixer')
let browserSync = require('browser-sync').create()
let browserify = require('browserify')
let source = require('vinyl-source-stream')
let buffer = require('vinyl-buffer')
let purify = require('gulp-purifycss')
let cleanCSS = require('gulp-clean-css')
// svgmin = require('gulp-svgmin')
let images = require('gulp-image')
// let devBuild = (process.env.NODE_ENV !== 'production')

// folders
let folder = {
  src: 'src/',
  dist: 'dist/',
  plug: 'inc/plugins/'
}

gulp.task('default', function () {
// Default task
})

gulp.task('serve', function () {
  browserSync.init({
    proxy: 'skroll.oo',
    ghostMode: false,
    port: '80'
  })
  // sass changes
  gulp.watch(folder.src + 'scss/**/*', ['sass'])
  // js changes
  gulp.watch(folder.src + 'js/**/*', ['js-watch'])
  // svg changes
  gulp.watch(folder.src + 'img/**/*', ['imagemin'])
  gulp.watch('index.php').on('change', browserSync.reload)
})

gulp.task('sass', function () {
  return gulp.src(folder.src + 'scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 2 versions', '> 5%', 'Firefox ESR']}))
    .pipe(sourcemaps.write())
    .pipe(browserSync.stream())
    // .pipe(purify(['./*.php', './template-parts/*.php', './inc/*.php', folder.dist + 'js/*.js']))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(folder.dist + 'css'))
})

gulp.task('js-watch', ['browserify'], function (done) {
  browserSync.reload()
  done()
})

gulp.task('image-watch', ['imagemin'], function (done) {
  browserSync.reload()
  done()
})

gulp.task('imagemin', function () {
  gulp.src(folder.src + 'img/*')
    .pipe(images({
      zopflipng: false
    }))
    .pipe(gulp.dest(folder.dist + 'img/'))
    .pipe(browserSync.stream())
})

// JavaScript processing
gulp.task('browserify', function () {
  return browserify(folder.src + 'js/app.js')
    .bundle()
    .pipe(source('bundle.js')) // Pass desired output filename to vinyl-source-stream
    .pipe(buffer()) // Convert from streaming to buffered vinyl file object
    .pipe(uglify())
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()) })
    .pipe(gulp.dest(folder.dist + 'js/')) // Start piping stream to tasks!
})
