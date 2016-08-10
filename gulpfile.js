
var gulp = require("gulp");
var gulpIf = require('gulp-if');
var useref = require('gulp-useref'); // helpful to concatenate js and minification from different folders 
var cssnano = require('gulp-cssnano'); // helpful to concatenate css and minification from different folders 
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var notify = require("gulp-notify");
var browserSync = require('browser-sync').create();

//test

// SASS TASK
gulp.task("sass", function(){
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css/'))
    .pipe(notify({message: "SASS run successfully", onLast: true}))
    .pipe(browserSync.reload({
      stream: true
    })) // reload the browser after css are updated
});

gulp.task('cleancss', ['sass'], function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
    .pipe(notify({message: "CSS concatenation and minification run successfully", onLast: true}))
});
// SASS TASK END

// USEREF TASK (It will conctaenate all js wrapped in comment containings info about the path a nd final dest)
gulp.task('cleanjs', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    // Minifies only if it's a JAVASCRIPT file
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'))
    .pipe(notify({message: "JS concatenation and minification run successfully", onLast: true}))
});
// USEREF TASK END

// BROWSER SYNC TASK
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})
// BROWSER SYNC TASK END

// -------------------------------------------------------------------------------------------------------------

//START THE WATCHERS
gulp.task('sync', ['browserSync', 'sass', 'cleanjs', 'cleancss'], function (){
  gulp.watch('app/scss/**/*.scss', ['cleancss']);
  gulp.watch('app/js/**/*.js', ['cleanjs']); 
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('app/*.html', browserSync.reload); 
  gulp.watch('app/js/**/*.js', browserSync.reload); 
});
//START THE WATCHERS END