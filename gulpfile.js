var gulp    = require('gulp');
var gutil    = require('gulp-util');
var uglify  = require('gulp-uglify');
var concat  = require('gulp-concat');
var clean = require('gulp-clean');

//合并文件
gulp.task('test', function () {
    gulp.src('./bower_components/jquery/src/*.js')
        //.pipe(uglify())
        .pipe(concat('all.min.js'))
        .pipe(gulp.dest('./build'));
});

//构建项目目录
gulp.task('buildLib', function () {
    gulp.src('./bower_components/jquery/dist/jquery.min.js').pipe(gulp.dest('./build/js'));
    gulp.src('./bower_components/bootstrap/dist/js/bootstrap.min.js').pipe(gulp.dest('./build/js'));
    gulp.src('./bower_components/angular/angular.min.js').pipe(gulp.dest('./build/js'));

    gulp.src('./bower_components/bootstrap/dist/css/bootstrap.min.css').pipe(gulp.dest('./build/css'));
    gulp.src('./bower_components/bootstrap/dist/fonts/*').pipe(gulp.dest('./build/fonts'));
});

//清理文件夹
gulp.task('clean', function(cb) {
  	gulp.src(['./build/*'],{read:false}).pipe(clean({force:true}));
});

// 定义develop任务在日常开发中使用
gulp.task('develop',function(){
  gulp.run('buildlib');
  //gulp.watch('./javis/static/less/*.less', ['build-less']);
});

gulp.task('default', ['clean'],function(){
	gulp.run('buildlib');
});