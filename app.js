const createError = require('http-errors');
const express = require('express');
const cors = require("cors");


const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config({path: __dirname + '/.env'})
const rateLimit = require("express-rate-limit");

const myConnectionRouter = require('./routes/v1/myConnection');

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 1000 requests per windowMs
});

const app = express();

app.use(cors());
app.options("*", cors());
app.use(limiter);
app.disable('x-powered-by')


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.locals.courses = {
  getCount: 0,
  putCount: 0,
  postCount: 0,
  deleteCount: 0,
}

app.locals.users = {
  getCount: 0,
  putCount: 0,
  postCount: 0,
  deleteCount: 0,
}

app.locals.favorites = {
  getCount: 0,
  putCount: 0,
  postCount: 0,
  deleteCount: 0,
}

app.locals.enrollments = {
  getCount: 0,
  putCount: 0,
  postCount: 0,
  deleteCount: 0,
}

app.locals.roles = {
  getCount: 0,
  putCount: 0,
  postCount: 0,
  deleteCount: 0,
}

app.locals.emails = {
  getCount: 0,
  putCount: 0,
  postCount: 0,
  deleteCount: 0,
}

app.locals.students = {
  getCount: 0,
  putCount: 0,
  postCount: 0,
  deleteCount: 0,
}

app.locals.professors = {
  getCount: 0,
  putCount: 0,
  postCount: 0,
  deleteCount: 0,
}
app.use('/favicon.ico', express.static('images/favicon.ico'));
app.use('/api/v1', myConnectionRouter);



// catch 404 and forward to handler for non production
app.use((req, res, next) => {
  next(createError(404));
});


//catch 404 and forward to handler for production
// app.use((err,req, res, next) => {
//   next(createError(404));
// });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
