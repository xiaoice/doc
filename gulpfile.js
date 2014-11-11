var crypto = require('crypto');
var gulp    = require('gulp');
var uglify  = require('gulp-uglify');
var concat  = require('gulp-concat');
var clean = require('gulp-clean');
var sequence = require('gulp-sequence');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var minifyCss = require('gulp-minify-css'),
minifyHtml = require('gulp-minify-html'),
rev = require('gulp-rev'),
usemin = require('gulp-usemin');


var md5=(function md5(str) {
    return crypto.createHash('md5').update(new Date().getTime().toString()).digest('hex').slice(0, 8);
})();



gulp.task('dev-js', function () {
    gulp.src([
        '!static/src/js/sea.js',
        '!static/src/js/sea.config.js',
        'static/src/js/**/*.js'
    ])
    .pipe(gulp.dest('static/dist/js'));
});

gulp.task('dev-js-lib', function () {
    gulp.src([
        'static/bower_components/jquery/dist/jquery.js'
        ,'static/bower_components/bootstrap/dist/js/bootstrap.js'
    ])
    .pipe(gulp.dest('static/dist/js'));

    gulp.src([
        'static/src/js/sea.js',
        'static/src/js/sea.config.js'
    ])
    .pipe(concat("lib.js"))
    .pipe(gulp.dest('static/dist/js'));
});


gulp.task('dev-css', function () {
    return gulp.src([
        'static/src/css/app.css'
    ])
    .pipe(gulp.dest('static/dist/css/'));
});

gulp.task('dev-css-lib', function () {
    return gulp.src([
        'static/bower_components/bootstrap/dist/css/bootstrap.css'
    ])
    .pipe(concat("lib.css"))
    .pipe(gulp.dest('static/dist/css'));
});

gulp.task('dev-html', function () {
    gulp.src([
        '!static/src/plugin/**/*.html',
        'static/src/**/*.html'
    ])
    .pipe(rename({extname:".ejs"}))
    .pipe(gulp.dest('static/dist/'));

    gulp.src([
        'static/src/plugin/**/*',
    ])
    .pipe(gulp.dest('static/dist/plugin'));
});

gulp.task('font', function () {
    return gulp.src('static/bower_components/bootstrap/dist/fonts/*').pipe(gulp.dest('static/dist/fonts'));
});




gulp.task('js-lib', function () {
    return gulp.src([
        'static/bower_components/jquery/dist/jquery.js'
        ,'static/bower_components/bootstrap/dist/js/bootstrap.js'
    ])
    .pipe(uglify())
    .pipe(concat("lib.js"))
    .pipe(rename({
        //extname:"",
        //prefix: "",
        suffix: "_"+md5
    }))
    .pipe(gulp.dest('static/dist/js'));
});

gulp.task('css-lib', function () {
    return gulp.src([
        'static/bower_components/bootstrap/dist/css/bootstrap.css'
    ])
    .pipe(minifyCss())
    .pipe(concat("lib.css"))
    .pipe(rename({
        suffix: "_"+md5
    }))
    .pipe(gulp.dest('static/dist/css'));
});

gulp.task('js', function () {
    return gulp.src([
        'static/src/js/app.js'
    ])
        .pipe(uglify())
        .pipe(rename({
            suffix: "_"+md5
        }))
        .pipe(gulp.dest('static/dist/js'));
});

gulp.task('css', function () {
    return gulp.src([
        'static/src/css/app.css'
    ])
    .pipe(minifyCss())
    .pipe(rename({
        suffix: "_"+md5
    }))
    .pipe(gulp.dest('static/dist/css/'));
});

gulp.task('html', function () {
    return gulp.src(['static/src/*.html'])
        .pipe(replace(/((link|script)(.*))\.(js|css|png|gif)/ig, '$1_'+md5+'.$4'))
        .pipe(minifyHtml({empty: true}))
        .pipe(rename({ extname:".ejs"}))
        .pipe(gulp.dest('static/dist/'));
});

//清理文件夹
gulp.task('clean', function() {
  	return gulp.src(['static/dist'],{read:false}).pipe(clean({force:true}));
});




gulp.task('jsp', function () {
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

gulp.task('usemin', function() {
    gulp.src(['static/src/*.html'])
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            html: [minifyHtml({empty: true})],
            js: [uglify(), rev()]
        }))
        .pipe(gulp.dest('static/dist/'));
});

// 监听
gulp.task('watch', function() {
    gulp.watch(['static/src/js/*.js','static/src/js/modules/*.js'], ['dev-js']);
    gulp.watch('static/src/css/app.css', ['dev-css']);
    gulp.watch('static/src/*.html', ['dev-html']);
});


gulp.task('public',['clean'],function(){
    gulp.run(['js-lib','css-lib','font','js','css','html']);
});

gulp.task('default',['clean'],function(){
    gulp.run(['dev-js-lib','dev-css-lib','font','dev-js','dev-css','dev-html','watch']);
});



//gulp.task('default',sequence(['js-lib','css-lib','font','js','css','html']));

