//npm install gulp-concat gulp-rename gulp-uglify gulp-minify-css --save-dev 
// Dependencies
var gulp = require('gulp'); 
var concat = require('gulp-concat');  
var uglify = require('gulp-uglify');  
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');

// Task
gulp.task('miniJS', function() {
  gulp.src(['./public/javascripts/colors.js','./public/javascripts/species-list-info.js','./public/javascripts/wNumb.js','./public/javascripts/nouislider.min.js','./public/javascripts/jquery.min.js','./public/javascripts/lodash.min.js','./public/javascripts/bootstrap.min.js','./public/javascripts/bootstrap-toggle.min.js','./public/javascripts/jquery.bootstrap-autohidingnavbar.min.js','./public/javascripts/call-autohidingnavbar.js','./public/javascripts/d3.min.js','./public/javascripts/d3-tip.min.js','./public/javascripts/crossfilter.min.js','./public/javascripts/dc.min.js','./public/javascripts/jquery.dataTables.min.js','./public/javascripts/dataTables.tableTools.min.js','./public/javascripts/dataTables.scrollingPagination.js','./public/javascripts/dataTables.bootstrap.min.js','./public/javascripts/dataTables.autoFill.min.js','./public/javascripts/msa-new.min.js','./public/javascripts/tnt.tree.min.js','./public/javascripts/jquery.panzoom.min.js','./public/javascripts/reload.test2.min.js','./public/javascripts/init-homepage-interactiveLoad.js','./public/javascripts/tree-view-new.js','./public/javascripts/meta-color-legend.js','./public/javascripts/tooltips.js'])
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/dist/'))
});

gulp.task('miniCSS', function() {
	gulp.src(['./public/stylesheets/pace-theme-center-atom.css','./public/stylesheets/nouislider.min.css','./public/stylesheets/bootstrap.min.css','./public/stylesheets/bootstrap-toggle.min.css','./public/stylesheets/msa-new.css','./public/stylesheets/footer-distributed-with-address-and-phones.css','./public/stylesheets/page-appearance.css','./public/stylesheets/autohiding-navbar2.css','./public/stylesheets/d3-tip.css','./public/stylesheets/dc.css','./public/stylesheets/dataTables.bootstrap.css'])
	    .pipe(minifyCSS({processImport: false}))
	    //.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
	    .pipe(concat('all.css'))
	    .pipe(gulp.dest('./public/dist/'))
});

gulp.task('default', ['miniJS'], function() {
}); //,'miniCSS'