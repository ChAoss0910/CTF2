//var createError = require('http-errors');
var express = require('express');
var path = require('path');
// const cookieParser = require('cookie-parser');
// const logger = require('morgan');
// const sassMiddleware = require('node-sass-middleware');
const indexRouter = require('./server/routes/index');
// const activationRouter = require('./routes/activation');
// const session = require("express-session");
var app = express();
const mongoose = require("mongoose");

//app.use(express.static('public'));

// //session
// app.use(cookieParser('1234'));
// app.use(session({
//     name: '_user_cookie',
//     secret: '1234',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {maxAge: 30 * 24 * 3600 * 1000}
// }));
//
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');
//
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(sassMiddleware({
//   src: path.join(__dirname, 'public'),
//   dest: path.join(__dirname, 'public'),
//   indentedSyntax: true, // true = .sass and false = .scss
//   sourceMap: true
// }));
// app.use(express.static(path.join(__dirname, 'public')));
// mongoose.connect("mongodb://localhost:27017", {useNewUrlParser: false});
app.get('/', function (req, res) {
    //res.send("Hello World!!!");
    res.sendFile(path.join('/home/ubuntu/home/CTF2/www/index.html'));

    
});

//app.use('/', indexRouter);

// app.use('/activation', activationRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
//

const port = process.env.PORT || 80;

app.listen(80, '172.31.5.224', () => console.log(`Server running on port ${port}`));


//module.exports = app;
