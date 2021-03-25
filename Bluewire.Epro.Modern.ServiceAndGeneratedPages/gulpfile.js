const gulp = require('gulp');
const concat = require('gulp-concat');
const gulpLess = require('gulp-less');
const sourcemaps = require('gulp-sourcemaps');
const argv = require('yargs').argv;
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const exec = require('child_process').exec;
const fs = require('fs-extra');
const clone = require('gulp-clone');
const rename = require("gulp-rename");
const merge = require('merge-stream');
const path = require('path');
const _ = require("underscore");
const _str = require("underscore.string");

const minify = argv.minify == 'true';

const dependenciesFolder = argv.dependenciesFolder;

function getDependencyFiles() {
    const dependenciesPath = path.join(dependenciesFolder, 'script-dependencies.txt');
    console.log("Reading dependencies from: ", dependenciesPath);

    const files = fs.readFileSync(dependenciesPath, 'utf8').replace(/\r/g, '').split('\n').filter(x => !_str.isBlank(x));

    const missingFiles = _.filter(files, path => !fs.existsSync(path));
    if (missingFiles.length) {
        console.log("Could not find the following script dependencies:\n", files.join("\n"), "\n");
    }

    console.log("Found", files.length - missingFiles.length, "/", files.length, "script dependencies");
    return files;
}

const files = getDependencyFiles();
const jsSourceFiles = files.filter(filename => _str.endsWith(filename, '.js'));
const declarationFiles = files.filter(filename => _str.endsWith(filename, '.d.ts'));

const minifyOptions = {
    compress: {
        keep_fnames: true
    },
    mangle: {
        keep_fnames: true
    }
};

// Increased stack size (combined with modified binary which actually gets it) should reduce stack overflow errors.
// Increased memory (4GB, up from... no idea) should reduce 'Fatal process out of memory: Zone' errors.
const nodeArgs = '--stack-size=1500 --max-old-space-size=4096';
const nodeBin = '.\\node_modules\\node\\bin\\node.exe';

function execNode(script, scriptArgs, cb) {
    function quote(part) { return '"' + part + '"'; };

    const commandLine = [nodeBin, nodeArgs, quote(script), scriptArgs].join(' ');
    exec(commandLine, function (err, stdout, stderr) {
        if (stdout) console.log(stdout);
        if (stderr) console.log(stderr);
        cb(err);
    });
}

function clean(cb) {
    // Deletes contents as well, like rm -rf
    try {
        fs.removeSync('./build');
        cb();
    } catch(e) {
        cb(e);
    }
}

function less(cb) {
    var rawOutput = gulp
        .src('./**/*.less')
        .pipe(sourcemaps.init())
        .pipe(gulpLess({ paths: "./" }).on('error', cb))
        .pipe(concat('Bluewire.Epro.Modern.ServiceAndGeneratedPages.css'));

    var buildOutput = minify ? rawOutput.pipe(clone()).pipe(cleanCSS()) : rawOutput.pipe(clone());

    const build = buildOutput
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build'));

    return build;
}

function build_typescript(cb) {
    execNode('.\\node_modules\\typescript\\lib\\tsc.js', '--project tsconfig.json', cb);
}

function write_typescript() {
    const rawOutput = gulp.src('./build/Bluewire.Epro.Modern.ServiceAndGeneratedPages.js')
        .pipe(sourcemaps.init({ loadMaps: true }));

    const buildOutput = minify ? rawOutput.pipe(clone()).pipe(uglify(minifyOptions)) : rawOutput.pipe(clone());

    return buildOutput
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build'));    
}

const typescript = gulp.series(build_typescript, write_typescript);

exports.default = gulp.series(clean, typescript);
