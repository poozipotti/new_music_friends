const gulp = require("gulp");
const spawn = require("child_process").spawn;
const concatenate = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
const autoPrefix = require("gulp-autoprefixer");
const gulpSASS = require("gulp-sass");
const rename = require("gulp-rename");
const log = require("fancy-log");

const sassFiles = [
  "./src/styles/variables.scss",
  "./src/styles/custom.scss",
  "./src/styles/chat.scss",
  "./src/styles/bootstrap/scss/bootstrap.scss"
];

const vendorJsFiles = [
  "./node_modules/jquery/dist/jquery.min.js",
  "./node_modules/popper.js/dist/umd/popper.min.js",
  "./node_modules/bootstrap/dist/js/bootstrap.min.js"
];

gulp.task("sass", () => {
  gulp
    .src(sassFiles)
    .pipe(gulpSASS().on('error',gulpSASS.logError))
    .pipe(concatenate("styles.css"))
    .pipe(gulp.dest("./src/css/"))
    .pipe(
      autoPrefix({
        browsers: ["last 2 versions"],
        cascade: false
      })
    )
    .pipe(cleanCSS())
    .pipe(rename("styles.min.css"))
    .pipe(gulp.dest("./src/css/"));
});

gulp.task("js:vendor", () => {
  gulp
    .src(vendorJsFiles)
    .pipe(concatenate("vendor.min.js"))
    .pipe(gulp.dest("./public/js/"));
});

gulp.task("build", ["sass", "js:vendor"]);

gulp.task("watch", () => {
  gulp.watch(sassFiles, ["sass"]);
});

gulp.task("default", ["watch"]);
