var gulp = require('gulp'),
//    sass = require('gulp-sass'),
    compass = require('gulp-compass'),
    minifyCSS = require('gulp-minify-css'),
//    sourcemaps = require('gulp-sourcemaps'),
    changed = require('gulp-changed');
//    uglify = require('gulp-uglify');

//var raw_css = './public/scss',
//    com_css = './public/css'

//gulp.task('sass', function () {
//    gulp.src(raw_css+'/*.scss')
//        .pipe(changed(raw_css+'/*.scss'))
//        .pipe(sourcemaps.init())
//        .pipe(sass())
//        .pipe(sourcemaps.write('/'))
//        .pipe(mincss())
//        .pipe(gulp.dest(com_css));
//});


gulp.task('compass', function () {
    gulp.src('./public/scss/*.scss')
        .pipe(compass({
            css: './public/css',
            sass: './public/scss'
        }))
        .pipe(minifyCSS({
            advanced: false,
            aggressiveMerging: false,
        }))
        .pipe(gulp.dest('./public/css'));
});


gulp.task('watch', function () {
    gulp.watch('./public/scss/*.scss', ['sass']);
});

gulp.task('default', function () {
    gulp.run('compass');
//    gulp.run('watch');
});