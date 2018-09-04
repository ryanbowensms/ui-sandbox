'use strict';

const gulp = require('gulp');
const cleandest = require('gulp-clean-dest');
const postcss = require('gulp-postcss');
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();


gulp.task('build', function () {
    return gulp.src('./src/sass/**/*.*ss')
        .pipe(cleandest('./dist/css'))
        .pipe(sass().on('error', sass.logError))
        .pipe( postcss([require('precss'), require('autoprefixer')]) )
        .pipe(gulp.dest('./dist/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(cssmin())
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
});



gulp.task('serve', function () {
    browserSync.init({
        server: ["./", "dist"]
    });
    gulp.watch('./src/sass/**/*.scss', gulp.series('build'));
    gulp.watch("*.html").on('change', browserSync.reload);
});