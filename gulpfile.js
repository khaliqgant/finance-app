var projectName = '';

var
    paths = {
    sass_files: '../assets/sass/*.scss',
    coffee_files: '../assets/coffee/*.coffee',
    js_destination:'../assets/js',
    css_destination:'../assets/css',
};

var
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    runSequence = require('run-sequence'),
    sass = require('gulp-sass'),
    coffee = require('gulp-coffee'),
    react = require('gulp-react'),
    gutil = require('gulp-util');

// default task, run everything
gulp.task('default', function(callback){
    runSequence('sass', 'coffee', callback);
});

//compile the jsx into js
gulp.task('react', function(){
    return gulp.src('../assets/js/react/' + projectName + '.jsx')
    .pipe(react())
    .pipe(gulp.dest(paths.js));
});

//compile the coffee
gulp.task('coffee', function(){
    gulp.src(paths.coffee_files)
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest(paths.js_destination));
});

//compile the scss
gulp.task('sass', function () {
    gulp.src(paths.sass_files)
    .pipe(sass())
    .pipe(gulp.dest(paths.css_destination))
    .pipe(cssmin())
    .pipe(gulp.dest(paths.css_destination));
});

// watch task
gulp.task('watch', function() {
    gulp.watch(paths.sass_files, ['sass']);
    gulp.watch(paths.coffee_files, ['coffee']);
});
