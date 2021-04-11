const express = require('express');
const router = express.Router();
const userHandler = require('./users');
const courseHandler = require('./courses');
const authHandler = require('./auth');
const countHandler = require('./count');
const favoriteHandler = require('./favorites');
const enrollmentHandler = require('./enrollments');
const roleHandler = require('./roles');
const emailHandler = require('./emails');
const studentHandler = require('./students');
const professorHandler = require('./professors');

router.route('/users').all((req,res) => {
  return userHandler(req, res);
})

router.route('/courses').all((req,res) => {
  return courseHandler(req, res);
})

router.route('/auth').all((req,res) => {
  return authHandler(req, res);
})

router.route('/favorites').all((req,res) => {
  return favoriteHandler(req, res);
})

router.route('/count').all((req, res) => {
  return countHandler(req, res);
})

router.route('/enrollments').all((req, res) => {
  return enrollmentHandler(req, res);
})

router.route('/roles').all((req, res) => {
  return roleHandler(req, res);
})

router.route('/emails').all((req, res) => {
  return emailHandler(req, res);
})

router.route('/students').all((req, res) => {
  return studentHandler(req, res);
})

router.route('/professors').all((req, res) => {
  return professorHandler(req, res);
})

module.exports = router;