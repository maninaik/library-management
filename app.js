var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var helmet = require('helmet');
var compression = require('compression');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog')

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//logger
app.use(logger('dev'));

//for using post
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//for production 
app.use(compression());
app.use(helmet());

//for static files
app.use(express.static(path.join(__dirname, 'public')));

//db

var db_password = ''; //here you need to put the password of your mongo DB user you will create.
//database url 
var dev_db = 'mongodb+srv://libraryManagementUser:'+db_password+'@cluster0.brvbr.mongodb.net/library-management-db?retryWrites=true&w=majority'
var mongodb = process.env.MONGODB_URI || dev_db;  


mongoose.connect(mongodb, {
    useNewUrlParser:true,
    useUnifiedTopology:true
})

var db = mongoose.connection

db.on('error', console.error.bind(console, 'Mongo DB connection error: '))

//routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
