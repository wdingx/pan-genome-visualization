var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('pipeline', { title: 'pipeline' });
});

module.exports = router;