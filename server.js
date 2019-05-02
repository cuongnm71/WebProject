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
app.use(expressValidator())
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: false}));
var configDB = require('./config/database.js');

mongoose.connect(configDB.url); // connect tới database
app.use(morgan('dev'));
let User = require('./models/user.js')
// Passport
require('./config/passport')(passport);
// Login Form
app.get('/login', (req, res) => {
  res.render('login.ejs');
})
app.post('/login', passport.authenticate('local', {
  successRedirect: '/abc',
  failureRedirect: '/loginx'
}));
app.get('/', (req, res) => {
  res.render('login.ejs');
})

// Register form
app.get('/register', (req, res) => {
  res.render('register.ejs');
})
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

// Cấu hình ứng dụng express
 // sử dụng để log mọi request ra console
app.use(cookieParser()); // sử dụng để đọc thông tin từ cookie
app.use(bodyParser()); // lấy thông tin từ form HTML

app.set('view engine', 'ejs'); // chỉ định view engine là ejs

// app.get('/', (req, res) => {
//   res.render('index.ejs');
// })
// app.get('/about', (req, res) => {
//   res.render('about.ejs')
// })


// app.use(session({ secret: 'xxxxxxxxxxxxx' }));



// require('./app/routes.js')(app, passport); // load các routes từ các nguồn

app.listen(port);
