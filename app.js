var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var port = process.env.PORT || 8080;
var morgan = require('morgan');
var app = express();
var path = require('path');

var passport = require('passport');
var flash = require('connect-flash');

// Connection
var mysql = require('mysql');
var dbconfig = require('./config/database');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);

require('./config/passport')(passport);
// Set public path
app.use(express.static(path.resolve('./public')));

//Set view path
app.set('views', path.join(__dirname, '/views'));

// app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Set view engine to ejs
app.set('view engine', 'ejs');

// Sesion
app.use(session({
 secret: 'justasecret',
 resave:true,
 saveUninitialized: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Route
require('./routes/router.js')(app, passport, connection);

// Run server
app.listen(port);
console.log("Server running on: " + port);
