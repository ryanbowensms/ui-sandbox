'use strict';

const gulp = require('gulp');
const cleandest = require('gulp-clean-dest');
const postcss = require('gulp-postcss');
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const parker = require('gulp-parker');

const metrics = [
    "TotalStylesheets",
    "TotalStylesheetSize",
    "TotalRules",
    "TotalSelectors",
    "TotalIdentifiers",
    "TotalDeclarations",
    "SelectorsPerRule",
    "IdentifiersPerSelector",
    "SpecificityPerSelector",
    "TopSelectorSpecificity",
    "TopSelectorSpecificitySelector",
    "TotalIdSelectors",
    "TotalUniqueColours",
    "UniqueColours",
    "TotalImportantKeywords",
    "TotalMediaQueries",
    "MediaQueries"
];


gulp.task('build', function () {
    return gulp.src('./src/sass/**/*.*ss')
        .pipe(cleandest('./dist/css'))
        .pipe(sass({
            includePaths: ['./node_modules/bootstrap/scss']
        }).on('error', sass.logError))
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


gulp.task('default', gulp.series('build', 'serve'));


gulp.task('parker', function() {
    return gulp.src('./dist/css/main.css')
        .pipe(parker({
            file: 'report.md',
            title: 'Parker report',
            metrics: metrics
        }));
});