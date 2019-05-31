require('dotenv').config()
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const port = process.env.PORT;
const morgan = require('morgan');
const app = express();
const path = require('path');

const passport = require('passport');
const flash = require('connect-flash');

// Connection
const mysql = require('mysql');
const dbconfig = require('./config/database');
const connection = mysql.createPool(dbconfig.connection);
connection.query('USE ' + dbconfig.database);

require('./config/passport')(passport, connection);
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
 secret: process.env.SECRET,
 resave:true,
 saveUninitialized: true,
 cookie: {maxAge: 1000 * 60 * 30}
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
