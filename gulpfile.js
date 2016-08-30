'use strict';

// todo:使用gulp-load-plugins简化文件
// todo:添加gulp-inject, wiredep

var gulp = require('gulp'),
    server = require('gulp-develop-server'),
    browserSync = require('browser-sync').create();


gulp.task('server:start', [], function() {
  server.listen({path: './app.js'}, function() {
    gulp.start('browser:run');
  });
});

gulp.task('browser:run', function() {
  browserSync.init({
    proxy: "http://localhost:8000"
  });
});

gulp.task('serve', ['server:start']);

gulp.task('server:restart', [], function() {
  server.restart(function() {
    gulp.start('browser:reload');
  });
});

gulp.task('browser:reload', function() {
  browserSync.reload();
});

gulp.watch(['./public/**/*.*', './views/**/*.*', 'app.js'], ['server:restart']);
