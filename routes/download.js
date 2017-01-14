var express = require('express');
var router = express.Router();

/* GET users listing. */

router.get('/', function(req, res) {
  res.render('download', { title: 'download' });
  /*res.send('<ul> <li>1</li> <li>2</li> <li>3</li> <li>4</li> <li>Download <a href="/download/amazing.txt">amazing.txt</a>.</li> </ul>');*/
});

/*var path = require('path');
router.get('/', function(req, res){
	//var file = req.params.file;
  	//path =   './public/files/' + file;
  //var file = __dirname + './public/files/';
  var file='./public/files/' + req.params.file;
  var filename = path.basename(file);
  //var mimetype = mime.lookup(file);

  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);

  var filestream = fs.createReadStream(file);
  filestream.pipe(res);
});*/

router.get('/:file(*)', function(req, res, next){
  var file = req.params.file,
  	path =   './public/downloads/' + file;
    //path = __dirname + '/files/' + file;
  res.download(path);
});/**/

module.exports = router;