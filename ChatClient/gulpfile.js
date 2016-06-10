var gulp = require("gulp")
var clean = require("gulp-clean")
var tsc = require("gulp-typescript")
var runElectron = require("gulp-run-electron");

var tsProject = tsc.createProject("./tsconfig.json");

function GetPath(src_dir) {
    return {
        // typescript files
        scripts: [
            "./" + src_dir + "/**/*.ts",
            "./" + src_dir + "/**/*.tsx"
        ],
        typings: [
            "./typings/**/*.d.ts"
        ],
        // html, css and resource files
        assets: [
            "./" + src_dir + "/**/*.*",
            "!./" + src_dir + "/**/*.ts",
            "!./" + src_dir + "/**/*.tsx"
        ]
    };
}

var source_paths = GetPath("app")

var build_folder = "build"
var build_paths = GetPath(build_folder)


gulp.task("clean:assets", function() {
    return gulp.src(build_paths.assets, {read: false})
        .pipe(clean());
});

gulp.task("clean:scripts", function() {
    return gulp.src(build_paths.scripts, {read: false})
        .pipe(clean());
});

gulp.task("clean", function() {
    return gulp.src(build_folder, {read: false})
        .pipe(clean());
});

gulp.task("copy", ["clean:assets"], function() {
    return gulp.src(source_paths.assets)
        .pipe(gulp.dest(build_folder));
});

gulp.task("compile", ["clean:scripts"], function() {
    return gulp.src(source_paths.scripts.concat(source_paths.typings))
        .pipe(tsc(tsProject)).js
        .pipe(gulp.dest(build_folder));
});

gulp.task("start", ["copy", "compile"], function () {
    return gulp.src(build_folder)
        .pipe(runElectron());
});

gulp.task("watch", ["start"], function () {
    gulp.watch(source_paths.scripts, ["compile"]);
    gulp.watch(source_paths.assets, ["copy"]);
});
