//npm install gulp-concat gulp-rename gulp-uglify gulp-minify-css --save-dev 
// Dependencies
var gulp = require('gulp'); 
var concat = require('gulp-concat');  
var uglify = require('gulp-uglify');  
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');

// Task
gulp.task('miniJS', function() {
  gulp.src(['./public/javascripts/colors.js',
           './public/javascripts/species-list-info.js',
           './public/javascripts/third_party/wNumb.js',
           './public/javascripts/third_party/nouislider.min.js',
           './public/javascripts/third_party/jquery.min.js',
           './public/javascripts/third_party/lodash.min.js',
           './public/javascripts/third_party/bootstrap.min.js',
           './public/javascripts/third_party/bootstrap-toggle.min.js',
           './public/javascripts/third_party/jquery.bootstrap-autohidingnavbar.min.js',
           './public/javascripts/third_party/call-autohidingnavbar.js',
           './public/javascripts/third_party/d3.min.js',
           './public/javascripts/third_party/d3-tip.min.js',
           './public/javascripts/third_party/crossfilter.min.js',
           './public/javascripts/third_party/dc.min.js',
           './public/javascripts/third_party/jquery.dataTables.min.js',
           './public/javascripts/third_party/dataTables.tableTools.min.js',
           './public/javascripts/third_party/dataTables.scrollingPagination.js',
           './public/javascripts/third_party/dataTables.bootstrap.min.js',
           './public/javascripts/third_party/dataTables.autoFill.min.js',
           './public/javascripts/third_party/msa-new.min.js',
           './public/javascripts/third_party/tnt.tree.min.js',
           './public/javascripts/third_party/jquery.panzoom.min.js',
           './public/javascripts/reload.test2.min.js',
           './public/javascripts/init-homepage-interactiveLoad.js',
           './public/javascripts/tree-view-new.js',
           './public/javascripts/meta-color-legend.js',
           './public/javascripts/tooltips.js'])
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/dist/'))
});

gulp.task('miniCSS', function() {
	gulp.src(['./public/stylesheets/pace-theme-center-atom.css',
             './public/stylesheets/nouislider.min.css',
             './public/stylesheets/bootstrap.min.css',
             './public/stylesheets/bootstrap-toggle.min.css',
             './public/stylesheets/msa-new.css',
             './public/stylesheets/footer.css',
             './public/stylesheets/page-appearance.css',
             './public/stylesheets/autohiding-navbar2.css',
             './public/stylesheets/d3-tip.css','./public/stylesheets/dc.css',
             './public/stylesheets/dataTables.bootstrap.css'])
	    .pipe(minifyCSS({processImport: false}))
	    //.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
	    .pipe(concat('all.css'))
	    .pipe(gulp.dest('./public/dist/'))
});

gulp.task('default', ['miniJS', 'miniCSS'], function() {});
