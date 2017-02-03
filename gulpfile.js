'use strict';

var gulp = require('gulp');
var electron = require('electron-connect').server.create();
// var webpack = require('webpack-stream');
var gutil = require("gulp-util");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var mocha = require('gulp-mocha');
var ts = require("gulp-typescript");
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var p = require('path');
var fs = require('fs');
var _ = require('lodash');
var merge2 = require('merge2');

var tsMainProject = ts.createProject("tsconfig.main.json");
var tsRenderProject = ts.createProject("tsconfig.render.json");
var tsTestProject = ts.createProject("tsconfig.test.json");

const mainCode = ['src/main/**/*.ts*', 'src/common/**/*.ts*'];
const renderCode = ['src/render/**/*.ts*', 'src/common/**/*.ts*'];
const webpackConfig = require('./webpack.config.js');
const flagFile = './dist/flag';

process.env.NODE_ENV = 'development';

gulp.task('main', [], function () {
    return gulp.src(mainCode, { base: './src' })
        .pipe(tsMainProject())
        .js.pipe(gulp.dest("dist"));
});

gulp.task("main-res", function () {
    return gulp.src("./src/main/res/**/*", { base: './src' })
        .pipe(gulp.dest("dist"));
});

gulp.task('main-w', ['main-res', 'main'], function () {
    electron.start();
    gulp.watch(mainCode, ['main']);

    gulp.watch(flagFile, function () {
        console.log('>>>> flagFile update');
        electron.restart();
    });
});

function webpackTask(watch, cb) {
    var compiler = webpack(_.merge(webpackConfig, { watch: watch }), function (err, stats) {
        console.log(`webpack callback err=${err}`);
        if (err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString("minimal"));
        if (cb) cb();
    });

    // if (watch) {
    //     new WebpackDevServer(compiler, {

    //     }).listen(8080, 'localhost', function (err) {
    //         if (err) throw new gutil.PluginError('webpack-dev-server', err);
    //         gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");

    //         // gulpCallback();
    //     });
    // }
}

// function webpackTask(watch,cb) {
//     gulp.src('src/render/index.tsx')
//         .pipe(webpack(_.merge(webpackConfig, { watch: watch }), null, function (err, stat) {
//             console.log("webpack : ", err);
//             if(cb instanceof Function){
//                 cb();
//             }
//         }).on('error', function (err) {
//             // fix issue https://github.com/shama/webpack-stream/issues/34
//             console.log("webpack task error:", err);
//             // this.emit('end');
//         }))
//         .pipe(gulp.dest("./dist"));
// }


gulp.task('webpack', function (cb) {
    webpackTask(false, cb);
});

gulp.task('webpack-w', [], function (cb) {
    webpackTask(true, function () {
        electron.reload();
    });
});

gulp.task('all-w', ['main-w', 'webpack-w'], function () {

});

gulp.task('update-flag-file', function () {
    fs.writeFileSync(flagFile, new Date(), 'utf-8');
});











// gulp.task("typescript", function () {
//     return gulp.src("./app/**/*.ts")
//         .pipe(tsTestProject())
//         .js.pipe(gulp.dest("dist"));
// });

// gulp.task("copyHtml", function () {
//     return gulp.src("./app/index.html")
//         .pipe(gulp.dest("dist"));
// });

// gulp.task('restartElectron', function () {
//     electron.restart()
// });

// gulp.task('webpack', function (cb) {
//     return gulp.src('./lib/index.tsx')
//         .pipe(webpack(require('./webpack.config.js'), null, function (err, stat) {
//             if (err) {
//                 cb(err);
//             } else {
//                 electron.reload();
//             }
//         }))
//         .pipe(gulp.dest("./dist"))
// });

// gulp.task('clean-test', function (done) {
//     return del('./test-out');
// });

// gulp.task('typescriptForTest', ['clean-test'], function () {
//     return gulp.src(["./lib/**/*.ts*", "./test/**/*.ts"], { base: "./" })
//         .pipe(sourcemaps.init())
//         .pipe(tsTestProject()).js
//         .pipe(sourcemaps.write("./maps", {
//             sourceRoot: function (file) {
//                 return p.join(file.cwd, 'lib');
//             }
//         }))
//         .pipe(gulp.dest("test-out/"));
// });

// gulp.task('copy-test-res', ['clean-test'], function () {
//     return gulp.src(['./test/res/**/*'], { base: './' })
//         .pipe(gulp.dest('./test-out'));
// });

// gulp.task('test', ['copy-test-res', 'typescriptForTest'], function () {
//     return gulp.src('./test-out/**/*.spec.js')
//         .pipe(mocha());
// });

// gulp.task('default', ["typescript", "copyHtml", 'webpack'], function () {

//     // Start browser process
//     electron.start();

//     // Restart browser process
//     gulp.watch('app/**', ["typescript", "copyHtml", "restartElectron"]);

//     // Reload renderer process
//     gulp.watch('lib/**', ['webpack']);
// });

// gulp.task('main', ["typescript", "copyHtml"], function () {
//     electron.start();
// });