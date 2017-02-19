const fs = require('fs');

let path = "/Users/mazhibin/project/xxx/hello/third";

// -- link test

// fs.stat(path, (err, stats) => {
//     console.log(err, stats);
//     console.log("isSymbolicLink: " + stats.isSymbolicLink());
// })

// fs.lstat(path, (err, stats) => {
//     console.log(err, stats);
//     console.log("isSymbolicLink: " + stats.isSymbolicLink());
// })


// fs.readdir(path,(err,files)=>{
//     console.log(err, files);
// })

// -- promise test
// path = "/Users/mazhibin/project/xxx/hello/third/four.txt";
// var fsp = require('fs-promise');
// fsp.readFile(path,'utf-8').then(data => {
//     console.log(data);
// })

// fsp.stat(path).then(stats => {
//     console.log(stats);
// })

// -- readdir test
fs.readdir(path,console.log);