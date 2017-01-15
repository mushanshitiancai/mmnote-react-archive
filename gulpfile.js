'use strict';

var gulp = require('gulp');
var electron = require('electron-connect').server.create();
var webpack = require('webpack-stream');
var mocha = require('gulp-mocha');
var ts = require("gulp-typescript");
var sourcemaps = require('gulp-sourcemaps');
var tsProject = ts.createProject("tsconfig.json");
var p = require('path');

gulp.task("typescript", function () {
    return gulp.src("./app/**/*.ts")
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});

gulp.task("copyHtml", function () {
    return gulp.src("./app/index.html")
        .pipe(gulp.dest("dist"));
});

gulp.task('restartElectron', function () {
    electron.restart()
});

gulp.task('webpack', function () {
    return gulp.src('./lib/index.tsx')
        .pipe(webpack(require('./webpack.config.js'), null, function (err, stat) {
            electron.reload();
        }))
        .pipe(gulp.dest("./dist"))
});

gulp.task('typescriptForTest', function () {
    return gulp.src(["./lib/**/*.ts*", "./test/**/*.ts"], { base: "./" })
        .pipe(sourcemaps.init())
        .pipe(tsProject()).js
        .pipe(sourcemaps.write("./maps", {
            sourceRoot: function (file) {
                return p.join(file.cwd, 'lib');
            }
        }))
        .pipe(gulp.dest("test-out/"));
});

gulp.task('test', ['typescriptForTest'], function () {
    return gulp.src('./test-out/**/*.spec.js')
        .pipe(mocha());
});

gulp.task('default', ["typescript", "copyHtml", "restartElectron", 'webpack'], function () {

    // Start browser process
    electron.start();

    // Restart browser process
    gulp.watch('app/**', ["typescript", "copyHtml", "restartElectron"]);

    // Reload renderer process
    gulp.watch('lib/**', ['webpack']);
});