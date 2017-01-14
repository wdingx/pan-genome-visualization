var express = require('express');
var router = express.Router();
var auth = require('http-auth');
var basic = auth.basic({
        realm: "pre-release version for VIPs"
    }, function (username, password, callback) { // Custom authentication method.
        callback(username === "1" && password === "2");
    }
); // !! not safe

/* GET home page. */
router.get('/', auth.connect(basic), function(req, res) {
  res.render('m_test', { title: '' });
  //res.sendfile(__dirname + '/public/clienthtml/index.html');
});

module.exports = router;
