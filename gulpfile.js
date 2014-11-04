var gulp    = require('gulp');
var gutil    = require('gulp-util');
var uglify  = require('gulp-uglify');
var concat  = require('gulp-concat');
var clean = require('gulp-clean');
var sequence = require('gulp-sequence');
var minifyCss = require('gulp-minify-css'),
minifyHtml = require('gulp-minify-html'),
rev = require('gulp-rev'),
replace = require('gulp-replace'),
usemin = require('gulp-usemin');

//合并文件
gulp.task('test', function () {
    gulp.src('./bower_components/jquery/src/*.js')
        //.pipe(uglify())
        .pipe(concat('all.min.js'))
        .pipe(gulp.dest('./build'));
});


gulp.task('js-lib', function () {
    return gulp.src([
        'static/bower_components/jquery/dist/jquery.min.js'
        ,'static/bower_components/bootstrap/dist/js/bootstrap.min.js'
        //,'static/bower_components/angular/angular.min.js'
    ])
    .pipe(concat('lib.js'))
    .pipe(gulp.dest('static/dist/js'));
});

gulp.task('js', function () {
    return gulp.src([
        ,'static/bower_components/angular/angular.min.js'
    ])
    .pipe(gulp.dest('static/dist/js'));
});


gulp.task('css-lib', function () {
    return gulp.src([
        'static/bower_components/bootstrap/dist/css/bootstrap.min.css'
    ])
    .pipe(concat('lib.css'))
    .pipe(gulp.dest('static/dist/css'));
});


gulp.task('font', function () {
    return gulp.src('static/bower_components/bootstrap/dist/fonts/*').pipe(gulp.dest('static/dist/fonts'));
});

//清理文件夹
gulp.task('clean', function(cb) {
  	gulp.src(['static/dist/*'],{read:false}).pipe(clean({force:true}));
});

// 定义develop任务在日常开发中使用
gulp.task('develop',function(){
  gulp.run('buildlib');
  //gulp.watch('./javis/static/less/*.less', ['build-less']);
});


gulp.task('dev', function () {
    return gulp.src(['static/view/*/*.jsp','static/view/*.jsp'])
        //.pipe(replace(/(\.js|\.css|\.png|\.gif)/g, '$1'+"?v="+new Date().getTime()))
        .pipe(replace(/(\/static\/(.*)\.(js|css|png|gif))/ig, '$1?v=' + new Date().getTime()))
        .pipe(usemin({
            css: [minifyCss({keepSpecialComments: 0}), rev()],
            //html: [minifyHtml({empty: true})],
            js: [uglify(), rev()]
        }))
        .pipe(gulp.dest('static/publish/'));
});

gulp.task('default',sequence(['js-lib','js','css-lib','font']));

