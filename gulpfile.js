var gulp = require('gulp'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    svgmin = require('gulp-svgmin'),
    minifyCss = require('gulp-minify-css')
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify');

    gulp.task('sass', function () {
        return gulp.src('./sass/*.scss')
            .pipe(sass({
                outputStyle: ['expanded']
            }))
            .pipe(postcss([ autoprefixer({ 
                browsers: ['IE >= 7', 'last 10 versions', 'Firefox >=3.6', 'Opera 10.1', 'Safari >= 3.1', 'ios_saf 8.1-8.4', 'and_chr >= 3'],
                cascade: true
            }) ]))
            .pipe(gulp.dest('./css/'))
            .pipe(minifyCss({compatibility: 'ie8'}))
            .pipe(rename({suffix: '.min'}))
            .pipe(concat('all.css'))
            .pipe(gulp.dest('./dist/css/'));
    });
    
    gulp.task('svg', function () {
        return gulp.src('./img/*.jpeg')
            .pipe(svgmin())
            .pipe(gulp.dest('./dist/img/'));
    });

    gulp.task('img', function () {
        return gulp.src('./img/*.png')
            .pipe(imagemin({
                progressive: true,
                use: [pngquant()]
            }))
            .pipe(gulp.dest('./dist/img/'));
    });

    gulp.task('js', function () {
        return  gulp.src('./js/main.js')
            //.pipe(uglify())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest('./dist/js/'));
    });

    gulp.task('sync', function () {
        browserSync.init({
            server: {
                baseDir: './'
            }
        });

        gulp.watch('css/*.css').on('change', browserSync.reload);
        gulp.watch('*.html').on('change', browserSync.reload);
    });

    gulp.task('default', ['sync'], function() { 

	    gulp.watch('./sass/**', function(event) {
	        gulp.run('sass');
	    });

        //gulp.watch('./js/*.js', function(event) {
        //    gulp.run('js');
        //});

        //gulp.watch('./img/*.svg', function(event) {
        //    gulp.run('svg');
        //});
        //gulp.watch('./img/*.png', function(event) {
        //    gulp.run('img');
        //});
        //gulp.watch('./img/*.img', function(event) {
        //    gulp.run('img');
        //});
	});