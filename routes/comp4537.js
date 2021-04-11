
const getCurrentDate = require('../modules/utils');
const express = require('express');
const router = express.Router();
const data = require('../data.json');

router.route('/labs/1/index')
.get(function (req, res) {
    res.render('lab1/index');
});

router.route('/labs/2/admin/')
.get(function (req, res) {
    res.render('lab2/admin');
});

router.route('/labs/2/student/')
.get(function (req, res) {
    res.render('lab2/student');
});

router.route('/labs/2/index/')
.get(function (req, res) {
    res.render('lab2/index');
});

router.route('/labs/4/getDate/')
.get(function (req, res) {
    res.render('lab4/getDate', {name:req.query.name, date: getCurrentDate()})
});

router.route('/labs/4/index/')
.get(function (req, res) {
    res.render('lab4/index');
});

router.route('/labs/5/index/')
.get(function (req, res) {
    res.render('lab5/index');
});

router.route('/labs/5/writeDB.html')
.get(function (req, res) {
    res.render('lab5/write');
});

router.route('/labs/5/readDB.html')
.get(function (req, res) {
    res.render('lab5/read');
});

router.route('/assignments/1/index')
.get(function (req, res) {
    res.render('assignment1/index');
});

router.route('/assignments/1/admin/')
.get(function (req, res) {
    res.render('assignment1/admin');
});

router.route('/assignments/1/student/')
.get(function (req, res) {
    res.render('assignment1/student');
});


router.route('/').get(function (req, res, next) {
    res.render('comp4537', { labs: data.labs });
});

router.route('/comp4537.html').get(function (req, res, next) {
    res.render('comp4537', { labs: data.labs });
});

module.exports = router;
