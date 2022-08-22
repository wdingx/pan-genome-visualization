//npm install gulp-concat gulp-rename gulp-uglify gulp-minify-css --save-dev
// Dependencies
var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');

gulp.task('miniCSS', function() {
	gulp.src([
  './public/stylesheets/pace-theme-center-atom.css',
  './public/stylesheets/bootstrap.min.css',
  './public/stylesheets/bootstrap_customized.css',
  './public/stylesheets/bootstrap-toggle.min.css',
	'./public/stylesheets/bootstrap-multiselect.css',
  './public/stylesheets/nouislider.min.css',
  './public/stylesheets/dc.css',
  './public/stylesheets/dataTables.bootstrap.css',
  './public/stylesheets/dataTables-customized.css',
	'./public/stylesheets/msa-new.css',
	'./public/stylesheets/d3-tip.css',
  './public/stylesheets/page-appearance.css',
  './public/stylesheets/autohiding-navbar2.css',
  './public/stylesheets/footer.css'
  ])
	    .pipe(minifyCSS({processImport: false}))
	    //.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
	    .pipe(concat('all-edge.css'))
	    .pipe(gulp.dest('./public/dist/'))
});

gulp.task('default', ['miniCSS']);
