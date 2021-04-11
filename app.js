const createError = require('http-errors');
const express = require('express');
const cors = require("cors");


const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config({path: __dirname + '/.env'})
const rateLimit = require("express-rate-limit");

const indexRouter = require('./routes/index');
const comp4537Router = require('./routes/comp4537');
const pgConnectionRouter = require('./routes/v0/pgConnection');
const myConnectionRouter = require('./routes/v1/myConnection');

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

const app = express();

app.use(cors());
app.options("*", cors());
app.use(limiter);
app.disable('x-powered-by')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

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
app.use('/', indexRouter);
app.use('/comp4537', comp4537Router);
app.use('/api/v0', pgConnectionRouter);
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
