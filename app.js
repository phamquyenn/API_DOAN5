var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan');
const passport = require("passport");
const session = require('express-session');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var users = require('./controller/users');
var products = require('./controller/products');
var employees = require('./controller/employees');
var news = require('./controller/news');
var brand = require('./controller/brand');
var categories = require('./controller/categories');
var logins = require('./controller/login');
var uploadImage = require('./controller/UploadImage');






var app = express();

// Sử dụng body-parser để xử lý dữ liệu từ yêu cầu POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Add headers before the routes are defined
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/Acount', users);
app.use('/product', products);
app.use('/employees', employees);
app.use('/news', news);
app.use('/brand', brand);
app.use('/categories', categories);
app.use('/login', logins);

app.use('/image', uploadImage);










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
