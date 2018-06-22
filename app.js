var express = require('express');//var expose = require('express-expose');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var requireDir = require('require-dir');
var routes = requireDir('./routes/'); // www.npmjs.org/package/require-dir
var app = express();
var request = require('request');
var zlib = require('zlib');
var compression = require('compression');
app.use(compression());

var webpack = require('webpack');
var webpackConfig = require('./webpack.config.dev');
var compiler = webpack(webpackConfig);
//app.use('/pubic', express.static('pubic'))
app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true, publicPath: webpackConfig.output.publicPath
}));
app.use(require("webpack-hot-middleware")(compiler));


//var store_path= 'https://pangenome-store.nyc3.digitaloceanspaces.com'
var store_path= 'https://s3.eu-central-1.amazonaws.com/data.pangenome.ch'
app.get('*.fa', function (req, res, next) {
  res.setHeader("Content-Type", "text/plain");
  req.url=store_path+req.url.split('dataset')[1]+'.gz';
  // res.set('Content-Encoding', 'gzip');
  request(req.url)
    .on('response', (response) => {
      if (response.statusCode !== 200) {
        console.log('error status:', response.statusCode);
        console.log('error message:', response.statusMessage);
      }
    })
    //1st error: if something goes wrong and we won't get a response.
    //2nd error: if we got a response but file is missing or it's unavailable to decompress.
    .on('error', (e) => console.log(e))
    .pipe(zlib.createGunzip())
    .on('error', (e) => console.log(e))
    .pipe(res);  
//request(options).pipe(res);
});

// https://pangenome-store.nyc3.digitaloceanspaces.com/S_pneumoniae616/geneCluster/GC00000001_21_tree.json
// Notes: req.url: './dataset/S_pneumoniae616/geneCluster/GC00000001_21_tree.json'
app.get('*_tree.json', function (req, res, next) {
  req.url=store_path+req.url.split('dataset')[1]
  //console.log('---------- url of digitaloceanspaces ---------',req.url)
  request(req.url).pipe(res);
  //next();
});

app.get('*_patterns.json', function (req, res, next) {
  req.url=store_path+req.url.split('dataset')[1]
  //console.log('---------- url of digitaloceanspaces ---------',req.url)
  request(req.url).pipe(res);
  //next();
});


//"save loaded data to the global namespace"
//"To enable cross-domain requests, have the server set the header Access-Control-Allow-Origin."

/*app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
  });*/

if (0) {
  var auth = require('http-auth');
  var basic = auth.basic({
          realm: "pre-release version for VIPs"
      }, function (username, password, callback) { // Custom authentication method.
          callback(username === "1" && password === "2");
      }
  ); // !! not safe
  app.use(auth.connect(basic));
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
/*app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');*/

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index') );
// initial page
/*app.use('/', require('./routes/index') );*/
for (var i in routes)
  {app.use('/'+i, require('./routes/'+i)); //console.log(i)
  }


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.render('notFound')
  /*var err = new Error('Not Found');
  err.status = 404;
  next(err);*/
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.locals.pretty = true; // added this line to prettify html
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
