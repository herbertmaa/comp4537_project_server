const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index',);
});

router.get('/index.html', function (req, res, next) {
  res.render('index',);
});

module.exports = router;