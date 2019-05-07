var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var expressValidator = require('express-validator');
const bcrypt = require('bcryptjs');

app.use(expressValidator());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(bodyParser());

// Passport
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Set view engine to ejs
app.set('view engine', 'ejs');

// Connect to database
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);
app.use(morgan('dev'));
let User = require('./models/user.js')

// Login Form
app.get('/login', (req, res) => {
  res.render('login.ejs');
})
app.post('/login', passport.authenticate('local', {
  successRedirect: '/abc',
  failureRedirect: '/loginx'
}));

// Register form
app.get('/register', (req, res) => {
  res.render('register.ejs');
app.post('/register', function(req, res){
  // const name = req.body.name;
  // const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  // const password2 = req.body.password2;

  // req.checkBody('name', 'Name is required').notEmpty();
  // req.checkBody('email', 'Email is required').notEmpty();
  // req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  // req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors){
    res.render('register', {
      errors:errors
    });
  } else {
    let newUser = new User({
      // name:name,
      // email:email,
      username:username,
      password:password
    });

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if(err){
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function(err){
          if(err){
            console.log(err);
            return;
          } else {
            // req.flash('success','You are now registered and can log in');
            res.redirect('/login');
          }
        });
      });
    });
  }
});

})

// Testing
app.get('/testing', function (req, res) {
    var array = [
    {
        maCB: '1111',
        name: 'Lê Đình Thanh',
        username: 'thanhld',
        vnumail: 'thanhld@gmail.com',
        usertype: 'Giảng viên',
    },
    {
        maCB: '2222',
        name: 'Trần Thị Minh Châu',
        username: 'chauttm',
        vnumail: 'chauttm@gmail.com',
        usertype: 'Giảng viên',
    }
  ]
    res.render('load.ejs', {array: array});
    //load is the ejs file (load.ejs) and array is the array of object.
});

// app.use(session({ secret: 'xxxxxxxxxxxxx' }));

// require('./app/routes.js')(app, passport); // load các routes từ các nguồn

app.listen(port);
