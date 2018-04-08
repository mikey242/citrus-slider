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
  dist: 'dist/'
}

gulp.task('default', function () {
  browserSync.init({
    server: "./"
  });
  gulp.watch("./*.html").on('change', browserSync.reload);
  gulp.watch(folder.src + 'img/*', gulp.series('image'))
  gulp.watch('demo/*', gulp.series('image-demo'))
  gulp.watch(folder.src + 'sass/*', gulp.series('sass'))
  gulp.watch(folder.src + 'js/*', gulp.series('js'))
})

gulp.task('image', function (cb) {
  pump([
      gulp.src(folder.src + 'img/*'),
      image(),
      gulp.dest(folder.dist + 'img/'),
      browserSync.stream()
    ],
    cb
  );
})

gulp.task('image-demo', function (cb) {
  pump([
      gulp.src('demo/*', {base: './'}),
      image(),
      gulp.dest('./'),
    ],
    cb
  );
})

gulp.task('sass', function (cb) {
  pump([
      gulp.src(folder.src + 'sass/*.scss'),
      sass(),
      autoprefixer({
        browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
      }),
      cleanCSS({
        compatibility: 'ie8'
      }),
      rename('citrus-slider.min.css'),
      gulp.dest(folder.dist + 'css'),
      browserSync.stream()
    ],
    cb
  );
})

gulp.task('js', function (cb) {
  pump([
      gulp.src(folder.src + 'js/*.js'),
      // sourcemaps.init(),
      uglify(),
      // sourcemaps.write(),
      rename('citrus-slider.min.js'),
      gulp.dest(folder.dist + 'js/')
    ],
    cb
  );
})